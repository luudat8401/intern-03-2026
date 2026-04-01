const { AppDataSource } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authDto = require("../dtos/auth.dto");
const dotenv = require("dotenv");
dotenv.config();
const { OAuth2Client } = require("google-auth-library");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {
  async register({ username, password, role, name, phone, email, address }) {
    const accountRepo = AppDataSource.getRepository("Account");
    const masterRepo = AppDataSource.getRepository("Master");
    const userRepo = AppDataSource.getRepository("User");

    const existingAccount = await accountRepo.findOne({ where: { username } });
    if (existingAccount) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userId = null;
    let masterId = null;

    if (role === "master") {
      const master = masterRepo.create({
        name: name || username,
        phone: phone || "0000000000",
        email: email || "temp@mail.com",
        address: address || "Chưa cập nhật",
      });
      const savedMaster = await masterRepo.save(master);
      masterId = savedMaster.id;
    } else if (role === "user") {
      const user = userRepo.create({
        name: name || username,
        phone: phone || "0000000000",
      });
      const savedUser = await userRepo.save(user);
      userId = savedUser.id;
    }

    const account = accountRepo.create({
      username,
      password: hashedPassword,
      role,
      userId,
      masterId,
    });

    await accountRepo.save(account);
    return { message: "Đăng ký thành công!" };
  }

  async login(username, password) {
    const accountRepo = AppDataSource.getRepository("Account");
    const account = await accountRepo.findOne({ 
      where: { username },
      relations: ["user", "master"]
    });

    if (!account) {
      throw new Error("Tài khoản không tồn tại");
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new Error("Mật khẩu không chính xác");
    }

    const profileId = account.role === "master" ? account.masterId : account.userId;
    
    // Tạo token payload
    const token = jwt.sign(
      {
        id: account.id,
        role: account.role,
        profileId: profileId,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return authDto.loginResponse(account, token);
  }

  async googleLogin(credential, role) {
    const accountRepo = AppDataSource.getRepository("Account");
    const masterRepo = AppDataSource.getRepository("Master");
    const userRepo = AppDataSource.getRepository("User");

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Tìm bằng googleId hoặc email. TypeORM query syntax $or is array of objects
    let account = await accountRepo.findOne({ 
      where: [
        { googleId },
        { email }
      ],
      relations: ["user", "master"]
    });

    const finalRole = role || "user";

    if (!account) {
      let userId = null;
      let masterId = null;

      const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
      const username = baseUsername + "_" + googleId.substring(0, 4);

      if (finalRole === "master") {
        const master = masterRepo.create({
          name: name,
          phone: "0000000000",
          email: email,
          address: "Chưa cập nhật",
        });
        const savedMaster = await masterRepo.save(master);
        masterId = savedMaster.id;
      } else {
        const user = userRepo.create({
          name: name,
          phone: "0000000000",
        });
        const savedUser = await userRepo.save(user);
        userId = savedUser.id;
      }

      const newAccount = accountRepo.create({
        username: username,
        googleId,
        email,
        avatar: picture,
        role: finalRole,
        userId,
        masterId,
      });

      account = await accountRepo.save(newAccount);
      
      // Reload relations
      account = await accountRepo.findOne({
        where: { id: account.id },
        relations: ["user", "master"]
      });
    } else {
      if (!account.googleId) {
        account.googleId = googleId;
        account.avatar = picture;
        await accountRepo.save(account);
      }
    }

    const profileId = account.role === "master" ? account.masterId : account.userId;
    const token = jwt.sign(
      {
        id: account.id,
        role: account.role,
        profileId: profileId,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return authDto.loginResponse(account, token);
  }
}

module.exports = new AuthService();

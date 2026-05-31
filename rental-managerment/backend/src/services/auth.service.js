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

    const existingAccount = await accountRepo.findOne({ where: { username, role } });
    if (existingAccount) {
      throw new Error(`Tên đăng nhập đã tồn tại với vai trò ${role}`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userId = null;
    let masterId = null;

    if (role === "master") {
      const master = masterRepo.create({
        name: name,
        phone: phone,
        email: email || null,
        address: address || null,
      });
      const savedMaster = await masterRepo.save(master);
      masterId = savedMaster.id;
    } else if (role === "user") {
      const user = userRepo.create({
        name: name,
        phone: phone,
        email: email,
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

  async login(username, password, role) {
    console.log(username, password, role);
    const accountRepo = AppDataSource.getRepository("Account");
    const account = await accountRepo.findOne({
      where: { username, role },
      relations: ["user", "master"]
    });
    console.log(account);
    if (!account) {
      throw new Error("Tài khoản không tồn tại");
    }
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      throw new Error("Mật khẩu không chính xác");
    }
    // Fallback: Admin không có user/master profile → dùng account.id làm profileId dự phòng
    const profileId = account.role === "master"
      ? account.masterId
      : account.userId || (account.role === 'admin' ? account.id : null);

    const token = jwt.sign(
      {
        id: account.id,
        role: account.role,
        profileId: profileId, 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return authDto.loginResponse(account, token);
  }

  async googleLogin(credential) {
    const accountRepo = AppDataSource.getRepository("Account");
    const userRepo = AppDataSource.getRepository("User");

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Tìm bằng googleId hoặc email. 
    let account = await accountRepo.findOne({
      where: [
        { googleId },
        { email }
      ],
      relations: ["user", "master"]
    });

    if (!account) {
      const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
      const username = baseUsername + "_" + googleId.substring(0, 4);

      const user = userRepo.create({
        name: name,
        phone: "0000000000",
      });
      const savedUser = await userRepo.save(user);

      const newAccount = accountRepo.create({
        username: username,
        googleId,
        email,
        avatar: picture,
        role: "user",
        userId: savedUser.id,
      });

      account = await accountRepo.save(newAccount);

      // Reload relations
      account = await accountRepo.findOne({
        where: { id: account.id },
        relations: ["user"]
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

  async changePassword(accountId, oldPassword, newPassword) {
    const accountRepo = AppDataSource.getRepository("Account");
    const account = await accountRepo.findOne({ where: { id: parseInt(accountId) } });

    if (!account) {
      throw new Error("Tài khoản không tồn tại");
    }

    if (account.password) {
      const isMatch = await bcrypt.compare(oldPassword, account.password);
      if (!isMatch) {
        throw new Error("Mật khẩu cũ không chính xác");
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    account.password = hashedPassword;
    await accountRepo.save(account);

    return { message: "Đổi mật khẩu thành công!" };
  }
}

module.exports = new AuthService();
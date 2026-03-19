const http = require("http");
const fs = require("fs").promises;
const url = require("url");
const PORT = 3000;
const DATA_FILE = "./data.json";
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return []; 
  }
}
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}
function send(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject("Invalid JSON");
      }
    });
  });
}
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  try {
    if (method === "GET" && path.startsWith("/users/")) {
      const id = path.split("/")[2];
      const data = await readData();
      const user = data.find(u => u.id === id);
      if (!user) {
        return send(res, 404, { message: "User not found" });
      }
      return send(res, 200, user);
    }
    if (method === "GET" && path === "/users") {
      const data = await readData();
      const query = parsedUrl.query;
      console.log(query);
      if (Object.keys(query).length === 0) {
        return send(res, 200, data);
      }
      let result = data.filter(user => {
        return Object.keys(query).every(key => {
          if (key === "sort") return true; 
          const userValue = user[key];
          if (userValue === undefined || userValue === null) {
            return false;
          }
          return userValue
            .toString()
            .toLowerCase()
            .includes(query[key].trim().toLowerCase());
        });
      });
      if (query.sort){
        const [sortKey, sortOrder] = query.sort
          .replace("[", "")
          .replace("]", "")
          .split(",");
        result.sort((a, b) => {
          const valA = a[sortKey];
          const valB = b[sortKey];
          if (typeof valA === "number" && typeof valB === "number") {
            return sortOrder === "asc" ? valA - valB : valB - valA;
          }
          return sortOrder === "asc"
            ? valA.toString().localeCompare(valB.toString())
            : valB.toString().localeCompare(valA.toString());
        });
      }
      return send(res, 200, result);
    }
    if (method === "POST" && path === "/users") {
      let newUser;
      try {
        newUser = await getRequestBody(req);
      } catch {
        return send(res, 400, { message: "Invalid JSON" });
      }
      if (!newUser.name) {
        return send(res, 400, { message: "Thiếu name" });
      }
      const data = await readData();
      const user = {
        id: Date.now().toString(),
        ...newUser
      };
      data.push(user);
      await writeData(data);
      return send(res, 201, user);
    }
    if (method === "PUT" && path.startsWith("/users/")) {
      const id = path.split("/")[2];
      let updatedData;
      try {
        updatedData = await getRequestBody(req);
      } catch {
        return send(res, 400, { message: "Invalid JSON" });
      }
      const data = await readData();
      const index = data.findIndex(u => u.id === id);
      if (index === -1) {
        return send(res, 404, { message: "User not found" });
      }
      const updatedUser = {
        id,
        ...updatedData
      };
      data[index] = updatedUser;
      await writeData(data);
      return send(res, 200, {
        message: "User updated",
        data: updatedUser
      });
    }
    if (method === "PATCH" && path.startsWith("/users/")) {
      const id = path.split("/")[2];
      let updateFields;
      try {
        updateFields = await getRequestBody(req);
      } catch {
        return send(res, 400, { message: "Invalid JSON" });
      }
      const data = await readData();
      const index = data.findIndex(u => u.id === id);
      if (index === -1) {
        return send(res, 404, { message: "User not found" });
      }
      const oldUser = data[index];
      const updatedUser = {
        ...oldUser,
        ...updateFields,
        id: oldUser.id
      };
      data[index] = updatedUser;
      await writeData(data);
      return send(res, 200, {
        message: "User updated (partial)",
        data: updatedUser
      });
    }
    if (method === "DELETE" && path.startsWith("/users/")) {
        const id = path.split("/")[2];
        const data = await readData();
        const newData = data.filter(u => u.id !== id);
        if (newData.length === data.length) {
            return send(res, 404, { message: "User not found" });
        }
        await writeData(newData);
        return send(res, 200, { message: "User deleted" });
    }
    return send(res, 404, { message: "Route not found" });
  } catch (error) {
        console.error(error);
        return send(res, 500, { message: "Server error" });
  }
});
server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
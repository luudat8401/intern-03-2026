const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Account",
  tableName: "accounts",
  columns: {
    id: { primary: true, type: "int", generated: true },
    username: { type: "varchar", unique: true, nullable: false },
    password: { type: "varchar", nullable: true },
    googleId: { type: "varchar", unique: true, nullable: true },
    email: { type: "varchar", nullable: true },
    avatar: { type: "varchar", nullable: true },
    role: { type: "varchar", nullable: false }, 
    status: { type: "varchar", default: "active", nullable: false },
    userId: { type: "int", nullable: true, unique: true },
    masterId: { type: "int", nullable: true, unique: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", createDate: true }
  },
  relations: {
    user: {
      target: "User",
      type: "one-to-one",
      joinColumn: { name: "userId" },
      onDelete: "CASCADE",
      nullable: true
    },
    master: {
      target: "Master",
      type: "one-to-one",
      joinColumn: { name: "masterId" },
      onDelete: "CASCADE",
      nullable: true
    }
  }
});

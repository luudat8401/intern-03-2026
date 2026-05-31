const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Account",
  tableName: "accounts",
  columns: {
    id: { primary: true, type: "int", generated: true },
    username: { type: "varchar", nullable: false },
    password: { type: "varchar", nullable: true },
    googleId: { type: "varchar", unique: true, nullable: true, name: "google_id" },
    email: { type: "varchar", nullable: true },
    avatar: { type: "varchar", nullable: true },
    role: { type: "varchar", nullable: false },
    status: { type: "varchar", default: "active", nullable: false },
    userId: { type: "int", nullable: true, unique: true, name: "user_id" },
    masterId: { type: "int", nullable: true, unique: true, name: "master_id" },
    createdAt: { type: "timestamp", createDate: true, name: "created_at" },
    updatedAt: { type: "timestamp", createDate: true, name: "updated_at" }
  },
  uniques: [
    {
      name: "UQ_USERNAME_ROLE",
      columns: ["username", "role"]
    }
  ],
  relations: {
    user: {
      target: "User",
      type: "one-to-one",
      joinColumn: { name: "user_id" },
      onDelete: "CASCADE",
      nullable: true
    },
    master: {
      target: "Master",
      type: "one-to-one",
      joinColumn: { name: "master_id" },
      onDelete: "CASCADE",
      nullable: true
    }
  }
});

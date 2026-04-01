const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Contract",
  tableName: "contracts",
  columns: {
    id: { primary: true, type: "int", generated: true },
    price: { type: "float", nullable: false },
    startDate: { type: "timestamp", nullable: false },
    endDate: { type: "timestamp", nullable: false },
    status: { type: "smallint", default: 0, nullable: false }, // 0: pending, 1: active, 2: declined, 3: cancelled, 4: completed
    deposit: { type: "float", default: 0, nullable: false },
    userId: { type: "int", nullable: false },
    roomId: { type: "int", nullable: false },
    masterId: { type: "int", nullable: false },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", createDate: true }
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "userId" },
      onDelete: "CASCADE"
    },
    room: {
      target: "Room",
      type: "many-to-one",
      joinColumn: { name: "roomId" },
      onDelete: "CASCADE"
    },
    master: {
      target: "Master",
      type: "many-to-one",
      joinColumn: { name: "masterId" },
      onDelete: "CASCADE"
    }
  }
});

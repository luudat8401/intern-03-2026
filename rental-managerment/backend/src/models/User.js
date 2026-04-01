const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
      nullable: false
    },
    phone: {
      type: "varchar",
      nullable: false
    },
    isRepresentative: {
      type: "boolean",
      default: false,
      nullable: false
    },
    status: {
      type: "smallint",
      default: 0, // 0: active, 1: inactive
      nullable: false
    },
    roomId: {
      type: "int",
      nullable: true
    },
    createdAt: {
      type: "timestamp",
      createDate: true
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true
    }
  },
  relations: {
    room: {
      target: "Room",
      type: "many-to-one",
      joinColumn: { name: "roomId" },
      onDelete: "SET NULL",
      nullable: true
    },
    account: {
      target: "Account",
      type: "one-to-one",
      inverseSide: "user"
    },
    contracts: {
      target: "Contract",
      type: "one-to-many",
      inverseSide: "user"
    }
  }
});
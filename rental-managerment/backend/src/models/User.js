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
      unique: true,
      nullable: false
    },
    isRepresentative: {
      type: "boolean",
      default: false,
      nullable: false,
      name: "is_representative"
    },
    status: {
      type: "smallint",
      default: 0, // 0: active, 1: inactive
      nullable: false
    },
    roomId: {
      type: "int",
      nullable: true,
      name: "room_id"
    },
    email: {
      type: "varchar",
      nullable: true,
      unique: true
    },
    address: {
      type: "varchar",
      nullable: true
    },
    avatar: {
      type: "varchar",
      nullable: true
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
      name: "created_at"
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
      name: "updated_at"
    }
  },
  relations: {
    room: {
      target: "Room",
      type: "many-to-one",
      joinColumn: { name: "room_id" },
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
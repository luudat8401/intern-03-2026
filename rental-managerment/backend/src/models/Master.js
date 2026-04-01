const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Master",
  tableName: "masters",
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
    email: {
      type: "varchar",
      unique: true,
      nullable: false
    },
    address: {
      type: "varchar",
      nullable: false
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
    account: {
      target: "Account",
      type: "one-to-one",
      inverseSide: "master"
    },
    rooms: {
      target: "Room",
      type: "one-to-many",
      inverseSide: "master"
    },
    contracts: {
      target: "Contract",
      type: "one-to-many",
      inverseSide: "master"
    }
  }
});

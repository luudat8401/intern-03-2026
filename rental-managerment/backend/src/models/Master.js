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
      nullable: true
    },
    email: {
      type: "varchar",
      unique: true,
      nullable: true
    },
    address: {
      type: "varchar",
      nullable: true
    },
    bankName: {
      type: "varchar",
      nullable: true
    },
    bankAccountNumber: {
      type: "varchar",
      nullable: true
    },
    bankAccountHolder: {
      type: "varchar",
      nullable: true
    },
    bankBranch: {
      type: "varchar",
      nullable: true
    },
    avatar: {
      type: "varchar",
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

const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Room",
  tableName: "rooms",
  columns: {
    id: { primary: true, type: "int", generated: true },
    roomNumber: { type: "varchar", unique: true, nullable: false },
    price: { type: "float", nullable: false },
    status: { type: "smallint", default: 0, nullable: false },
    capacity: { type: "smallint", default: 2, nullable: false },
    currentTenants: { type: "smallint", default: 0, nullable: false },
    thumbnail: { type: "varchar", nullable: false },
    city: { type: "varchar", default: "Hồ Chí Minh", nullable: false },
    ward: { type: "varchar", default: "Phường trung tâm", nullable: false },
    location: { type: "varchar", nullable: false },
    title: { type: "varchar", default: "Phòng trọ cao cấp", nullable: false },
    district: { type: "varchar", default: "Quận trung tâm", nullable: false },
    area: { type: "varchar", default: "20m2", nullable: false },
    isTrending: { type: "boolean", default: false, nullable: false },
    amenities: { type: "jsonb", nullable: true, default: "[]" },
    description: { type: "text", nullable: true },
    masterId: { type: "int", nullable: false },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true }
  },
  relations: {
    master: {
      target: "Master",
      type: "many-to-one",
      joinColumn: { name: "masterId" },
      onDelete: "CASCADE"
    },
    users: {
      target: "User",
      type: "one-to-many",
      inverseSide: "room"
    },
    contracts: {
      target: "Contract",
      type: "one-to-many",
      inverseSide: "room"
    }
  }
});
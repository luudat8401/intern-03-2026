const { Table } = require("typeorm");

module.exports = class InitialSchema1711872000000 {
  name = "InitialSchema1711872000000";

  async up(queryRunner) {
    // 1. Tạo bảng masters
    await queryRunner.createTable(
      new Table({
        name: "masters",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", isNullable: false },
          { name: "phone", type: "varchar", isUnique: true, isNullable: false },
          { name: "email", type: "varchar", isUnique: true, isNullable: false },
          { name: "address", type: "varchar", isNullable: false },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
      }),
      true
    );
    // 2. Tạo bảng rooms
    await queryRunner.createTable(
      new Table({
        name: "rooms",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "room_number", type: "varchar", isUnique: true, isNullable: false },
          { name: "price", type: "float", isNullable: false },
          { name: "status", type: "smallint", default: 0, isNullable: false }, // 0: trống, 1: đã thuê
          { name: "capacity", type: "smallint", default: 2, isNullable: false },
          { name: "current_tenants", type: "smallint", default: 0, isNullable: false },
          { name: "thumbnail", type: "varchar", isNullable: false },
          { name: "city", type: "varchar", default: "'Hồ Chí Minh'", isNullable: false }, // ghi chú
          { name: "ward", type: "varchar", default: "'Phường trung tâm'", isNullable: false },
          { name: "location", type: "varchar", isNullable: false },
          { name: "title", type: "varchar", default: "'Phòng trọ cao cấp'", isNullable: false },
          { name: "district", type: "varchar", default: "'Quận trung tâm'", isNullable: false },
          { name: "area", type: "varchar", default: "'20m2'", isNullable: false }, //varchar 
          { name: "is_trending", type: "boolean", default: false, isNullable: false },
          { name: "master_id", type: "int", isNullable: false },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
        foreignKeys: [
          {
            columnNames: ["master_id"],
            referencedTableName: "masters",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );
    // 3. Tạo bảng users
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", isNullable: false },
          { name: "phone", type: "varchar", isNullable: false },
          { name: "is_representative", type: "boolean", default: false, isNullable: false },
          { name: "status", type: "smallint", default: 0, isNullable: false }, // 0: active, 1: inactive
          { name: "room_id", type: "int", isNullable: true },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
        foreignKeys: [
          {
            columnNames: ["room_id"],
            referencedTableName: "rooms",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
        ],
      }),
      true
    );

    // 4. Tạo bảng accounts
    await queryRunner.createTable(
      new Table({
        name: "accounts",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "username", type: "varchar", isUnique: true, isNullable: false },
          { name: "password", type: "varchar", isNullable: true },
          { name: "google_id", type: "varchar", isUnique: true, isNullable: true },
          { name: "email", type: "varchar", isNullable: true },
          { name: "avatar", type: "varchar", isNullable: true },
          { name: "role", type: "varchar", isNullable: false },
          { name: "status", type: "varchar", default: "'active'", isNullable: false },
          { name: "user_id", type: "int", isNullable: true, isUnique: true },
          { name: "masterId", type: "int", isNullable: true, isUnique: true },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
        foreignKeys: [
          {
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            columnNames: ["master_id"],
            referencedTableName: "masters",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );

    // 5. Tạo bảng contracts
    await queryRunner.createTable(
      new Table({
        name: "contracts",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "price", type: "float", isNullable: false },
          { name: "start_date", type: "timestamp", isNullable: false },
          { name: "end_date", type: "timestamp", isNullable: false },
          { name: "status", type: "smallint", default: 0, isNullable: false },
          { name: "deposit", type: "float", default: 0, isNullable: false },
          { name: "user_id", type: "int", isNullable: false },
          { name: "room_id", type: "int", isNullable: false },
          { name: "master_id", type: "int", isNullable: false },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
        foreignKeys: [
          {
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            columnNames: ["room_id"],
            referencedTableName: "rooms",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
          {
            columnNames: ["master_id"],
            referencedTableName: "masters",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );
  }
  async down(queryRunner) {
    await queryRunner.dropTable("contracts", true);
    await queryRunner.dropTable("accounts", true);
    await queryRunner.dropTable("users", true);
    await queryRunner.dropTable("rooms", true);
    await queryRunner.dropTable("masters", true);
  }
};

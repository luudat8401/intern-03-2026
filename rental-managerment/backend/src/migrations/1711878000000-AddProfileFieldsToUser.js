const { TableColumn } = require("typeorm");

module.exports = class AddProfileFieldsToUser1711878000000 {
  async up(queryRunner) {
    await queryRunner.addColumns("users", [
      new TableColumn({
        name: "email",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "address",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "avatar",
        type: "varchar",
        isNullable: true,
      }),
    ]);
  }

  async down(queryRunner) {
    await queryRunner.dropColumn("users", "avatar");
    await queryRunner.dropColumn("users", "address");
    await queryRunner.dropColumn("users", "email");
  }
};

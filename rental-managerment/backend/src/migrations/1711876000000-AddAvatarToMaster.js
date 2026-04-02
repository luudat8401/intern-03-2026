const { TableColumn } = require("typeorm");

module.exports = class AddAvatarToMaster1711876000000 {
  name = "AddAvatarToMaster1711876000000";

  async up(queryRunner) {
    await queryRunner.addColumn("masters", new TableColumn({
      name: "avatar",
      type: "varchar",
      isNullable: true,
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropColumn("masters", "avatar");
  }
};

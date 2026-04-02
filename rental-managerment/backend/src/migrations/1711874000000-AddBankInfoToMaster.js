const { TableColumn } = require("typeorm");

module.exports = class AddBankInfoToMaster1711874000000 {
  name = "AddBankInfoToMaster1711874000000";

  async up(queryRunner) {
    await queryRunner.addColumns("masters", [
      new TableColumn({
        name: "bankName",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "bankAccountNumber",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "bankAccountHolder",
        type: "varchar",
        isNullable: true,
      }),
      new TableColumn({
        name: "bankBranch",
        type: "varchar",
        isNullable: true,
      }),
    ]);
  }

  async down(queryRunner) {
    await queryRunner.dropColumn("masters", "bankName");
    await queryRunner.dropColumn("masters", "bankAccountNumber");
    await queryRunner.dropColumn("masters", "bankAccountHolder");
    await queryRunner.dropColumn("masters", "bankBranch");
  }
};

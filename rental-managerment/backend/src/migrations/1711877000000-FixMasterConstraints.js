const { TableColumn } = require("typeorm");

module.exports = class FixMasterConstraints1711877000000 {
  name = "FixMasterConstraints1711877000000";

  async up(queryRunner) {
    await queryRunner.changeColumn("masters", "phone", new TableColumn({
      name: "phone",
      type: "varchar",
      isUnique: true,
      isNullable: true,
    }));
    await queryRunner.changeColumn("masters", "email", new TableColumn({
      name: "email",
      type: "varchar",
      isUnique: true,
      isNullable: true,
    }));
    await queryRunner.changeColumn("masters", "address", new TableColumn({
      name: "address",
      type: "varchar",
      isNullable: true,
    }));
  }

  async down(queryRunner) {
    // Không khuyến khích revert về non-nullable nếu data đang null, 
    // nhưng để đúng cấu trúc migration:
    await queryRunner.changeColumn("masters", "phone", new TableColumn({
        name: "phone",
        type: "varchar",
        isUnique: true,
        isNullable: false,
    }));
    // ... tương tự cho email và address
  }
};

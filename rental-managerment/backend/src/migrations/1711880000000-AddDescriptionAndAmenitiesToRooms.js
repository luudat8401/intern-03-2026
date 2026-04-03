const { TableColumn } = require("typeorm");

module.exports = class AddDescriptionAndAmenitiesToRooms1711880000000 {
  async up(queryRunner) {
    await queryRunner.addColumn("rooms", new TableColumn({
      name: "description",
      type: "text",
      isNullable: true,
    }));

    await queryRunner.addColumn("rooms", new TableColumn({
      name: "amenities",
      type: "jsonb",
      isNullable: true,
      default: "'[]'::jsonb",
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropColumn("rooms", "amenities");
    await queryRunner.dropColumn("rooms", "description");
  }
};

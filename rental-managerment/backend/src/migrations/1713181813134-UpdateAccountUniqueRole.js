const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UpdateAccountUniqueRole1713181813134 {
    async up(queryRunner) {
        // Drop the old unique constraint on username
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9"`);
        // Add the new composite unique constraint on username and role
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "UQ_USERNAME_ROLE" UNIQUE ("username", "role")`);
    }

    async down(queryRunner) {
        // Drop the new composite unique constraint
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "UQ_USERNAME_ROLE"`);
        // Add back the old unique constraint on username
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9" UNIQUE ("username")`);
    }
}

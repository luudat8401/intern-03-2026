const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [
    require("../models/User"),
    require("../models/Master"),
    require("../models/Account"),
    require("../models/Room"),
    require("../models/Contract")
  ],
  migrations: [
    require("../migrations/1711872000000-InitialSchema")
  ],
  migrationsRun: true,
});

const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("PostgreSQL Connected via TypeORM...");
  } catch (error) {
    console.error("TypeORM Connection Error: ", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, AppDataSource };

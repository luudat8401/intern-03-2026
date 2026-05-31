const pool = require('./db')
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        detail TEXT,
        status VARCHAR(50) DEFAULT 'chua hoan thanh',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`
const runMigration = async() =>{
    try{
        console.log('dang ket noi de tao bang....')
        await pool.query(createTableQuery)
        console.log("da tao bang thanh cong")
    }
    catch(err){
        console.log(`co loi say ra ${err}`)
    }
    finally{
        pool.end
    }
}
runMigration();
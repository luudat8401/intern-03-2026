const express = require('express')
const cors = require('cors')
const pool = require('./db')
require('dotenv').config()

const app = express()

app.use(cors()) // cho phep frontend goi backend
app.use(express.json()) // giup server doc json

app.get('/test-db',async (req,res)=>{
    try{
        const result = await pool.
    }

})
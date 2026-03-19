const express= require("express")
const app = express()
const fs = require("fs")
const PORT = 3000

//sync error
app.get("/sync-error",(req,res)=>{
    throw new Error("sync errors")
})
//______________________________________________
//async error
app.get("/async-error",(req,res,next)=>{
    fs.readFileSync("notext.txt","utf8",(err,data)=>{
        if(err){
            return next(err);
        }
        res.send(data);
    })
})
app.use((err,req,res,next)=>{
    console.log("error: ", err.message)
    res.status(500).json({message:"loi bat dong bo"})
})
//_______________________________________________
//promise and async await
app.get("/promise-error", (req,res)=>{
    return Promise.reject(new Error("Promise error!"))
})
app.get("/await-error",(req,res)=>{
    throw new Error("async/await-error")
})
app.use((err,req,res,next)=>{
    console.log(err.message)
    res.status(500).send(err.message)
})
//________________________________________________
app.listen(PORT,()=>{
    console.log("server running on http://localhost:3000")
})      
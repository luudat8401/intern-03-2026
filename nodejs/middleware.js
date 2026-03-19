const express = require('express');
const app = express()
app.use(express.json());
const PORT =3000;

//middleware 
app.use("/",(req,res,next)=>{
    const method = req.method;
    const url = req.url
    const time = new Date().toLocaleDateString();
    console.log(`[${time}] ${method} ${url} middleware toan cuc`)
    next();
})// moi request deu di qua day
//_________________________________________________
const usersRouter = express.Router();//tao router cho user
usersRouter.use((req,res,next)=>{
    const method = req.method
    const url = req.url
    const time = new Date().toLocaleDateString();
    console.log(`[${time}] ${method} ${url} middleware users`)
    next()
})
usersRouter.get("/:id",(req,res)=>{
    res.send(`User id: ${req.params.id}`)
})
usersRouter.get("/",(req,res)=>{
    res.send("danh sach user")
})
app.use("/users",usersRouter)
//__________________________________________________
const addName = (req,res,next)=>{
    req.name = "title"
    console.log("middleware 1 them title")
    next()
}
const readName = (req,res,next)=>{
    console.log("ten da them "+req.name)
    next();
}
app.get("/books",addName,readName,(req,res)=>{
    res.json("hoan thanh " + req.name)
})
//___________________________________________________
app.get("/error",(req,res,next)=>{
    const err = new Error("co loi say ra")
    next(err)
})
app.use((err,req,res,next)=>{
    console.error("error middleware",err.message)
    res.status(500).json({message:"co loi say ra"})
})
//___________________________________________________
app.get("/",(req,res)=>{
    res.send('helloworld')
})
app.get("/about",(req,res)=>{
    res.send("xin chao toi la Dat")
})
app.listen(PORT,()=>{
    console.log("server running on http://localhost:3000")
})
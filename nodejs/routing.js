const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json())
let books = [
  { bookId: 1, name: "Dat", authorId: 101 ,title:"horor",category:"13+",price:1000},
  { bookId: 2, name: "hoang", authorId: 102, title:"funny",category:"3+", price:2000},
  { bookId: 3, name: "Dat", authorId: 1034 ,title:"horor",category:"13+",price:3000},
  { bookId: 4, name: "hoangadfasfdsa", authorId: 104, title:"funny",category:"3+",price:4000 },
  { bookId: 5, name: "haidasfdsafdsa", authorId: 105,title :"adventure",category:"12+",price:5000 }
];
let users=[
  {id : 1, name :"dat"},
  {id : 2, name :"hai"},
  {id : 3, name :"hoang"},
  {id : 4, name :"minh"},
  {id : 5, name :"tri"},
  {id : 6, name :"phat"},
]
app.get("/", (req, res) => {
  res.send("hello geek for geeksss");
});
app.get("/about", (req, res) => {
  res.send("xin chao toi la Luu Huu Dat");
});
app.get("/books/:bookId", (req, res) => {
  const bookId = Number(req.params.bookId); 
  const book = books.find(b => b.bookId === bookId);
  if (!book) {
    return res.status(404).json({ message: "Không tìm thấy sách" });
  }
  res.json(book);
});
app.get("/authors/:authorId/books",(req,res)=>{
  const authorId = Number(req.params.authorId)
  const authorBooks = books.find(b=>b.authorId===authorId)
  if(!authorBooks){
    return res.status(404).json({message:"co loi say ra"})
  }
  res.json(authorBooks)
})
app.get("/search",(req,res)=>{
  const {title,category} = req.query;
  let result = books 
  if(title){
    result = result.filter(book=>book.title.toLowerCase().includes(title.toLowerCase()))
  };
  if(category){
    result = result.filter(book=>book.category.toLowerCase().includes(category.toLowerCase()))
  }
  if(result.length===0){
    res.status(404).json({message:"khong tim thay"})
  }
  res.json(result)
})
app.get("/filter",(req,res)=>{
  const {priceMin,priceMax}= req.query;
  let result = books;
  if(priceMin){
    const min =Number(priceMin)
    result=result.filter(book=>Number(book.price)>=min)
  }  
  if(priceMax){
    const max =Number(priceMax)
    result=result.filter(book=>Number(book.price)<=max)
  }
  if(result.length===0){
    res.status(404).json({message:"khong tim thay"})
  }
  res.json(result)
})
app.get("/users",(req,res)=>{
  res.json(users)
})

app.route("/user").post((req,res)=>{
  const {name}=req.body;
  if(!name){
   return res.status(404).json({message:"loi du lieu"}) 
  }
  const newUser = {
    id: Date.now(),
    name
  };
  users.push(newUser)
  res.status(201).json({
    message: "tao user thanh cong",
    user: newUser
  });
})
app.delete("/users/:userId",(req,res)=>{
  const id = Number(req.params.userId)
  const user = users.filter(user=>user.id!==id)
  if(user.length===users.length) {
    return res.status(404).json({message:"khong xoa nguoi dung nao ca"})}
  users=user
  res.json(users)
})
app.listen(PORT, () => {
  console.log(`server listen on http://localhost:${PORT}`);
});
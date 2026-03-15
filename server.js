const express = require("express");

const authorRoutes = require("./routes/authors");
const apiRoutes = require("./routes/api");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT || 3000;

app.use(authorRoutes);
app.use("/api",apiRoutes);

app.get("/",(req,res)=>{

res.send("ResEdge ID Registry Running");

});

app.listen(PORT,()=>{

console.log("Server running");

});

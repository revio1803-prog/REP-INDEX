const express = require("express");

const apiRoutes = require("./routes/api");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT || 3000;

app.use("/api",apiRoutes);

app.get("/",(req,res)=>{

res.send("ResEdge ID Registry Running");

});

app.listen(PORT,()=>{

console.log("ResEdge ID running");

});

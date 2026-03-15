const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const {generateAID} = require("../utils/idGenerator");
const layout = require("../views/layout");

router.get("/create-author",(req,res)=>{

res.send(layout("Create Author",`

<form method="POST" action="/create-aid">

Name
<input name="name">

Institution
<input name="institution">

<button>Create Author</button>

</form>

`));

});

router.post("/create-aid",async(req,res)=>{

const id = await generateAID();

const {name,institution}=req.body;

await pool.query(
"INSERT INTO authors(id,name,institution) VALUES($1,$2,$3)",
[id,name,institution]
);

res.send(layout("Author Created",`

Author ID: ${id}

<a href="/author/${id}">Open Profile</a>

`));

});

router.get("/author/:id",async(req,res)=>{

const id=req.params.id;

const author=await pool.query(
"SELECT * FROM authors WHERE id=$1",
[id]
);

if(author.rows.length===0){
return res.send("Author not found");
}

res.send(layout("Author",`

<h2>${author.rows[0].name}</h2>

<p>${author.rows[0].institution}</p>

`));

});

module.exports = router;

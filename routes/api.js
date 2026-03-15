```javascript
const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const { generateRID, generateAID, generateDID } = require("../utils/idGenerator");


/* =========================================================
   CREATE RESEARCH IDENTIFIER (RID)
========================================================= */

router.post("/create-rid", async (req,res)=>{

try{

const {
title,
url,
year,
author_id,
journal,
publisher,
keywords,
abstract
} = req.body;

const id = await generateRID();

await pool.query(

`INSERT INTO identifiers
(id,title,url,year,author_id,journal,publisher,keywords,abstract)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,

[
id,
title,
url,
year,
author_id || null,
journal || null,
publisher || null,
keywords || null,
abstract || null
]

);

res.json({
success:true,
rid:id
});

}catch(err){

console.error(err);

res.status(500).json({
success:false,
error:"Unable to create RID"
});

}

});


/* =========================================================
   CREATE AUTHOR IDENTIFIER (AID)
========================================================= */

router.post("/create-aid", async (req,res)=>{

try{

const {name,institution} = req.body;

const id = await generateAID();

await pool.query(
"INSERT INTO authors (id,name,institution) VALUES ($1,$2,$3)",
[id,name,institution]
);

res.json({
success:true,
aid:id
});

}catch(err){

console.error(err);

res.status(500).json({
success:false,
error:"Unable to create AID"
});

}

});


/* =========================================================
   CREATE DATASET IDENTIFIER (DID)
========================================================= */

router.post("/create-did", async (req,res)=>{

try{

const {
title,
year,
dataset_url,
author_id
} = req.body;

const id = await generateDID();

await pool.query(
"INSERT INTO datasets (id,title,year,dataset_url,author_id) VALUES ($1,$2,$3,$4,$5)",
[id,title,year,dataset_url,author_id]
);

res.json({
success:true,
did:id
});

}catch(err){

console.error(err);

res.status(500).json({
success:false,
error:"Unable to create DID"
});

}

});


/* =========================================================
   FETCH IDENTIFIER METADATA (API)
========================================================= */

router.get("/rid/:id", async (req,res)=>{

try{

const id = req.params.id;

const result = await pool.query(
"SELECT * FROM identifiers WHERE id=$1",
[id]
);

if(result.rows.length===0){

return res.status(404).json({
error:"Identifier not found"
});

}

res.json(result.rows[0]);

}catch(err){

console.error(err);

res.status(500).json({
error:"Unable to fetch record"
});

}

});


module.exports = router;
```

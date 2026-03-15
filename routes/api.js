const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const {generateRID,generateAID,generateDID} = require("../utils/idGenerator");

router.post("/create-rid",async(req,res)=>{

const {title,url,year,author_id}=req.body;

const id=await generateRID();

await pool.query(
"INSERT INTO identifiers(id,title,url,year,author_id) VALUES($1,$2,$3,$4,$5)",
[id,title,url,year,author_id]
);

res.json({rid:id});

});

router.post("/create-did",async(req,res)=>{

const {title,year,dataset_url,author_id}=req.body;

const id=await generateDID();

await pool.query(
"INSERT INTO datasets(id,title,year,dataset_url,author_id) VALUES($1,$2,$3,$4,$5)",
[id,title,year,dataset_url,author_id]
);

res.json({did:id});

});

module.exports = router;

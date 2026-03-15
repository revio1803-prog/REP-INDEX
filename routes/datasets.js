const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const layout = require("../views/layout");


/* =====================================================
CREATE DATASET PAGE
===================================================== */

router.get("/create-dataset",(req,res)=>{

res.send(layout("Create Dataset",`

<h2>Create Dataset Identifier</h2>

<form method="POST" action="/create-dataset">

<label>Title</label>
<input name="title" required>

<label>Year</label>
<input name="year" required>

<label>Dataset URL</label>
<input name="dataset_url" required>

<label>Author ID</label>
<input name="author_id">

<br>

<button>Create Dataset ID</button>

</form>

`));

});


/* =====================================================
CREATE DATASET
===================================================== */

router.post("/create-dataset", async (req,res)=>{

try{

const {title,year,dataset_url,author_id} = req.body;

/* generate DID */

const result = await pool.query(
"SELECT COUNT(*) FROM datasets"
);

const number = parseInt(result.rows[0].count) + 1;

const id =
"DID-" +
new Date().getFullYear() +
"-" +
String(number).padStart(5,"0");


/* insert dataset */

await pool.query(
`INSERT INTO datasets
(id,title,year,dataset_url,author_id)
VALUES ($1,$2,$3,$4,$5)`,
[
id,
title,
parseInt(year),
dataset_url,
author_id || null
]
);


res.send(layout("Dataset Created",`

<h2>Dataset Created</h2>

<p><b>${id}</b></p>

<a href="/dataset/${id}">
<button>Open Dataset</button>
</a>

`));

}catch(err){

console.error(err);

res.send(layout("Error","Dataset creation failed"));

}

});


/* =====================================================
BROWSE DATASETS
===================================================== */

router.get("/browse-datasets", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM datasets ORDER BY id DESC LIMIT 50"
);

let rows = "";

result.rows.forEach(d=>{

rows += `
<tr>
<td>${d.id}</td>
<td>${d.title}</td>
<td>${d.year}</td>
<td><a href="/dataset/${d.id}">View</a></td>
</tr>
`;

});

res.send(layout("Dataset Registry",`

<h2>Dataset Registry</h2>

<table>

<tr>
<th>ID</th>
<th>Title</th>
<th>Year</th>
<th>Record</th>
</tr>

${rows}

</table>

`));

}catch(err){

console.error(err);

res.send(layout("Error","Failed to load datasets"));

}

});


/* =====================================================
DATASET RECORD
===================================================== */

router.get("/dataset/:id", async (req,res)=>{

try{

const id = req.params.id;

const result = await pool.query(
"SELECT * FROM datasets WHERE id=$1",
[id]
);

if(result.rows.length === 0){
return res.send(layout("Not Found","Dataset not found"));
}

const data = result.rows[0];

res.send(layout("Dataset Record",`

<h2>${data.title}</h2>

<p><b>Dataset ID:</b> ${data.id}</p>

<p><b>Year:</b> ${data.year}</p>

<p><b>Author:</b> ${data.author_id || "Not linked"}</p>

<br>

<a href="${data.dataset_url}" target="_blank">
<button>Download Dataset</button>
</a>

`));

}catch(err){

console.error(err);

res.send(layout("Error","Failed to load dataset"));

}

});


module.exports = router;

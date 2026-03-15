const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const layout = require("../views/layout");

/* ---------- CREATE DATASET PAGE ---------- */

router.get("/create-dataset",(req,res)=>{

res.send(layout("Create Dataset",`

<h2>Create Dataset Identifier</h2>

<form method="POST" action="/create-dataset">

Title
<input name="title" required>

Year
<input name="year" required>

Dataset URL
<input name="dataset_url" required>

Author ID
<input name="author_id">

<button>Create Dataset ID</button>

</form>

`));

});


/* ---------- CREATE DATASET ---------- */

router.post("/create-dataset", async (req,res)=>{

const {title,year,dataset_url,author_id} = req.body;

const result = await pool.query(
"SELECT COUNT(*) FROM datasets"
);

const number = parseInt(result.rows[0].count) + 1;

const id = `DID-${new Date().getFullYear()}-${String(number).padStart(5,"0")}`;

await pool.query(
"INSERT INTO datasets (id,title,year,dataset_url,author_id) VALUES ($1,$2,$3,$4,$5)",
[id,title,year,dataset_url,author_id]
);

res.send(layout("Dataset Created",`

<h2>Dataset Created</h2>

<p><b>${id}</b></p>

<a href="/dataset/${id}">
<button>Open Dataset</button>
</a>

`));

});


/* ---------- DATASET PAGE ---------- */

router.get("/dataset/:id", async (req,res)=>{

const id = req.params.id;

const result = await pool.query(
"SELECT * FROM datasets WHERE id=$1",
[id]
);

if(result.rows.length===0){
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

});


module.exports = router;

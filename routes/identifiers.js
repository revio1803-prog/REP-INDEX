const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const layout = require("../views/layout");

/* ---------- CREATE IDENTIFIER PAGE ---------- */

router.get("/create",(req,res)=>{

res.send(layout("Create Identifier",`

<h2>Create Research Identifier</h2>

<form method="POST" action="/create">

Title
<input name="title" required>

Year
<input name="year" required>

Resource URL
<input name="url" required>

Author ID
<input name="author_id">

<button>Create Identifier</button>

</form>

`));

});


/* ---------- CREATE IDENTIFIER ---------- */

router.post("/create", async (req,res)=>{

const {title,url,year,author_id} = req.body;

const result = await pool.query(
"SELECT COUNT(*) FROM identifiers"
);

const number = parseInt(result.rows[0].count) + 1;

const id = `RID-${new Date().getFullYear()}-${String(number).padStart(5,"0")}`;

await pool.query(
"INSERT INTO identifiers (id,title,url,year,author_id) VALUES ($1,$2,$3,$4,$5)",
[id,title,url,year,author_id]
);

res.send(layout("Identifier Created",`

<h2>Identifier Created</h2>

<p><b>${id}</b></p>

<a href="/rid/${id}">
<button>Open Record</button>
</a>

`));

});

/* Browse Identifiers */

router.get("/browse", async (req,res)=>{

const result = await pool.query(
"SELECT * FROM identifiers ORDER BY id DESC LIMIT 50"
);

let rows="";

result.rows.forEach(r=>{

rows += `
<tr>
<td>${r.id}</td>
<td>${r.title}</td>
<td>${r.year}</td>
<td><a href="/rid/${r.id}">View</a></td>
</tr>
`;

});

res.send(layout("Identifier Registry",`

<h2>Identifier Registry</h2>

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

});

/* Identifier Record */

router.get("/rid/:id", async (req,res)=>{

const id = req.params.id;

const result = await pool.query(
"SELECT * FROM identifiers WHERE id=$1",
[id]
);

if(result.rows.length===0){
return res.send(layout("Not Found","Identifier not found"));
}

const data = result.rows[0];

res.send(layout("Identifier Record",`

<h2>${data.title}</h2>

<p><b>ID:</b> ${data.id}</p>

<p><b>Year:</b> ${data.year}</p>

<p><b>Author:</b> ${data.author_id || "Not linked"}</p>

<br>

<a href="${data.url}" target="_blank">
<button>Open Resource</button>
</a>

`));

});

module.exports = router;

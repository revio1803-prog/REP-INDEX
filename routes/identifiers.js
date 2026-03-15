```javascript
const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const layout = require("../views/layout");


/* =========================================================
   CREATE IDENTIFIER PAGE
========================================================= */

router.get("/create", (req, res) => {

res.send(layout("Create Identifier", `

<h2>Create Research Identifier</h2>

<form method="POST" action="/create">

<label>Title</label>
<input name="title" required>

<label>Year</label>
<input name="year" required>

<label>Resource URL</label>
<input name="url" required>

<label>Author ID</label>
<input name="author_id">

<label>Journal</label>
<input name="journal">

<label>Publisher</label>
<input name="publisher">

<label>Keywords</label>
<input name="keywords" placeholder="comma separated">

<label>Abstract</label>
<textarea name="abstract" rows="6"></textarea>

<br><br>

<button>Create Identifier</button>

</form>

`));

});


/* =========================================================
   CREATE IDENTIFIER
========================================================= */

router.post("/create", async (req, res) => {

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

/* generate identifier */

const result = await pool.query(
"SELECT COUNT(*) FROM identifiers"
);

const number = parseInt(result.rows[0].count) + 1;

const id = `RID-${new Date().getFullYear()}-${String(number).padStart(5,"0")}`;

/* save */

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

/* response */

res.send(layout("Identifier Created", `

<h2>Identifier Created</h2>

<p><b>${id}</b></p>

<a href="/rid/${id}">
<button>Open Record</button>
</a>

<br><br>

<a href="/create">
<button>Create Another</button>
</a>

`));

}catch(err){

console.error(err);

res.send(layout("Error","Error creating identifier"));

}

});


/* =========================================================
   BROWSE IDENTIFIERS
========================================================= */

router.get("/browse", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM identifiers ORDER BY id DESC LIMIT 100"
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

<table border="1" cellpadding="8">

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

res.send(layout("Error","Unable to load registry"));

}

});


/* =========================================================
   IDENTIFIER RECORD (DOI STYLE PAGE)
========================================================= */

router.get("/rid/:id", async (req,res)=>{

try{

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

<hr>

<p><b>Identifier</b><br>${data.id}</p>

<p><b>Year</b><br>${data.year}</p>

<p><b>Author ID</b><br>${data.author_id || "Not linked"}</p>

<p><b>Journal</b><br>${data.journal || "-"}</p>

<p><b>Publisher</b><br>${data.publisher || "-"}</p>

<p><b>Keywords</b><br>${data.keywords || "-"}</p>

<br>

<h3>Abstract</h3>

<p>
${data.abstract || "No abstract available."}
</p>

<br>

<a href="${data.url}" target="_blank">
<button>Open Resource</button>
</a>

<br><br>

<h3>Citation</h3>

<p>

${data.title} (${data.year}).  
${data.journal || ""}.  
${data.publisher || ""}.  
Research Identifier: ${data.id}

</p>

`));

}catch(err){

console.error(err);

res.send(layout("Error","Unable to load record"));

}

});


module.exports = router;
```

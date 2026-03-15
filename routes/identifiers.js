const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const layout = require("../views/layout");

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

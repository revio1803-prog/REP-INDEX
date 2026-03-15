const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const layout = require("../views/layout");

/* Browse datasets */

router.get("/browse-datasets", async (req,res)=>{

const result = await pool.query(
"SELECT * FROM datasets ORDER BY id DESC"
);

let rows="";

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

});

/* Dataset page */

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

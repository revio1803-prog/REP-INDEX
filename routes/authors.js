const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const layout = require("../views/layout");

/* Browse Authors */

router.get("/browse-authors", async (req,res)=>{

const result = await pool.query(
"SELECT * FROM authors ORDER BY id DESC"
);

let rows="";

result.rows.forEach(a=>{

rows += `
<tr>
<td>${a.id}</td>
<td>${a.name}</td>
<td>${a.institution}</td>
<td><a href="/author/${a.id}">Profile</a></td>
</tr>
`;

});

res.send(layout("Author Registry",`

<h2>Author Registry</h2>

<table>

<tr>
<th>ID</th>
<th>Name</th>
<th>Institution</th>
<th>Profile</th>
</tr>

${rows}

</table>

`));

});

/* Author Profile */

router.get("/author/:id", async (req,res)=>{

const id = req.params.id;

const author = await pool.query(
"SELECT * FROM authors WHERE id=$1",
[id]
);

if(author.rows.length===0){
return res.send(layout("Not Found","Author not found"));
}

const papers = await pool.query(
"SELECT * FROM identifiers WHERE author_id=$1",
[id]
);

let pub="";

papers.rows.forEach(p=>{
pub += `<li><a href="/rid/${p.id}">${p.title}</a></li>`;
});

res.send(layout("Author Profile",`

<h2>${author.rows[0].name}</h2>

<p><b>Author ID:</b> ${author.rows[0].id}</p>

<p><b>Institution:</b> ${author.rows[0].institution}</p>

<h3>Publications</h3>

<ul>
${pub}
</ul>

`));

});

module.exports = router;

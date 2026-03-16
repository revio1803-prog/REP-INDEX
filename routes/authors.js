const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");
const generateIdentifier = require("../utils/idGenerator");


/* ---------- CREATE AUTHOR PAGE ---------- */

router.get("/create-author",(req,res)=>{

res.send(layout("Create Author",`

<h2>Create Author Profile</h2>

<form method="POST" action="/create-author">

Name
<input name="name" required>

Institution
<input name="institution" required>

<button>Create Author Identifier</button>

</form>

`));

});


/* ---------- CREATE AUTHOR ---------- */

router.post("/create-author", async (req,res)=>{

try{

const {name,institution} = req.body;

/* generate identifier */

const id = await generateIdentifier("author");

/* insert author */

await pool.query(
`INSERT INTO authors (identifier,name,institution)
VALUES ($1,$2,$3)`,
[id.identifier,name,institution]
);

/* register identifier */

await pool.query(
`INSERT INTO identifiers
(identifier,prefix,type,number,target_url)
VALUES ($1,$2,$3,$4,$5)`,
[
id.identifier,
id.prefix,
"author",
id.number,
`/author/${id.identifier}`
]
);

res.send(layout("Author Created",`

<h2>Author Created</h2>

<p><b>${id.identifier}</b></p>

<a href="/author/${id.identifier}">
<button>Open Profile</button>
</a>

`));

}catch(err){

console.error(err);
res.send("Error creating author");

}

});


/* ---------- BROWSE AUTHORS ---------- */

router.get("/browse-authors", async (req,res)=>{

const result = await pool.query(
"SELECT * FROM authors ORDER BY identifier DESC"
);

let rows="";

result.rows.forEach(a=>{

rows += `
<tr>
<td>${a.identifier}</td>
<td>${a.name}</td>
<td>${a.institution}</td>
<td><a href="/author/${a.identifier}">Profile</a></td>
</tr>
`;

});

res.send(layout("Author Registry",`

<h2>Author Registry</h2>

<table>

<tr>
<th>Identifier</th>
<th>Name</th>
<th>Institution</th>
<th>Profile</th>
</tr>

${rows}

</table>

`));

});


/* ---------- AUTHOR PROFILE ---------- */

router.get("/author/:identifier", async (req,res)=>{

const identifier = req.params.identifier;

const author = await pool.query(
"SELECT * FROM authors WHERE identifier=$1",
[identifier]
);

if(author.rows.length===0){
return res.send(layout("Not Found","Author not found"));
}

res.send(layout("Author Profile",`

<h2>${author.rows[0].name}</h2>

<p><b>Identifier:</b> ${author.rows[0].identifier}</p>

<p><b>Institution:</b> ${author.rows[0].institution}</p>

`));

});


module.exports = router;

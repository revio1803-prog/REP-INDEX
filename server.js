const express = require("express");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: { rejectUnauthorized: false }
});

/* ---------- DATABASE INIT ---------- */

async function initDB(){

await pool.query(`
CREATE TABLE IF NOT EXISTS authors(
id TEXT PRIMARY KEY,
name TEXT,
institution TEXT
)
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS identifiers(
id TEXT PRIMARY KEY,
title TEXT,
url TEXT,
year TEXT,
author_id TEXT
)
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS datasets(
id TEXT PRIMARY KEY,
title TEXT,
year TEXT,
dataset_url TEXT,
author_id TEXT
)
`);

}

initDB().catch(console.error);

/* ---------- ID GENERATORS ---------- */

async function generateRID(){

const year = new Date().getFullYear();

const result = await pool.query("SELECT COUNT(*) FROM identifiers");

const number = parseInt(result.rows[0].count) + 1;

const formatted = String(number).padStart(5,"0");

return `RID-${year}-${formatted}`;

}

async function generateAID(){

const year = new Date().getFullYear();

const result = await pool.query("SELECT COUNT(*) FROM authors");

const number = parseInt(result.rows[0].count) + 1;

const formatted = String(number).padStart(5,"0");

return `AID-${year}-${formatted}`;

}

async function generateDID(){

const year = new Date().getFullYear();

const result = await pool.query("SELECT COUNT(*) FROM datasets");

const number = parseInt(result.rows[0].count) + 1;

const formatted = String(number).padStart(5,"0");

return `DID-${year}-${formatted}`;

}

/* ---------- LAYOUT ---------- */

function layout(title,content){

return `
<html>

<head>

<title>${title}</title>

<style>

body{
font-family:Arial;
background:#f4f6fb;
margin:0;
}

header{
background:#1e293b;
color:white;
padding:20px;
}

nav a{
color:white;
margin-right:20px;
text-decoration:none;
font-weight:bold;
}

.container{
max-width:900px;
margin:auto;
background:white;
padding:30px;
margin-top:30px;
border-radius:8px;
box-shadow:0 0 10px rgba(0,0,0,0.1);
}

button{
background:#2563eb;
color:white;
border:none;
padding:10px 20px;
border-radius:6px;
cursor:pointer;
margin-right:10px;
}

input{
padding:8px;
width:100%;
margin-top:5px;
margin-bottom:15px;
}

table{
width:100%;
border-collapse:collapse;
}

th,td{
border:1px solid #ddd;
padding:10px;
}

th{
background:#eee;
}

</style>

</head>

<body>

<header>

<h2>ResEdge ID</h2>

<nav>

<a href="/">Home</a>
<a href="/create">Create RID</a>
<a href="/create-author">Create Author</a>
<a href="/create-dataset">Create Dataset</a>
<a href="/search">Search</a>
<a href="/browse">Browse IDs</a>
<a href="/browse-authors">Browse Authors</a>
<a href="/browse-datasets">Browse Datasets</a>

</nav>

</header>

<div class="container">

${content}

</div>

</body>

</html>
`;

}

/* ---------- HOME ---------- */

app.get("/",(req,res)=>{

res.send(layout("Home",`

<h2>ResEdge ID Registry</h2>

<p>Global Research Identifier System by Research Edge and Publication Pvt Ltd.</p>

<a href="/create"><button>Create Research ID</button></a>

<a href="/create-author"><button>Create Author</button></a>

<a href="/create-dataset"><button>Create Dataset</button></a>

<a href="/browse"><button>Browse Registry</button></a>

`));

});

/* ---------- CREATE AUTHOR ---------- */

app.get("/create-author",(req,res)=>{

res.send(layout("Create Author",`

<h2>Create Author Profile</h2>

<form method="POST" action="/create-aid">

Name
<input name="name" required>

Institution
<input name="institution" required>

<button>Create Author ID</button>

</form>

`));

});

app.post("/create-aid", async (req,res)=>{

const id = await generateAID();

const {name,institution} = req.body;

await pool.query(
"INSERT INTO authors (id,name,institution) VALUES ($1,$2,$3)",
[id,name,institution]
);

res.send(layout("Author Created",`

<h2>Author ID Created</h2>

<p><b>${id}</b></p>

<a href="/author/${id}"><button>Open Profile</button></a>

`));

});

/* ---------- AUTHOR PROFILE ---------- */

app.get("/author/:id", async (req,res)=>{

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

const datasets = await pool.query(
"SELECT * FROM datasets WHERE author_id=$1",
[id]
);

let pub="";
papers.rows.forEach(p=>{
pub += `<li><a href="/${p.id}">${p.title}</a></li>`;
});

let data="";
datasets.rows.forEach(d=>{
data += `<li><a href="/dataset/${d.id}">${d.title}</a></li>`;
});

res.send(layout("Author Profile",`

<h2>${author.rows[0].name}</h2>

<p><b>Author ID:</b> ${author.rows[0].id}</p>

<p><b>Institution:</b> ${author.rows[0].institution}</p>

<h3>Publications</h3>
<ul>${pub}</ul>

<h3>Datasets</h3>
<ul>${data}</ul>

`));

});

/* ---------- CREATE RID ---------- */

app.get("/create",(req,res)=>{

res.send(layout("Create Identifier",`

<h2>Create Research Identifier</h2>

<form method="POST" action="/create-rid">

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

app.post("/create-rid", async (req,res)=>{

const id = await generateRID();

const {title,url,year,author_id} = req.body;

await pool.query(
"INSERT INTO identifiers (id,title,url,year,author_id) VALUES ($1,$2,$3,$4,$5)",
[id,title,url,year,author_id]
);

res.send(layout("Identifier Created",`

<h2>Identifier Created</h2>

<p><b>${id}</b></p>

<a href="/${id}"><button>Open Record</button></a>

`));

});

/* ---------- CREATE DATASET ---------- */

app.get("/create-dataset",(req,res)=>{

res.send(layout("Create Dataset",`

<h2>Create Dataset Identifier</h2>

<form method="POST" action="/create-did">

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

app.post("/create-did", async (req,res)=>{

const id = await generateDID();

const {title,year,dataset_url,author_id} = req.body;

await pool.query(
"INSERT INTO datasets (id,title,year,dataset_url,author_id) VALUES ($1,$2,$3,$4,$5)",
[id,title,year,dataset_url,author_id]
);

res.send(layout("Dataset Created",`

<h2>Dataset ID Created</h2>

<p><b>${id}</b></p>

<a href="/dataset/${id}"><button>Open Dataset</button></a>

`));

});

/* ---------- DATASET PAGE ---------- */

app.get("/dataset/:id", async (req,res)=>{

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

<a href="${data.dataset_url}" target="_blank">
<button>Download Dataset</button>
</a>

`));

});

/* ---------- BROWSE DATASETS ---------- */

app.get("/browse-datasets", async (req,res)=>{

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

res.send(layout("Datasets",`

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

/* ---------- BROWSE IDENTIFIERS ---------- */

app.get("/browse", async (req,res)=>{

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
<td><a href="/${r.id}">View</a></td>
</tr>
`;
});

res.send(layout("Browse Registry",`

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

/* ---------- IDENTIFIER RECORD ---------- */

app.get("/:id", async (req,res)=>{

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

<a href="${data.url}" target="_blank">
<button>Open Resource</button>
</a>

`));

});

/* ---------- SERVER ---------- */

app.listen(PORT,()=>{
console.log("ResEdge ID running");
});

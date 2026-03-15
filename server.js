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

/* initialize database */

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS identifiers (
      id TEXT PRIMARY KEY,
      title TEXT,
      url TEXT,
      year TEXT
    )
  `);
}

initDB().catch(console.error);

/* generate ID */

async function generateRID() {

  const year = new Date().getFullYear();

  const result = await pool.query("SELECT COUNT(*) FROM identifiers");

  const number = parseInt(result.rows[0].count) + 1;

  const formatted = String(number).padStart(5,"0");

  return `RID-${year}-${formatted}`;
}

/* layout */

function layout(title,content){

return `
<html>
<head>

<title>${title}</title>

<style>

body{
font-family:Arial;
background:#f5f7fb;
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
}

input{
padding:8px;
width:100%;
margin-top:5px;
margin-bottom:15px;
}

</style>

</head>

<body>

<header>

<h2>REP INDEX</h2>

<nav>
<a href="/">Home</a>
<a href="/create">Create ID</a>
<a href="/search">Search</a>
</nav>

</header>

<div class="container">

${content}

</div>

</body>
</html>
`;
}

/* homepage */

app.get("/",(req,res)=>{

res.send(layout("Home",`

<h2>Research Identifier Registry</h2>

<p>This system registers persistent research identifiers.</p>

<a href="/create"><button>Create Identifier</button></a>

<a href="/search"><button>Search Identifier</button></a>

`));

});

/* health */

app.get("/health",(req,res)=>{

res.json({status:"OK"});

});

/* create page */

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

<button>Create Identifier</button>

</form>

`));

});

/* create */

app.post("/create-rid", async (req,res)=>{

const id = await generateRID();

const {title,url,year} = req.body;

await pool.query(
"INSERT INTO identifiers (id,title,url,year) VALUES ($1,$2,$3,$4)",
[id,title,url,year]
);

res.send(layout("Created",`

<h2>Identifier Created</h2>

<p><b>${id}</b></p>

<a href="/${id}"><button>Open Record</button></a>

`));

});

/* search page */

app.get("/search",(req,res)=>{

res.send(layout("Search",`

<h2>Search Identifier</h2>

<form action="/resolve">

<input name="id" placeholder="Enter identifier">

<button>Search</button>

</form>

`));

});

/* resolve */

app.get("/resolve", async (req,res)=>{

const id = req.query.id;

const result = await pool.query(
"SELECT * FROM identifiers WHERE id=$1",
[id]
);

if(result.rows.length===0){

return res.send(layout("Not Found","Identifier not found"));

}

res.redirect("/"+id);

});

/* identifier page */

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

res.send(layout("Record",`

<h2>Identifier Record</h2>

<p><b>ID:</b> ${data.id}</p>

<p><b>Title:</b> ${data.title}</p>

<p><b>Year:</b> ${data.year}</p>

<a href="${data.url}" target="_blank">
<button>Open Resource</button>
</a>

`));

});

/* start server */

app.listen(PORT,()=>{

console.log("REP INDEX running");

});

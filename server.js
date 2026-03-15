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

initDB();

/* generate professional ID */

async function generateRID() {

  const year = new Date().getFullYear();

  const result = await pool.query(
    "SELECT COUNT(*) FROM identifiers"
  );

  const number = parseInt(result.rows[0].count) + 1;

  const formatted = String(number).padStart(5,"0");

  return `RID-${year}-${formatted}`;

}

/* homepage */

app.get("/", (req,res)=>{

res.send(`

<h1>REP INDEX</h1>

<h3>Research Identifier Registry</h3>

<a href="/create">Create Identifier</a><br><br>

<a href="/search">Search Identifier</a>

`);

});

/* health */

app.get("/health",(req,res)=>{

res.json({status:"OK"});

});

/* create page */

app.get("/create",(req,res)=>{

res.send(`

<h2>Create Research Identifier</h2>

<form method="POST" action="/create-rid">

Title<br>
<input name="title"/><br><br>

Year<br>
<input name="year"/><br><br>

Resource URL<br>
<input name="url"/><br><br>

<button type="submit">Create Identifier</button>

</form>

`);

});

/* create identifier */

app.post("/create-rid", async (req,res)=>{

const id = await generateRID();

const {title,url,year} = req.body;

await pool.query(

"INSERT INTO identifiers (id,title,url,year) VALUES ($1,$2,$3,$4)",

[id,title,url,year]

);

res.send(`

<h2>Identifier Created</h2>

<p><b>${id}</b></p>

<a href="/${id}">Open Identifier Record</a>

`);

});

/* search page */

app.get("/search",(req,res)=>{

res.send(`

<h2>Search Identifier</h2>

<form action="/resolve">

<input name="id"/>

<button>Search</button>

</form>

`);

});

/* search resolver */

app.get("/resolve", async (req,res)=>{

const id = req.query.id;

const result = await pool.query(

"SELECT * FROM identifiers WHERE id=$1",

[id]

);

if(result.rows.length===0){

return res.send("Identifier not found");

}

res.redirect("/"+id);

});

/* identifier record page */

app.get("/:id", async (req,res)=>{

const id = req.params.id;

const result = await pool.query(

"SELECT * FROM identifiers WHERE id=$1",

[id]

);

if(result.rows.length===0){

return res.send("Identifier not found");

}

const data = result.rows[0];

res.send(`

<h2>Identifier Record</h2>

<p><b>ID:</b> ${data.id}</p>

<p><b>Title:</b> ${data.title}</p>

<p><b>Year:</b> ${data.year}</p>

<br>

<a href="${data.url}">Open Resource</a>

`);

});

/* start server */

app.listen(PORT,()=>{

console.log("REP INDEX running");

});

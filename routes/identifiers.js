const express = require("express");
const router = express.Router();

const pool = require("../db/db");
const layout = require("../views/layout");


/* ---------- CREATE IDENTIFIER PAGE ---------- */

router.get("/create", (req, res) => {

const html = `
<h2>Create Research Identifier</h2>

<form method="POST" action="/create">

<label>Title</label>
<input type="text" name="title" required>

<label>Year</label>
<input type="number" name="year" required>

<label>Resource URL</label>
<input type="url" name="url" required>

<label>Author ID</label>
<input type="text" name="author_id">

<label>Journal</label>
<input type="text" name="journal">

<label>Publisher</label>
<input type="text" name="publisher">

<label>Keywords</label>
<input type="text" name="keywords">

<label>Abstract</label>
<textarea name="abstract" rows="6"></textarea>

<br><br>

<button type="submit">Create Identifier</button>

</form>
`;

res.send(layout("Create Identifier", html));

});


/* ---------- CREATE IDENTIFIER ---------- */

router.post("/create", async (req, res) => {

try {

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

/* Count existing identifiers */

const result = await pool.query(
"SELECT COUNT(*) FROM identifiers"
);

const number = parseInt(result.rows[0].count) + 1;

/* Generate RID */

const id =
"RID-" +
new Date().getFullYear() +
"-" +
String(number).padStart(5, "0");

/* Insert record */

await pool.query(
`INSERT INTO identifiers
(id,title,url,year,author_id,journal,publisher,keywords,abstract)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
[
id,
title,
url,
parseInt(year),
author_id || null,
journal || null,
publisher || null,
keywords || null,
abstract || null
]
);

res.send(
layout(
"Identifier Created",
`
<h2>Identifier Created</h2>

<p><b>${id}</b></p>

<a href="/rid/${id}">
<button>Open Record</button>
</a>
`
)
);

} catch (err) {

console.error(err);

res.send(
layout(
"Error",
"<h2>Error creating identifier</h2>"
)
);

}

});


/* ---------- BROWSE IDENTIFIERS ---------- */

router.get("/browse", async (req, res) => {

try {

const result = await pool.query(
"SELECT * FROM identifiers ORDER BY id DESC LIMIT 50"
);

let rows = "";

result.rows.forEach(r => {

rows += `
<tr>
<td>${r.id}</td>
<td>${r.title}</td>
<td>${r.year}</td>
<td><a href="/rid/${r.id}">View</a></td>
</tr>
`;

});

res.send(
layout(
"Identifier Registry",
`
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
`
)
);

} catch (err) {

console.error(err);

res.send(layout("Error", "Failed to load identifiers"));

}

});


/* ---------- IDENTIFIER RECORD ---------- */

router.get("/rid/:id", async (req, res) => {

try {

const id = req.params.id;

const result = await pool.query(
"SELECT * FROM identifiers WHERE id=$1",
[id]
);

if (result.rows.length === 0) {

return res.send(layout("Not Found", "Identifier not found"));

}

const data = result.rows[0];

res.send(
layout(
"Identifier Record",
`
<h2>${data.title}</h2>

<p><b>ID:</b> ${data.id}</p>

<p><b>Year:</b> ${data.year}</p>

<p><b>Author:</b> ${data.author_id || "Not linked"}</p>

<p><b>Journal:</b> ${data.journal || "-"}</p>

<p><b>Publisher:</b> ${data.publisher || "-"}</p>

<p><b>Keywords:</b> ${data.keywords || "-"}</p>

<h3>Abstract</h3>

<p>${data.abstract || "No abstract available."}</p>

<br>

<a href="${data.url}" target="_blank">
<button>Open Resource</button>
</a>
`
)
);

} catch (err) {

console.error(err);

res.send(layout("Error", "Failed to load record"));

}

});


module.exports = router;

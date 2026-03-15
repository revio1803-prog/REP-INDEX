const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

/* database */

const registry = {
  articles: {}
};

/* homepage */

app.get("/", (req, res) => {
  res.send(`
  <h1>REP INDEX Research Identifier System</h1>
  <p>Welcome to the identifier registry.</p>

  <a href="/create">Create Identifier</a><br>
  <a href="/search">Search Identifier</a>
  `);
});

/* health */

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* create page */

app.get("/create", (req, res) => {
  res.send(`
  <h2>Create Research Article ID</h2>

  <form method="POST" action="/create-rid">

  Title<br>
  <input name="title"/><br><br>

  URL<br>
  <input name="url"/><br><br>

  <button type="submit">Create ID</button>

  </form>
  `);
});

/* create rid */

app.post("/create-rid", (req, res) => {

  const id = "RID-" + Date.now();

  registry.articles[id] = {
    title: req.body.title,
    url: req.body.url
  };

  res.send(`
  <h2>Identifier Created</h2>

  <p>ID: ${id}</p>

  <a href="/${id}">Open Identifier</a>
  `);
});

/* search page */

app.get("/search", (req, res) => {
  res.send(`
  <h2>Search Identifier</h2>

  <form action="/resolve">

  <input name="id"/>

  <button>Search</button>

  </form>
  `);
});

/* resolver search */

app.get("/resolve", (req, res) => {

  const id = req.query.id;

  if (registry.articles[id]) {

    res.redirect("/" + id);

  } else {

    res.send("Identifier not found");

  }

});

/* resolver */

app.get("/:id", (req, res) => {

  const id = req.params.id;

  if (registry.articles[id]) {

    const data = registry.articles[id];

    res.send(`
    <h2>Identifier Record</h2>

    <p>ID: ${id}</p>
    <p>Title: ${data.title}</p>

    <a href="${data.url}">Open Resource</a>
    `);

  } else {

    res.send("Identifier not found");

  }

});

/* start server */

app.listen(PORT, () => {
  console.log("REP INDEX running on port " + PORT);
});

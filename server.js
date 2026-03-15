const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

/* -----------------------------
   In-memory registry database
--------------------------------*/

const registry = {
  articles: {},
  authors: {},
  datasets: {}
};

/* -----------------------------
   Homepage
--------------------------------*/

app.get("/", (req, res) => {
  res.send("REP INDEX identifier system running");
});

/* -----------------------------
   Health Check
--------------------------------*/

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* -----------------------------
   Create Research Article ID
--------------------------------*/

app.post("/create-rid", (req, res) => {

  const id = "RID-" + Date.now();

  const { title, url } = req.body;

  registry.articles[id] = {
    title: title || "Untitled Article",
    url: url || "https://example.com"
  };

  res.json({
    message: "RID created",
    id: id,
    data: registry.articles[id]
  });

});

/* -----------------------------
   Create Author ID
--------------------------------*/

app.post("/create-aid", (req, res) => {

  const id = "AID-" + Date.now();

  const { name, affiliation } = req.body;

  registry.authors[id] = {
    name: name || "Unknown Author",
    affiliation: affiliation || "Unknown"
  };

  res.json({
    message: "Author ID created",
    id: id,
    data: registry.authors[id]
  });

});

/* -----------------------------
   Create Dataset ID
--------------------------------*/

app.post("/create-did", (req, res) => {

  const id = "DID-" + Date.now();

  const { title, url } = req.body;

  registry.datasets[id] = {
    title: title || "Dataset",
    url: url || "https://example.com"
  };

  res.json({
    message: "Dataset ID created",
    id: id,
    data: registry.datasets[id]
  });

});

/* -----------------------------
   Resolver System
--------------------------------*/

app.get("/:id", (req, res) => {

  const id = req.params.id;

  if (registry.articles[id]) {
    return res.redirect(registry.articles[id].url);
  }

  if (registry.datasets[id]) {
    return res.redirect(registry.datasets[id].url);
  }

  if (registry.authors[id]) {
    return res.json(registry.authors[id]);
  }

  res.status(404).send("Identifier not found");

});

/* -----------------------------
   Start Server
--------------------------------*/

app.listen(PORT, () => {
  console.log("REP INDEX running on port " + PORT);
});

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const database = {
  "RID-2026-0001": "https://example.com/research-paper",
  "RID-2026-0002": "https://example.com/article2"
};

app.get("/", (req, res) => {
  res.send("REP Index system running");
});

app.get("/:id", (req, res) => {
  const id = req.params.id;
  const link = database[id];

  if (link) {
    res.redirect(link);
  } else {
    res.send("Identifier not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

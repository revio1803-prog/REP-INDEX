const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("REP Index running");
});

app.listen(3000, () => {
  console.log("Server running");
});

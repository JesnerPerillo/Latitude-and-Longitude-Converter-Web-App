const express = require("express");
const app = express();
import cors from "cors";
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("Server running ar http://localhost:" + port);
})
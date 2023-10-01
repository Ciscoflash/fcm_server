const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res, next) => {
  res.send("Welcome");
});

app.listen(3000, () => {
  console.log(`Application running on port 3000`);
});

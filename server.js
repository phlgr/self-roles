const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/event", (req, res) => {
  const body = req.body;

  if (body.challenge) {
    res.status(200).json({ challenge: body.challenge });
  }
});

app.listen(port, () => {
  console.log(`I'm listening on http://localhost:${port}`);
});

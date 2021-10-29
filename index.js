require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const mailgun = require("mailgun-js");

const app = express();
app.use(formidable());
app.use(cors());

app.get("/", (req, res) => {
  console.log("homepage");
  res.json({ message: "Bienvenue !!!!!" });
});

app.post("/form", async (req, res) => {
  console.log(req.fields);
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: DOMAIN,
  });
  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: process.env.MY_EMAIL,
    subject: `${req.fields.subject}`,
    text: `${req.fields.message}`,
  };
  await mg.messages().send(data, function (error, body) {
    console.log(body);
    console.log(error);
  });
  res.json({ message: "Données bien reçues" });
});

app.all("*", (req, res) => {
  res.status(404).json("page not found");
});

app.listen(process.env.PORT, () => {
  console.log("Server for Formulaire is up");
});

require("dotenv").config();
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const express = require("express");
const app = express();
const cors = require("cors");
process.env.GOOGLE_APPLICATION_CREDENTIALS;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origins: "*",
  })
);

initializeApp({
  credentials: applicationDefault(),
  projectId: "portion for creators",
});

app.post("/api/v1/fcm_nitify", (req, res) => {
  const Tokens = [];
  const titleti
  Tokens.push(req.body.fcmtoken);
  res.json(Tokens);
  const message = {
    notification: {
      title: "Test Notification",
      body: "This is  a test notification",
    },
    tokens: Tokens,
  };

  if (Tokens.length > 0) {
    getMessaging
      .send(message)
      .then((response) => {
        res.status(200).json({
          message: "notification sent successfully",
          token: Tokens,
        });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "Error sending notification", error: err });
      });
  } else {
    getMessaging
      .send(message)
      .then((response) => {
        res.status(200).json({
          message: "notification sent successfully",
          token: Tokens,
        });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "Error sending notification", error: err });
      });
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});

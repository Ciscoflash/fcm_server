require("dotenv").config();
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const express = require("express");
const app = express();
const cors = require("cors");
// process.env.GOOGLE_APPLICATION_CREDENTIALS;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origins: "*",
  })
);

initializeApp({
  credentials: applicationDefault(),
  projectId: "fcm-notification-2a7f7",
});

const token = "";

/**
 * this route registers the device token on the server
 */
app.post("/api/v1/register", (req, res) => {
  if (!req.body.token) {
    res.status(400).json({ status: "fail", message: "Please in the token" });
  }
  token = req.body.token;
  res.status(201).json({ status: "success", message: "Device registered" });
});

/**
 * This route receives a message and broadcasts to the device
 */
app.post("/api/v1/fcm_notify", (req, res) => {
  if (!req.body.message) {
    res
      .status(400)
      .json({ status: "fail", message: "Provide the message to broadcast" });
  }
  const message = {
    notification: {
      title: "Test Notification",
      body: req.body.message,
    },
    //used token instead of tokens because we are currently dealing with only on testing device
    token: token,
  };

  if (token) {
    getMessaging()
      .send(message)
      .then((response) => {
        res.status(200).json({
          message: "notification sent successfully",
          response,
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

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
  projectId: "fcm-notification-2a7f7",
});

var token = "";

app.get("/", (req, res) => {
  res.send("FCM Notification Server");
});
/**
 * this route registers the device token on the server
 */
app.post("/api/v1/register", (req, res) => {
  if (!req.body.token) {
    res.status(400).json({ status: "fail", message: "Please in the token" });
  }
  console.log(req.body.token);
  token = req.body.token;
  res.status(201).json({ status: "success", message: "Device registered" });
});

/**
 * This route receives a message and broadcasts to the device
 */
const messages = [
  {
    type: "Profile",
    message: {
      fullname: "John Smith",
      age: 45,
      gender: "Male",
      transactionId: 1,
    },
  },
  {
    type: "Transaction",
    message: {
      status: "success",
      amount: 100000,
      date: Date.now(),
    },
  },
];

const msg = {
  types: {
    profile: {
      title: "Profile",
      message: {
        fullname: "John Smith",
        age: 45,
        gender: "Male",
        transactionId: 1,
      },
    },
    transaction: {
      title: "Transaction",
      message: {
        status: "success",
        amount: 100000,
        date: Date.now(),
      },
    },
  },
};
app.post("/api/v1/fcm_notify/", (req, res) => {
  let { profile, transaction } = req.query;
  let message;
  if (!req.body.message) {
    res
      .status(400)
      .json({ status: "fail", message: "Provide the message to broadcast" });
  }
  if (profile) {
    message = {
      notification: {
        title: "Test Notification",
        body: "testing the notification",
      },
      data: msg.types.profile,
      //used token instead of tokens because we are currently dealing with only on testing device
      token: token,
    };
  } else {
    message = {
      notification: {
        title: "Test Notification",
        body: "testing the notification",
      },
      data: msg.types.transaction,
      //used token instead of tokens because we are currently dealing with only on testing device
      token: token,
    };
  }
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

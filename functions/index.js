// Imports
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const express = require("express");

// Initialize server
const server = express();

// Parse JSON bodies for this app. Stays **before** route handlers!
server.use(express.json());

// API Endpoints
server.get("/api/some-data", (request, response) => {
  response.send("Hello world");
});

server.post("/api/donation", (request, response) => {
  console.log(request.body);
  response.send(request.body);
});

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAIL_USERNAME,
    pass: process.env.NODEMAIL_PASSWORD,
  },
});

// Firebase Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.sendEmail = functions.firestore
  .document("donations/{donationId}")
  .onCreate((snap, context) => {
    const mailOptions = {
      from: process.env.NODEMAIL_USERNAME,
      to: process.env.DESTINATION_EMAIL,
      subject: `New Donation of ${snap.data().total}`,
      html: `<h1>New Donation of ${snap.data().total}</h1>
    <p> ${
      snap.data().customer
    } kindly donated ${total} with the following distribution. </p>
    <ul>
    <li><b>General Offering: </b>${snap.data().donation.go} </li>
    <li><b>Tithes: </b>${snap.data().donation.ti} </li>
    <li><b>Youth Ministry: </b>${snap.data().donation.ym} </li>
    <li><b>Women's Ministry: </b>${snap.data().donation.wm} </li>

<li><b>Option1: </b>${snap.data().donation.o1} </li>
<li><b>Option2: </b>${snap.data().donation.o2} </li>
<li><b>Option3: </b>${snap.data().donation.o3} </li>
<li><b>Option4: </b>${snap.data().donation.o4} </li>
<li><b>Other: </b>${snap.data().donation.ot} </li>
</ul>

     <p> <b>Email: </b>${snap.data().email} </p>
     <p> <b>Comment: </b>${snap.data().comment} </p>
     <p> <b>Body: </b>${snap.data()} </p>
     `,
    };
    return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log("Sent!");
    });
  });
exports.app = functions.https.onRequest(server);

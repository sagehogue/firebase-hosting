// Imports
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const API_LOGIN = require("./API_SECRETS");
const express = require("express");

// Initialize server
const server = express();

// API Endpoints
server.get("/api/some-data", (request, response) => {
  response.send("Hello world");
});

server.post("/api/donation", (request, response) => {
  console.log(request, request.body);
});
exports.app = functions.https.onRequest(server);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: API_LOGIN.username,
    pass: API_LOGIN.password,
  },
});

exports.sendEmail = functions.firestore
  .document("donations/{donationId}")
  .onCreate((snap, context) => {
    const mailOptions = {
      from: API_LOGIN.username,
      to: API_LOGIN.destinationEmail,
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

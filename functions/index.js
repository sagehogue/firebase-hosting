// Imports
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const firebaseAdmin = require("firebase-admin");
getFirestore = () => firebaseAdmin.firestore();
initializeApp = () => firebaseAdmin.initializeApp();

const express = require("express");

// Initialize server
const server = express();

// Parse JSON bodies for this app. Stays **before** route handlers!
server.use(express.json());

// Initialize Cloud Firestore through Firebase

initializeApp();

const db = getFirestore();
let collection = db.collection;
let addDoc = db.addDoc;

// API Endpoints
server.get("/api/some-data", (request, response) => {
  response.send("Hello world");
  res.status().send(body);
});

server.post("/api/donation", (request, response) => {
  console.log(request.body);
  let {
    GO,
    TI,
    YM,
    WM,
    O1,
    O2,
    O3,
    O4,
    OT,
    total,
    comment,
    donor,
    time,
    id,
    payer,
    purchase_units,
    status,
  } = request.body;
  try {
    const docRef = db.collection("donations").doc(id);

    docRef.set({
      GO,
      TI,
      YM,
      WM,
      O1,
      O2,
      O3,
      O4,
      OT,
      total,
      comment,
      donor,
      time,
      id,
      payer,
      purchase_units,
      status,
    });

    console.log("Document written with ID: ", docRef.id);
    response.send(docRef.id, id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
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
    <p> ${snap.data().payer.name.given_name} ${
        snap.data().payer.name.last_name
      } kindly donated ${
        snap.data().total
      } with the following distribution at ${snap.data().time}. </p>
    <ul>
    <li><b>General Offering: </b>${snap.data().donation.GO} </li>
    <li><b>Tithes: </b>${snap.data().donation.TI} </li>
    <li><b>Youth Ministry: </b>${snap.data().donation.YM} </li>
    <li><b>Women's Ministry: </b>${snap.data().donation.WM} </li>

<li><b>Option1: </b>${snap.data().donation.O1} </li>
<li><b>Option2: </b>${snap.data().donation.O2} </li>
<li><b>Option3: </b>${snap.data().donation.O3} </li>
<li><b>Option4: </b>${snap.data().donation.O4} </li>
<li><b>Other: </b>${snap.data().donation.OT} </li>
</ul>

<p>Donation comment: ${snap.data().comment}</p>

GO,
      TI,
      YM,
      WM,
      O1,
      O2,
      O3,
      O4,
      OT,
      total,
      comment,
      donor,
      time,
      id,
      payer,
      purchase_units,
      status,

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

var firebase = require('firebase');

var config = {
  apiKey: "AIzaSyA9V2-VOPcFZi8sg5t7UplKKMdgkrCz6YE",
  authDomain: "survivalofthetypist.firebaseapp.com",
  databaseURL: "https://survivalofthetypist.firebaseio.com",
  projectId: "survivalofthetypist",
  storageBucket: "survivalofthetypist.appspot.com",
  messagingSenderId: "459571961577"
};

const firebaseDB = firebase.initializeApp(config);

const database = firebaseDB.database();

module.exports = database;

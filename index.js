const { spawn } = require("child_process");
const express = require("express");
var admin = require("firebase-admin");

var serviceAccount = require("./mainmumbaibaazar-firebase-adminsdk-3dnhe-0bc026ca5e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
async function moneyTransfer(session, gameId, today2, winnerNumber) {
  var single = [];
  var singleClose = [];
  var jodi = [];
  var singlePana = [];
  var singlePanaClose = [];
  var doublePana = [];
  var doublePanaClose = [];
  var triplePana = [];
  var triplePanaClose = [];
  var halfSangam = [];
  var halfSangamClose = [];
  var fullSangam = [];
  await db
    .collection("GamesData")
    .doc(gameId)
    .collection("Games")
    .doc(today2)
    .get()
    .then((query) => {
      var temp1 = [];
      var temp2 = [];
      var temp3 = [];
      var temp4 = [];
      var temp5 = [];
      var temp6 = [];
      var temp7 = [];
      var temp8 = [];
      var temp9 = [];
      var temp10 = [];
      var temp11 = [];
      var temp12 = [];
      query.data().Bids.forEach((doc) => {
        if (doc.type === "Single Digit" && doc.session === "Open") {
          temp1.push(doc);
        } else if (doc.type === "Single Digit" && doc.session === "Close") {
          temp8.push(doc);
        } else if (doc.type === "Jodi") {
          temp2.push(doc);
        } else if (doc.type === "Single Panna" && doc.session === "Open") {
          temp3.push(doc);
        } else if (doc.type === "Single Panna" && doc.session === "Close") {
          temp9.push(doc);
        } else if (doc.type === "Double Panna" && doc.session === "Open") {
          temp4.push(doc);
        } else if (doc.type === "Double Panna" && doc.session === "Close") {
          temp10.push(doc);
        } else if (doc.type === "Triple Panna" && doc.session === "Open") {
          temp5.push(doc);
        } else if (doc.type === "Triple Panna" && doc.session === "Close") {
          temp11.push(doc);
        } else if (doc.type === "Half Sangam" && doc.session === "Open") {
          temp6.push(doc);
        } else if (doc.type === "Half Sangam" && doc.session === "Close") {
          temp12.push(doc);
        } else if (doc.type === "Full Sangam") {
          temp7.push(doc);
        }
      });
      var final1 = temp1.filter((t) => t.number == winnerNumber[4]);
      single = final1;
      var final2 = temp2.filter((t) => t.number == winnerNumber.slice(4, 6));
      jodi = final2;
      var final3 = temp3.filter((t) => t.number == winnerNumber.slice(0, 3));
      singlePana = final3;
      var final4 = temp4.filter((t) => t.number == winnerNumber.slice(0, 3));
      doublePana = final4;
      var final5 = temp5.filter((t) => t.number == winnerNumber.slice(0, 3));
      triplePana = final5;
      var final6 = temp6.filter(
        (t) =>
          t.number == winnerNumber[5] &&
          t.extraNumber == winnerNumber.slice(0, 3)
      );
      halfSangam = final6;
      var final7 = temp7.filter(
        (t) =>
          t.number == winnerNumber.slice(0, 3) &&
          t.extraNumber == winnerNumber.slice(7, 10)
      );
      fullSangam = final7;
      var final8 = temp8.filter((t) => t.number == winnerNumber[5]);
      singleClose = final8;
      var final9 = temp9.filter((t) => t.number == winnerNumber.slice(7, 10));
      singlePanaClose = final9;
      var final10 = temp10.filter((t) => t.number == winnerNumber.slice(7, 10));
      doublePanaClose = final10;
      var final11 = temp11.filter((t) => t.number == winnerNumber.slice(7, 10));
      triplePanaClose = final11;
      var final12 = temp12.filter(
        (t) =>
          t.number == winnerNumber[4] &&
          t.extraNumber == winnerNumber.slice(7, 10)
      );
      halfSangamClose = final12;
    });
  var finalWinnerList = [];
  if (session === "open") {
    finalWinnerList.push.apply(finalWinnerList, single);
    finalWinnerList.push.apply(finalWinnerList, singlePana);
    finalWinnerList.push.apply(finalWinnerList, doublePana);
    finalWinnerList.push.apply(finalWinnerList, triplePana);
  } else {
    finalWinnerList.push.apply(finalWinnerList, singleClose);
    finalWinnerList.push.apply(finalWinnerList, jodi);
    finalWinnerList.push.apply(finalWinnerList, singlePanaClose);
    finalWinnerList.push.apply(finalWinnerList, doublePanaClose);
    finalWinnerList.push.apply(finalWinnerList, triplePanaClose);
    finalWinnerList.push.apply(finalWinnerList, halfSangam);
    finalWinnerList.push.apply(finalWinnerList, halfSangamClose);
    finalWinnerList.push.apply(finalWinnerList, fullSangam);
  }
  await db
    .collection("GamesData")
    .doc(gameId)
    .collection("Games")
    .doc(today2)
    .update({
      winnerList:
        finalWinnerList.length > 0
          ? admin.firestore.FieldValue.arrayUnion(...finalWinnerList)
          : [],
    });
  for (let i = 0; i < finalWinnerList.length; i++) {
    var id = finalWinnerList[i].person;
    var amount = finalWinnerList[i].amount;
    var gameType2 = finalWinnerList[i].type;
    var balance = 0;
    await db
      .collection("UsersData")
      .doc(id)
      .get()
      .then((query) => {
        balance = query.data().Balance;
      });
    var multiple = 0;
    await db
      .collection("Rates")
      .doc("rates")
      .get()
      .then((query) => {
        var temp = "";
        switch (gameType2) {
          case "Single Digit":
            temp = "singleDigit";
            break;
          case "Jodi":
            temp = "jodi";
            break;
          case "Single Panna":
            temp = "singlePanna";
            break;
          case "Double Panna":
            temp = "doublePanna";
            break;
          case "Triple Panna":
            temp = "triplePanna";
            break;
          case "Half Sangam":
            temp = "halfSangam";
            break;
          case "Full Sangam":
            temp = "fullSangam";
            break;
        }
        var temp2 = query.data()[temp];
        multiple = parseInt(temp2) / 10;
		
      });

    var tempAmount = parseInt(amount) * parseInt(multiple);
    amount = tempAmount;
    balance = balance + parseInt(amount);
    var timestamptemp = admin.firestore.Timestamp.now();
    var gamingName = "";
    await db
      .collection("GamesData")
      .doc(gameId)
      .get()
      .then((t) => {
        gamingName = t.data().name;
      });
    var obj = [
      {
        amount: parseInt(amount),
        game: gameId,
        gameName: gamingName,
        type: "winning",
        timestamp: timestamptemp,
        session: session,
        type2: gameType2,
      },
    ];
    var trans = admin.firestore.FieldValue.arrayUnion(...obj);
    await db
      .collection("UsersData")
      .doc(id)
      .update({ Balance: balance, Transaction: trans });
  }
}
async function checkAndAdd(map, i, today2) {
  var gameId = "";
  var map2 = map;
  var i2 = i;
  await db
    .collection("GamesData")
    .where("name", "==", map.name[i])
    .get()
    .then(async (value) => {
      if (value.docs.length == 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let dd = yesterday.getDate();
        let mm = yesterday.getMonth() + 1;
        const yyyy = yesterday.getFullYear();
        if (dd < 10) {
          dd = "0" + dd;
        }
        if (mm < 10) {
          mm = "0" + mm;
        }
        const yesterdayFinal = dd + "-" + mm + "-" + yyyy;
        db.collection("GamesData")
          .add({
            active: true,
            end: map2.closetiming[i2],
            start: map2.opentiming[i2],
            name: map2.name[i2],
            type: "normal",
          })
          .then(async (ref) => {
            await db.collection("GamesData").doc(ref.id).update({
              id: ref.id,
            });
			await db
              .collection("GamesData")
              .doc(ref.id)
              .collection("Games")
              .doc(yesterdayFinal)
              .set({
                Numbers: '***-**-***',
                resultdeclared: true,
                opendeclared: true,
                closedeclared: true,
                opendeclared2: true,
                Bids: [],
                winnerList: [],
				created: admin.firestore.FieldValue.serverTimestamp(),
              });
			if(map2.results[i2].length==10 && map2.results[i2]!='***-**-***'){
				await db
				.collection("GamesData")
				.doc(ref.id)
				.collection("Games")
				.doc(today2)
				.set({
				  Numbers: map2.results[i2],
				  resultdeclared: true,
				  opendeclared: true,
				  closedeclared: true,
				  opendeclared2: true,
				  Bids: [],
				  winnerList: [],
				  created: admin.firestore.FieldValue.serverTimestamp(),
				});
			}else if(map2.results[i2].length==5 && map2.results[i2]!='***-**'){
				await db
				.collection("GamesData")
				.doc(ref.id)
				.collection("Games")
				.doc(today2)
				.set({
				  Numbers: map2.results[i2],
				  resultdeclared: true,
				  opendeclared: true,
				  closedeclared: false,
				  opendeclared2: true,
				  Bids: [],
				  winnerList: [],
				  created: admin.firestore.FieldValue.serverTimestamp(),
				});
			}
			
			else{
            await db
              .collection("GamesData")
              .doc(ref.id)
              .collection("Games")
              .doc(today2)
              .set({
                Numbers: '***-**-***',
                resultdeclared: false,
                opendeclared: false,
                closedeclared: false,
                opendeclared2: false,
                Bids: [],
                winnerList: [],
				created: admin.firestore.FieldValue.serverTimestamp(),
              });
			}
          });
      } else {
        gameId = value.docs[0].id;
        var opengame = value.docs[0].data().start;
        var closegame = value.docs[0].data().end;
        opengame.replaceAll(":", "");
        closegame.replaceAll(":", "");
        var currentresult = map2.results[i2] || '';
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let dd = yesterday.getDate();
        let mm = yesterday.getMonth() + 1;
        const yyyy = yesterday.getFullYear();
        if (dd < 10) {
          dd = "0" + dd;
        }
        if (mm < 10) {
          mm = "0" + mm;
        }
        const yesterdayFinal = dd + "-" + mm + "-" + yyyy;
        var yesterdayresult = "";
        var yesterdaycloseDec = false;
        var tempCheck = "";
        var it = 1;
        (async () => {
          while (tempCheck == "") {
            const yesterday2 = new Date();
            yesterday2.setDate(yesterday2.getDate() - it);
            let dd = yesterday2.getDate();
            let mm = yesterday2.getMonth() + 1;
            const yyyy = yesterday2.getFullYear();
            if (dd < 10) {
              dd = "0" + dd;
            }
            if (mm < 10) {
              mm = "0" + mm;
            }
            const yesterdayFinal2 = dd + "-" + mm + "-" + yyyy;
			var value2;
            await db
              .collection("GamesData")
              .doc(gameId)
              .collection("Games")
              .doc(yesterdayFinal2)
              .get()
              .then(async (value) => {
				  value2=value;
                if (value.exists) {
                    tempCheck = value.data().Numbers;
                }
              });
            if (!value2.exists) {
              break;
            }
            it++;
          }
        })().then(async () => {
          await db
            .collection("GamesData")
            .doc(gameId)
            .collection("Games")
            .doc(yesterdayFinal)
            .get()
            .then(async (value) => {
              yesterdayresult = value.data().Numbers;
              yesterdaycloseDec = value.data().closedeclared;
            });
          var openstatus = false;
          var closestatus = false;
          var resultsatus = false;
          await db
            .collection("GamesData")
            .doc(gameId)
            .collection("Games")
            .doc(today2)
            .get()
            .then(async (value) => {
              openstatus = value.data().opendeclared;
              closestatus = value.data().closedeclared;
              resultsatus = value.data().resultdeclared;
            });
          if (currentresult != yesterdayresult && currentresult != tempCheck) {
            if (yesterdaycloseDec == false) {
              await db
                .collection("GamesData")
                .doc(gameId)
                .collection("Games")
                .doc(yesterdayFinal)
                .update({
                  resultdeclared: true,
                  opendeclared: true,
                  closedeclared: true,
                  Numbers: map.results[i],
                });
              await moneyTransfer(
                "close",
                gameId,
                yesterdayFinal,
                map.results[i]
              );
            }
            if (currentresult != "*****" && currentresult.length == 5) {
              if (
                openstatus == false &&
                resultsatus == false &&
                closestatus == false
              ) {
                await db
                  .collection("GamesData")
                  .doc(gameId)
                  .collection("Games")
                  .doc(today2)
                  .update({
                    resultdeclared: true,
                    opendeclared: true,
                    closedeclared: false,
                    Numbers: map.results[i],
                  });
                await moneyTransfer("open", gameId, today2, map.results[i]);
              }
            } else if (
              currentresult != "Loading..." &&
              currentresult.length == 10
            ) {
              if (
                openstatus == true &&
                resultsatus == true &&
                closestatus == false
              ) {
                await db
                  .collection("GamesData")
                  .doc(gameId)
                  .collection("Games")
                  .doc(today2)
                  .update({
                    resultdeclared: true,
                    opendeclared: true,
                    closedeclared: true,
                    Numbers: map.results[i],
                  });
                await moneyTransfer("close", gameId, today2, map.results[i]);
              }
            }
          }
        });
      }
    });
}
app.get("/refresh", function (req, res) {
  res.send("done");
});
app.get("/", function (req, res) {
  const child_python = spawn("python3", ["codespace.py"]);

  child_python.stdout.on("data", (data) => {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    const today2 = dd + "-" + mm + "-" + yyyy;
    let x = data.toString();
    var map = JSON.parse(x);
    let xq = map.name.length;
    for (let i = 0; i < xq; i++) {
      checkAndAdd(map, i, today2);
    }
    res.send("Success");
	return;
  });
  child_python.stderr.on("data", (data) => {
    res.send("Error" + data);
    console.error("stderr" + data);
	return;
  });
  child_python.on("close", (code) => {
    console.log("std code" + code);
  });
});

const port = process.env.PORT || "3000";
app.listen(port, function () {
  console.log("Server started at port " + port);
});

$(document).ready(function () {
    
    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyCFsX1lNaJKErfcVZno27TSpqH2lcWyYas",
        authDomain: "train-scheduler-bed86.firebaseapp.com",
        databaseURL: "https://train-scheduler-bed86.firebaseio.com",
        projectId: "train-scheduler-bed86",
        storageBucket: "train-scheduler-bed86.appspot.com",
        messagingSenderId: "215177976669"
    };
    firebase.initializeApp(config);

    // Reference the database
    let database = firebase.database();

    // Capture button click on submit
    $("#trainSubmit").on("click", function () {
        event.preventDefault();

        // Store input values
        let trainNm = $("#trainName").val().trim();
        let trainDst = $("#trainDest").val().trim();
        let trainFreq = $("#trainFreq").val().trim();
        let firstTrain = moment($("#firstTrainTime").val(), "HH:mm").format("");
        
        // Adding New train
        let newTrain = {
            train: trainNm,
            dest: trainDst,
            freq: trainFreq,
            first: firstTrain,
        };

        database.ref().push(newTrain);

        // Clear form after push
        $("#trainName").val("");
        $("#trainDest").val("");
        $("#trainFreq").val("");
        $("#firstTrainTime").val("");
        
        return false;
    });

    // Child storage
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {

        
        let trainName = childSnapshot.val().train;
        let trainDest = childSnapshot.val().dest;
        let trainFreq = childSnapshot.val().freq;
        let firstTrain = childSnapshot.val().first;
        
        // First Time (pushed back 1 year to make sure it comes before current time)
        let firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years")
        // console.log(firstTimeConverted);

        let currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the first train and current times
        let timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);

        // Remaining time
        let timeLeft = timeDifference % trainFreq;
        console.log("Time left: " + timeLeft);

        // Minutes until next train arrives
        let minTrainAway = trainFreq - timeLeft;
        console.log("MINUTES TILL TRAIN: " + minTrainAway);

        // Next train arrival time
        let nextTrain = moment().add(minTrainAway, "minutes");
        let trainArriveTime = moment(nextTrain).format("hh:mm a");
        console.log("Train Arrival: " + trainArriveTime);


        // Puts text into table
        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + "Every " + trainFreq + " min." + "</td><td>" + trainArriveTime + "</td><td>" + "In " + minTrainAway + " min." + "</td></tr>");

    });

    // Display locale time
    ShowTime();
   
});

// Locale time to html
function ShowTime() {
let dt = new Date();
document.getElementById("localeTime").innerHTML = dt.toLocaleTimeString();
window.setTimeout("ShowTime()", 1000);
}
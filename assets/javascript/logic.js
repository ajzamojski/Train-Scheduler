  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAWNp9RphBo5w-1me5PUTGdryJCB8P1O6s",
    authDomain: "train-scheduler-e0ff3.firebaseapp.com",
    databaseURL: "https://train-scheduler-e0ff3.firebaseio.com",
    storageBucket: "train-scheduler-e0ff3.appspot.com",
    messagingSenderId: "1007672431625"
  };
  firebase.initializeApp(config);

  //References the firebase database
  var database = firebase.database();

  //Function is excecuted when submit button is pressed
  $("#add-train-btn").on("click", function(event) {
  	  event.preventDefault();

  	//Variable declaration
  	var intervalId;
  	var trainName = 		$("#train-name-input").val().trim();
  	var destinationName = 	$("#destination-input").val().trim();
  	var trainTime =  moment($("#train-start-input").val().trim(), "HH:mm").format("HH:mm");
  	var frequency1= 		$("#timer-input").val().trim();

  	console.log(trainName);
  	console.log(destinationName);
  	console.log(trainTime);
  	console.log(frequency1);

  	//Creates object that holds train items
  	var newTrain =
  	{
  		trainName: trainName,
  		destinationName: destinationName,
  		trainTime: trainTime,
  		frequency1: frequency1
  	}

  	//Sends the train object to the database
  	database.ref().push(newTrain);

  	return false;
  });

	// Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
	database.ref().on("child_added", function(snapshot) {

		var trainName = snapshot.val().trainName;
		var destinationName = snapshot.val().destinationName;
		var trainTime = snapshot.val().trainTime;
		var frequency = snapshot.val().frequency1;
		// var trainButton = snapshot.val().trainButton;

		// Time entered
		var tFrequency = frequency;

		// First Time (pushed back 1 year to make sure it comes before current time)
		var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
		console.log(firstTimeConverted);
		console.log("first train: " + trainTime);
		console.log("runs every: " + frequency);

    	// Current Time
		var currentTime = moment();
		console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

   		// Difference between the times
		var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
		console.log("DIFFERENCE IN TIME: " + diffTime);

		// Time apart (remainder)
	    var tRemainder = diffTime % tFrequency;
	    console.log(tRemainder);

	    // Minute Until Train
	    var tMinutesTillTrain = tFrequency - tRemainder;
	    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	    // Next Train
	    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");
	    console.log("ARRIVAL TIME: " + nextTrain);


	    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + 
	    	destinationName + "</td><td>" + frequency + "</td><td>" + 
	    	nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");

	});

	function run () {
		intervalId = setInterval(decrement, 1000);
	}

	function decrement () {
		$("#displayTime").html("Current Time: " + "<strong>" + moment().format("HH:mm:ss") + "</strong>");
	}

	run();


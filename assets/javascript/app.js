// Gloabal variables
var triviaQuestions = [{
      question: "What do the letters CPU stand for when referring to the “brains” of a computer?",
      answerList: ["Center Processing Unit", "Central Processing Unit", "Central Processor Unit", "Control Processing Unit"],
      answer: 1,
      image: "assets/images/cpu.gif"
    }, {
      question: "Mark Zuckerberg was one of the founders of which social networking site?",
      answerList: ["Facebook","Twitter","Instagram","YouTube"],
      answer: 0,
      image: "assets/images/facebook.gif"
    }, {
      question: "In 1975 an engineer created the first electronic camera while working for what company?",
      answerList: ["Fujifilm","Velvia","Polaroid","Kodak"],
      answer: 3, 
      image: "assets/images/kodak.gif"
    }, {
      question: "The Nitendo company was founded in what year?",
      answerList: ["1889","1990","1980","1890"],
      answer: 0, 
      image: "assets/images/nintendo.gif"
    }, {
      question: "The first person shooter video game Doom was first released in what year?",
      answerList: ["1990","1993","1989","1994"],
      answer: 1, 
      image: "assets/images/doom.gif"
    }, {
      question: "In database programming, SQL is an acronym for what?",
      answerList: ["Straight Query Link","Straight Query Language","Structured Query Language","Structured Query Link"],
      answer: 2, 
      image: "assets/images/sql.gif"
    }, {
      question: "The companies HP, Microsoft and Apple were all started in where?",
      answerList: ["Office","Garage","Home","Research Lab"],
      answer: 1, 
      image: "assets/images/garage.gif"
    }, {
      question: "Which of the following is not a method for encoding text characters on a computer?",
      answerList: ["EBCDIC","ASCII","ANSI","SIXBIT"],
      answer: 2, 
      image: "assets/images/ansi.gif"
    }, {
      question: "In what year was the iPhone first released?",
      answerList: ["2006","2003","2007","2005"],
      answer: 2, 
      image: "assets/images/iphone.gif"
    }, {
      question: "Which of the following is a non-impact printer?",
      answerList: ["Dot Matrix Printer","Daisy-Wheel Printer","Line Printer","Ink Jet Printer"],
      answer: 3, 
      image: "assets/images/printer.gif"
    }   
];
var unshuffledQuestionArray = [0,1,2,3,4,5,6,7,8,9]; // Unshuffled index list of questions
var shuffledQuestionArray = []; // Shuffled index list of questions
var timerObject;                // Timer object for answering question
var allowedTime = 12;            // Time allowed for answering the question. For ease of testing and debugging purposes
var timerIndex = allowedTime;   // Timer to keep track of allowed time 
var numCorrectAnswers = 0;      // Count number of corrected answers
var numIncorrectAnswers = 0;    // Count number of incorrect answers
var numUnanswers = 0;           // Count number of unanswered questions
var questionCounter = 0;        // Counter to keep track of the number of questions being asked
var rightAnswer = new Audio ('assets/sounds/correct-sound.mp3');
var wrongAnswer = new Audio ('assets/sounds/wrong-sound.mp3');
var beepSound = new Audio ('assets/sounds/beep.mp3');
var questionIndex = 0;          // Keep track of the current question number
var answeredFlag;               // A flag to show if player selected an answer or not
var selectedAnswerIndex;        // Player selected answer index number
var messages = {
    correctMessage: "Correct!",
    incorrectMessage: "Nope!",
    UnanswerMessage: "Out of Time!",
    endGameMessage: "All done, here is how you did!"
};

// Change the view from title screen to game screen
function changeView() {
  $("#titleScreen").empty();
  $("#gameScreen").show();
};

// Reset answer section for next question
function resetAnswerPage() {
  $('#gameMessage').empty();
  $('#correctAnswer').empty();
  $('#imageId').empty();
  answeredFlag = false;
};

// Reset question section
function resetQuestionPage() {
  $('#questionLeft').empty();
  $('#question').empty();
  $('#answerList').empty();
  $('.selectedAnswer').empty();
}; 

// Reset summary section
function resetSummaryPage () {
  $("#endGameMessage").empty();
  $("#numCorrectAnswers").empty();
  $("#numIncorrectAnswers").empty();
  $("#numUnanswers").empty();
  $("#restartBtn").empty();
};

//Reset all values
function reset() {
  numCorrectAnswers = 0;
  numIncorrectAnswers = 0; 
  numUnanswers = 0; 
  questionCounter = 0;  
  questionIndex = 0; 
  timerIndex = allowedTime;       
  $('#timeLeft').empty();
  resetQuestionPage();
  resetAnswerPage();
  resetSummaryPage();
  clearInterval(timerObject);
}

// Timer runs every second for game play
function runTimer () {
  timerObject = setInterval(updateClock, 1000);
};

// Game play timer
function updateClock () {
  $('#timeLeft').html('<h3> Time Remaining: ' + timerIndex + ' Seconds </h3>');
  if (timerIndex <= 3 && timerIndex > 0) {
    beepSound.play();
  }
  timerIndex--;
  // Timeout to show answer
  if (timerIndex < 0) {
    clearTimeout(timerObject);
    timerIndex = allowedTime;
    answerSection();
  } 
}; 

// Show the answer section
function answerSection () {
  var correctAnswerIndex = triviaQuestions[questionIndex].answer;
  var correctAnswerImage = triviaQuestions[questionIndex].image;
  var correctAnswer = triviaQuestions[questionIndex].answerList[correctAnswerIndex];

  resetQuestionPage();
  if (selectedAnswerIndex === correctAnswerIndex && answeredFlag) {
    rightAnswer.play();
    numCorrectAnswers++;
    $('#gameMessage').html(messages.correctMessage);
  } else if (selectedAnswerIndex != correctAnswerIndex && answeredFlag) {
    wrongAnswer.play();
    numIncorrectAnswers++;
    $('#gameMessage').html(messages.incorrectMessage);
    $('#correctAnswer').html('The Correct Answer was: '+ correctAnswer);
  } else {
    wrongAnswer.play();
    numUnanswers++;
    $('#gameMessage').html(messages.UnanswerMessage);
    $('#correctAnswer').html('The Correct Answer was: '+ correctAnswer);
  }
  $('#imageId').html('<img alt="No Picture" class="img-fluid img-pic" src='+correctAnswerImage+">");

  // End game to show score summary
  if (questionCounter === shuffledQuestionArray.length) {
    setTimeout(showResult, 4000);
  } else {
    // Show next question
    timerIndex = allowedTime;
    setTimeout(showQuestion, 4000);
  }
};

// Show next question
function showQuestion () {
  questionIndex =  shuffledQuestionArray[questionCounter];
  questionCounter++;

  resetAnswerPage();
  // Setup new question
  $('#questionLeft').html('Question #' + (questionCounter) + " of " + shuffledQuestionArray.length);
  $('#question').html('<h3>' + triviaQuestions[questionIndex].question + '</h3>');
  // Setup answer list
  for (var i=0; i < triviaQuestions[questionIndex].answerList.length; i++) {
    var answers = $('<div class="row col-12">');

    answers.text(triviaQuestions[questionIndex].answerList[i]);
    answers.attr({'data-index': i});
    answers.addClass('selectedAnswer lead');
    $('#answerList').append(answers);
  }
  runTimer();

  // Check if an answer is correct or not
  $('.selectedAnswer').on('click', function() {
    selectedAnswerIndex = $(this).data('index');
    clearTimeout(timerObject);
    answeredFlag = true;
    answerSection();
  });
};

// Show end result of the game play
function showResult () {
  resetAnswerPage();
  $('#endGameMessage').html(messages.endGameMessage);
  $('#numCorrectAnswers').html('Correct Answers: '+ numCorrectAnswers);
  $('#numIncorrectAnswers').html('Incorrect Answers: '+numIncorrectAnswers);
  $('#numUnanswers').html('Unanswered: '+numUnanswers);
  $('#restartBtn').html('Start Over?');
};

// Shuffle the index to randomize the order of questions
function shuffle(sourceArray) {
  for (var i = 0; i < sourceArray.length - 1; i++) {
      var j = i + Math.floor(Math.random() * (sourceArray.length - i));
      var temp = sourceArray[j];

      sourceArray[j] = sourceArray[i];
      sourceArray[i] = temp;
  }
  return sourceArray;
}

// Start game play
startGamePlay = function () {
  changeView();
  shuffledQuestionArray = shuffle(unshuffledQuestionArray);
  showQuestion ();
};

// Add click listener to start button
$("#startBtn").click(startGamePlay); 

// Add click listener to restart button
$('#restartBtn').on('click', function() {
  reset();
  shuffledQuestionArray = shuffle(unshuffledQuestionArray);
  showQuestion ();
});

$(document).ready(function() {
  $('#gameScreen').hide();
});
function GameManager(InputManager, Actuator, StorageManager) {
  this.inputManager   = new InputManager;
  //  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;

  this.currentQuestion;
  this.list_bases = [2,8,10,16];

  this.inputManager.on("answerSelected", this.checkAnswer.bind(this));
  this.inputManager.on("wrongAnswer", this.wrongAnswer.bind(this));
  this.setup();
};

GameManager.prototype.setup = function(){
  this.question    = this.generateNewQuestion();
  this.score       = 0;
  this.bestscore   = 0;
  this.over        = false;

  // set an initial question
  this.question    = this.generateNewQuestion();

  // Update the actuator
  this.actuate();
}

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over;
};

GameManager.prototype.generateNewQuestion = function(){
  // select two bases for the question
  var leftBase = this.list_bases[Math.floor(Math.random() * this.list_bases.length)];
  var rightBase = leftBase;
  while(rightBase == leftBase){
    rightBase = this.list_bases[Math.floor(Math.random() * this.list_bases.length)];
  }

  // select one value, select the second value with the first one in mind
  var leftValue = 10 + Math.floor(Math.random() * 20)
  var isDifferent = Math.round(Math.random());
  var rightValue = leftValue + isDifferent*(Math.round(Math.random() * 5  - 2.5));

  var question = {};
  // add answer information
  question.operator = "==";
  question.leftAnswer   = leftValue;
  question.leftBase     = leftBase;
  question.rightAnswer  = rightValue;
  question.rightBase    = rightBase;
  // add meta information
  question.answertime             = 10000;
  question.answertimeoutcallback  = this.wrongAnswer.bind(this);

  return question;
}

GameManager.prototype.wrongAnswer = function(){
    this.over = true;
    this.actuate();
}

GameManager.prototype.correctAnswer = function(){
  this.score += 1;
  if(this.bestscore < this.score){
    this.bestscore = this.score;
  }
  this.question = this.generateNewQuestion();
  this.actuate();
}

// Check whether the answer was correct
GameManager.prototype.checkAnswer = function(answer){
  // 0: left, 1: right
  var self = this;

  // Don't do anything if the game's over
  if (self.isGameTerminated()) return;

  // check whether the current answer is correct
  var isCorrect = (self.question.leftAnswer == self.question.rightAnswer) ? 1 : 0;
  // if the answer is wrong, reset score,
  if(isCorrect != answer){
    this.wrongAnswer();
  }
  // otherwise increase counter select the next question
  else{
    this.correctAnswer();
  }
}

// send the upgraded gamestate to the board
GameManager.prototype.actuate = function () {
  this.actuator.actuate(this.question, {
    score:      this.score,
    over:       this.over,
    bestScore:  this.bestscore,
    terminated: this.isGameTerminated()
  });
}

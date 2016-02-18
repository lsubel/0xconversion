function GameManager(InputManager, Actuator, StorageManager, QuestionManager) {
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  this.questionManager= new QuestionManager(this.wrongAnswer.bind(this));

  this.currentQuestion;
  this.list_bases = [2,8,10,16];

  this.inputManager.on("openMenu", this.openMenu.bind(this));
  this.inputManager.on("answerSelected", this.checkAnswer.bind(this));
  this.inputManager.on("wrongAnswer", this.wrongAnswer.bind(this));
  this.inputManager.on("restartGame", this.restart.bind(this));
  this.inputManager.on("setDifficulty", this.setDifficulty.bind(this));
  //  this.setup();
  this.openMenu();
};

GameManager.prototype.openMenu = function(){
  this.actuator.showMainmenuPopup();
}

GameManager.prototype.restart = function(){
  this.actuator.restartGame();
  this.setup();
}

GameManager.prototype.setup = function(){
  this.question    = this.questionManager.generateNewQuestion();
  this.score       = 0;
  this.over        = false;

  // Update the actuator
  this.actuate();
}

GameManager.prototype.setDifficulty = function(difficulty){
  this.questionManager.setDifficulty(difficulty);
  this.actuator.hideMainmenuPopup();
  this.restart();
}

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over;
};

GameManager.prototype.wrongAnswer = function(){
    this.over = true;
    this.actuate();
}

GameManager.prototype.correctAnswer = function(){
  this.score += 1;
  if(this.storageManager.getBestScore(this.questionManager.getDifficulty()) < this.score){
    this.storageManager.setBestScore(this.questionManager.getDifficulty(), this.score);
  }
  this.question = this.questionManager.generateNewQuestion();
  this.actuate();
}

// Check whether the answer was correct
GameManager.prototype.checkAnswer = function(answer){
  if(this.over)
    return;
  // if the answer is wrong, reset score,
  if(this.questionManager.isCorrectAnswer(answer)){
    this.correctAnswer();
  }
  // otherwise increase counter select the next question
  else{
    this.wrongAnswer();
  }
}

// send the upgraded gamestate to the board
GameManager.prototype.actuate = function () {
  this.actuator.actuate(this.question, {
    score:      this.score,
    over:       this.over,
    bestScore:  this.storageManager.getBestScore(this.questionManager.getDifficulty()),
    terminated: this.isGameTerminated()
  });
}

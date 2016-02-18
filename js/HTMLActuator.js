function HTMLActuator() {
  this.questionLeftContainer      = document.querySelector(".question-left");
  this.questionOperatorContainer  = document.querySelector(".question-operator");
  this.questionRightContainer     = document.querySelector(".question-right");
  this.scoreContainer             = document.querySelector(".score-container");
  this.bestContainer              = document.querySelector(".best-container");
  this.messageContainer           = document.querySelector(".game-message");
  this.progressbar                = document.querySelector(".progress-bar");
  this.mainmenuContainer          = document.querySelector(".game-menu");

  this.timeReference  = new Date();
  this.score          = 0;
  this.over           = false;
}

HTMLActuator.prototype.calculateStrLength = function (value, base){
  var length = 1;
  while(value / base >= 1){
    value = value / base;
    length += 1;
  }
  return length;
}

HTMLActuator.prototype.actuate = function (questions, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.over = metadata.over;

    if(!self.over){
      // reset containers + progressbar
      self.clearContainer(self.questionLeftContainer);
      self.clearContainer(self.questionOperatorContainer);
      self.clearContainer(self.questionRightContainer);

      var timediff            = Date.now() + questions.answertime;
      self.progressbar.max    = questions.answertime;
      self.progressbar.value  = questions.answertime;
      self.answertime         = timediff;

      var left_length   = self.calculateStrLength(questions.leftAnswer,   questions.leftBase);
      var right_length  = self.calculateStrLength(questions.rightAnswer,  questions.rightBase);
      var string_length = Math.max(left_length, right_length);

      // write down the current questions
      self.addQuestions(self.questionLeftContainer,   questions.leftAnswer,   questions.leftBase, string_length);
      self.setOperator(self.questionOperatorContainer, questions.operator);
      self.addQuestions(self.questionRightContainer,  questions.rightAnswer,  questions.rightBase, string_length);

      // update score + bestscore
      self.updateScore(metadata.score);
      self.updateBestScore(metadata.bestScore);

      self.updateProgressBar(questions.answertimeoutcallback);
    }
    else{
      self.stopProgressBar();
      self.showGameoverPopup(metadata.score);
    }
  });
};

HTMLActuator.prototype.restartGame = function(){
  this.hideGameoverPopup();
}

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addQuestions = function(container, value, base, length){
  var self = this;

  var wrapper     = document.createElement("div");
  var inner       = document.createElement("div");
  var elem_value  = document.createElement("span");
  var elem_base   = document.createElement("span");

  inner.classList.add("tile-inner");
  elem_value.classList.add("math-value");
  elem_base.classList.add("math-base");

  var str_value = value.toString(base);
  while(str_value.length < length){
    str_value = "0" + str_value;
  }
  elem_value.textContent = str_value;
  elem_base.textContent = base;

  inner.appendChild(elem_value);
  inner.appendChild(elem_base);

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  container.appendChild(wrapper);
};

HTMLActuator.prototype.setOperator = function(container, operator){
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");

  inner.classList.add("tile-inner");
  inner.textContent = operator;

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  container.appendChild(wrapper);
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.updateProgressBar = function(callback){
  var self = this;
  if(self.over)
    return;
  var timediff = self.answertime - Date.now();
  // if below zero, time has run out
  if(timediff < 0){
    callback();
  }
  else{
    self.progressbar.value = timediff;
    window.requestAnimationFrame(function(){
      self.updateProgressBar(callback);
    });
  }
}

HTMLActuator.prototype.stopProgressBar = function(){
  this.progressbar.value = 0;
}

HTMLActuator.prototype.showGameoverPopup = function(score){
  this.hideMainmenuPopup();
  this.messageContainer.classList.add("show-popup");
  this.messageContainer.getElementsByTagName("p")[1].textContent = "You received " + score + " points."
}

HTMLActuator.prototype.hideGameoverPopup = function(){
  this.messageContainer.classList.remove("show-popup");
}

HTMLActuator.prototype.showMainmenuPopup = function(score){
  this.hideGameoverPopup();
  this.mainmenuContainer.classList.add("show-popup");
}

HTMLActuator.prototype.hideMainmenuPopup = function(){
  this.mainmenuContainer.classList.remove("show-popup");
}

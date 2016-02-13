function HTMLActuator() {
  this.questionLeftContainer    = document.querySelector(".question-left");
  this.questionRightContainer   = document.querySelector(".question-right");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (questions, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.questionLeftContainer);
    self.clearContainer(self.questionRightContainer);

    // write down the current questions
    self.addQuestions(self.questionLeftContainer,   questions.leftAnswer,   questions.leftBase);
    self.addQuestions(self.questionRightContainer,  questions.rightAnswer,  questions.rightBase);

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);
  });
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addQuestions = function(container, value, base){
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");

  inner.classList.add("tile-inner");
  inner.textContent = value + "_" + base;

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

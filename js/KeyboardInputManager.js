function KeyboardInputManager() {
  this.events = {};

  this.eventTouchstart    = "touchstart";
  this.eventTouchmove     = "touchmove";
  this.eventTouchend      = "touchend";

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restartGame");
};

KeyboardInputManager.prototype.goToMenu = function (event) {
  event.preventDefault();
  this.emit("openMenu");
};

var possible_difficulties = {
  "answer-difficulty-easy": "easy",
  "answer-difficulty-medium": "medium",
  "answer-difficulty-hard": "hard"
};

KeyboardInputManager.prototype.setDifficulty = function (event) {
  var keys = Object.keys(possible_difficulties);
  for(index in keys){
    var key = keys[index];
    if(event.target.classList.contains(key)){
      event.preventDefault();
      this.emit("setDifficulty", possible_difficulties[key]);
      return;
    }
  }
};

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener("click", fn.bind(this));
  button.addEventListener(this.eventTouchend, fn.bind(this));
};

var map = {
  37: 0, // Left
  39: 1, // Right
  65: 0, // A
  68: 1  // D
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  // Respond to direction keys
  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    var mapped    = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("answerSelected", mapped);
      }
    }

    // R key restarts the game
    if (!modifiers && event.which === 82) {
      self.restart.call(self, event);
    }
  });

  this.bindButtonPress(".answer-wrong", this.pressWrong);
  this.bindButtonPress(".answer-right", this.pressRight);

  this.bindButtonPress(".answer-difficulty-easy",   this.setDifficulty);
  this.bindButtonPress(".answer-difficulty-medium", this.setDifficulty);
  this.bindButtonPress(".answer-difficulty-hard",   this.setDifficulty);

  this.bindButtonPress(".openmenu-button", this.goToMenu);

  this.bindButtonPress(".restart-button", this.restart);
};

KeyboardInputManager.prototype.pressWrong = function(event){
  event.preventDefault();
  this.emit("answerSelected", 0);
}

KeyboardInputManager.prototype.pressRight = function(event){
  event.preventDefault();
  this.emit("answerSelected", 1);
}

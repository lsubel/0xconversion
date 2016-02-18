function QuestionGenerator(list_base_1, list_base_2, base, offset, range){
  this.list_bases_left  = list_base_1;
  this.list_bases_right = list_base_2;
  this.base             = base;
  this.offset           = offset;
  this.range            = range;
}

QuestionGenerator.prototype.generateNewQuestion = function(){
  // select two bases for the question
  var leftBase = this.list_bases_left[Math.floor(Math.random() * this.list_bases_left.length)];
  var rightBase = leftBase;
  while(rightBase == leftBase){
    rightBase = this.list_bases_right[Math.floor(Math.random() * this.list_bases_right.length)];
  }

  // select one value, select the second value with the first one in mind
  var leftValue = this.base + Math.floor(Math.random() * this.offset)
  var isDifferent = Math.round(Math.random());
  var rightValue = leftValue + isDifferent*(Math.round(Math.random() * this.range  - (this.range/2)));

  var question = {};
  // add answer information
  question.operator = "==";
  question.leftAnswer   = leftValue;
  question.leftBase     = leftBase;
  question.rightAnswer  = rightValue;
  question.rightBase    = rightBase;

  return question;
}

// Check whether the answer was correct
QuestionGenerator.prototype.isCorrectAnswer = function(question, answer){
  // check whether the current answer is correct
  var isCorrect = (question.leftAnswer == question.rightAnswer) ? 1 : 0;

  return isCorrect == answer;
}

function NumberQuestionManager(fn){
  this.difficulty = {
    "easy":   new QuestionGenerator([2],[10], 10, 20, 5),
    "medium": new QuestionGenerator([2],[8, 16], 10, 60, 5),
    "hard": new QuestionGenerator([2, 10],[2, 8, 10, 16], 20, 100, 7)
  };
  this.wrongAnswer = fn;
}

NumberQuestionManager.prototype.setDifficulty = function(difficulty){
  this.current_generator  = this.difficulty[difficulty];
  this.current_difficulty = difficulty;
}

NumberQuestionManager.prototype.generateNewQuestion = function(){
  this.current_question = this.current_generator.generateNewQuestion();
  // add meta information
  this.current_question.answertime             = 10000;
  this.current_question.answertimeoutcallback  = this.wrongAnswer;
  return this.current_question;
}

NumberQuestionManager.prototype.isCorrectAnswer = function(answer){
  return this.current_generator.isCorrectAnswer(this.current_question, answer);
}

NumberQuestionManager.prototype.getDifficulty = function(){
  return this.current_difficulty;
}

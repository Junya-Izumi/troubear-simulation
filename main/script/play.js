document.querySelector("#game_start").addEventListener("click", () => {
  set_fade_time(2);
  transition("play");
  new game(globalThis.jsonQuestions[globalThis.selectCourse_index]);
});

class game {
  static default_countDown = 15;
  static instance = null;
  constructor(courseData) {
    this.courseData = courseData;
    this.mainTimer = new timer("down", game.default_countDown);
    this.question = 0;
    game.instance = this;
    this.start();
    this.display_courseName();
    this.gameResult = "";
  }
  start() {
    this.display_nextStep(false);
    document.querySelector(".next_step").addEventListener("click", this.nextStep);
    this.mainTimer.countEvent = this.display_mainTimer.bind(this);
    this.mainTimer.stopEvent = (() => { if (this.mainTimer.getTime() == 0) this.gameOver() }).bind(this);
    this.mainTimer.start();
    this.nextStep();
  }
  display_mainTimer(time) {
    document.querySelector("#count_down").innerText = `${time}秒`;
  }
  display_courseName() {
    document.querySelector("#course_name").innerText = this.courseData.name;
  }
  display_backgroundImage() {
    const thisQuestion = this.courseData.questions[this.question]
    document.querySelector(".display .background").src = thisQuestion.imageURL.background;
  }
  display_bearImage() {
    const bear_img = document.querySelector(".bear");
    const thisQuestion = this.courseData.questions[this.question];
    if (Array.from(bear_img.classList).includes("incorrect")) bear_img.classList.remove("incorrect");
    if (Array.from(bear_img.classList).includes("correct")) bear_img.classList.remove("correct");
    bear_img.src = thisQuestion.imageURL.bear;
  }
  display_selection() {
    document.querySelectorAll(".selection_list button").forEach((element, index) => {
      const thisSelection = this.courseData.questions[this.question].selection[index];
      element.innerText = `${index + 1}.${thisSelection}`;
      element.dataset.problem_statement = thisSelection;
      element._handler = (e) => this.click_selection(e);
      element.addEventListener("click", element._handler, true);
    });
  }
  display_nextStep(display) {
    const next_step = document.querySelector(".next_step");
    if (display) {
      next_step.disabled = false;
      next_step.style.pointerEvents = "unset";
      next_step.style.opacity = 1;
    } else {
      next_step.disabled = true;
      next_step.style.pointerEvents = "none";
      next_step.style.opacity = 0;
    }
  }
  display_answer(display) {
    if (display) {
      const thisQuestion = this.courseData.questions[this.question - 1];
      const answerNum = thisQuestion.answer;
      const answerSelection = thisQuestion.selection[answerNum];
      const answerExplanation = thisQuestion.answer_explanation;
      document.querySelector(".answer").style.opacity = 1;
      document.querySelector(".answer_selection").innerText = `答え：${answerNum+1}.${answerSelection}`;
      document.querySelector(".answer_explanation").innerText = answerExplanation;
    } else {
      document.querySelector(".answer").style.opacity = 0;
    }
  }
  display_gameResult() {
    const result = document.querySelector(".game_result");
    const resultImg = document.querySelector(".game_result_image");
    if (this.gameResult == "gameClear") {
      result.innerText = "game clear!";
      resultImg.src = "./image/bear/bear_4.png";
    } else {
      result.innerText = "game over";
      resultImg.src = "./image/bear/bear_5.png";
    }
  }
  display_effect(effect) {
    const effect_div = document.querySelector(".effect");
    effect_div.classList.remove("effect_correct");
    effect_div.classList.remove("effect_incorrect");
    if (effect === "") return;
    effect_div.classList.add(`effect_${effect}`);
  }
  setNextStepText(text) {
    document.querySelector(".next_step").innerText = text;
  }
  incorrect() {
    game.instance.setNextStepText("ゲームオーバー");
    game.instance.setNextStepText("次に進む");
    game.instance.gameResult = "gameOver";
    game.instance.display_answer(true);
    game.instance.display_nextStep(true);
    document.querySelector(".bear").classList.add("incorrect");
    this.display_effect("incorrect");
  }
  correct() {
    this.setNextStepText("次に進む");
    this.gameResult = "gameClear";
    const bear_img = document.querySelector(".bear");
    if (Array.from(bear_img.classList).includes("incorrect")) {
      bear_img.classList.remove("incorrect");
    }
    this.display_answer(true);
    bear_img.classList.add("correct");
    this.display_effect("correct");
    this.display_nextStep(true);
    this.mainTimer.stop();
  }
  nextStep() {
    const instance = game.instance;
    try {
      if (instance.gameResult == "gameOver") {
        throw new Error("gameOver");
      }
      const thisQuestion = instance.courseData.questions[Math.max(instance.question, 0)];
      instance.display_nextStep(false);
      document.querySelector(".question").innerText = thisQuestion.problem_statement;
      instance.display_effect("");
      instance.display_backgroundImage();
      instance.display_bearImage();
      instance.display_selection();
      instance.display_answer(false);
      instance.mainTimer.reset();
      instance.mainTimer.start();
      instance.question++;
    } catch (error) {
      instance.display_gameResult();
      instance.transition_rezult();
    }
  }
  click_selection(e) {
    game.instance.mainTimer.autoRestart = false;
    const thisQuestion = game.instance.courseData.questions[Math.max(game.instance.question - 1, 0)]
    const plyaerSelection = e.target.dataset.problem_statement; 
    if (thisQuestion.selection.indexOf(plyaerSelection) === thisQuestion.answer) {
      game.instance.correct();
    } else {
      game.instance.gameOver();
    }
    document.querySelectorAll(".selection_list button").forEach((element) => {
      element.removeEventListener("click", element._handler, true);
    });
  }
  gameOver() {
    this.incorrect();
    this.mainTimer.stop();
  }
  transition_rezult() {
    transition("result");
    document.querySelector(".next_step").removeEventListener("click", this.nextStep);
  }
}

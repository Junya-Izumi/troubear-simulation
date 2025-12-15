function transition(pageName) {
  document.querySelectorAll(".contents > .active").forEach((element) => {
    element.classList.remove("active");
  });
  document.querySelector("." + pageName).classList.add("active");
}
function set_fade_time(time) {
  document.documentElement.style.setProperty('--fade_time', time + "s");
}
globalThis.selectCourse_index = NaN;
window.addEventListener("DOMContentLoaded", () => {
  const loadQusetionsFile = async ()=> {
    const response = await fetch("data/questions.json");
    const jsonQuestions = await response.json();
    return jsonQuestions;
  }
  const preload = (url)=> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
  }
  loadQusetionsFile().then((data) => {
    globalThis.jsonQuestions = data;
    let preloadList = [];
    for (let i = 0; i < 7; i++) {
      preloadList.push(preload.bind(null,`./image/bear/bear_${i}.png`));
    }
    for (let i = 1; i < 8; i++) {
      preloadList.push(preload.bind(null,`./image/background/background_${i}.png`));
    }
    preloadList.push(preload.bind(null,"./image/icon/arrow_back.svg"));
    preloadList.push(preload.bind(null,"./image/icon/favicon.png"));
    preloadList.push(preload.bind(null,"./image/icon/mobile_rotate.svg"));
    preloadList.push(preload.bind(null,"./image/icon/question.png"));
    preloadList.push(preload.bind(null,"./image/effect/correct.png"));
    preloadList.push(preload.bind(null,"./image/effect/incorrect.png"));
    const loadPrelodList = new Promise((resolve,reject)=>{
      preloadList.forEach((func)=>{
        func();
      });
      resolve();
    })
    loadPrelodList.then(()=>{
      inner_course_list(data);
      document.querySelectorAll(".course_list > li").forEach((element) => {
        element.addEventListener("click", selecting_course);
      });
    })
  });
  document.querySelectorAll(".go_title").forEach((element) => {
    element.addEventListener("click", () => {
      set_fade_time(0.5);
      transition("title");
    });
  });
  check_please_rotate();
});

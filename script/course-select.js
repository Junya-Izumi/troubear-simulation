function inner_course_list(data) {
  const list = document.querySelector(".course_list");
  list.textContent = '';
  for (let i in data) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    const span = document.createElement("span");
    img.src = data[i].imageURL.bear;
    span.innerText = data[i].name;
    li.dataset.index = i;
    li.style.backgroundImage = `url(${data[i].imageURL.background})`;
    li.appendChild(img);
    li.appendChild(span);
    list.appendChild(li);
  }
}

function selecting_course(e) {
  const active_li = document.querySelector(".course_list > .active");
  if (active_li) {
    active_li.classList.remove("active");
  }
  e.target.classList.add("active");
  document.querySelector("#game_start").disabled = false;
  globalThis.selectCourse_index = Number(document.querySelector(".course_list > .active").dataset.index);
}

function check_smartphone() {
  const contents = document.querySelector(".contents");
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    contents.style.width = "100vw";
  } else {
    contents.style.width = "unset";
  }
}
window.addEventListener("resize", check_smartphone);
window.addEventListener("load", check_smartphone);

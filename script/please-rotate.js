function check_please_rotate() {
  const please_rotate = document.querySelector(".please-rotate");
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && window.innerWidth > window.innerHeight) {
    please_rotate.classList.add("active");
  } else {
    please_rotate.classList.remove("active");
  }
}
window.addEventListener("resize", check_please_rotate);

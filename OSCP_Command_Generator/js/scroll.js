import { dom } from "./dom.js";

export function bindScrollToTop() {
  const btn = dom.toTopBtn();
  const scroller = dom.main();

  function update() {
    const y = scroller ? scroller.scrollTop : 0;
    if (y > 500) btn.classList.add("show");
    else btn.classList.remove("show");
  }

  btn.addEventListener("click", () => {
    if (!scroller) return;
    scroller.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (scroller) {
    scroller.addEventListener("scroll", update, { passive: true });
    update();
  }
}

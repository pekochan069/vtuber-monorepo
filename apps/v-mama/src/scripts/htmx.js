import * as htmx from "htmx.org";
document.addEventListener("astro:after-swap", () => {
  htmx.process(document.body);
});
window.htmx = htmx;

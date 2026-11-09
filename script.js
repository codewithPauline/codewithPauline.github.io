"use strict";

// The document remains readable and all evidence links work without JavaScript.
document.documentElement.classList.add("js-ready");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
const mobileViewport = window.matchMedia("(max-width: 620px)");

function closeMenu(returnFocus = false) {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  if (returnFocus) menuButton.focus();
}
function syncNavigation() {
  menuButton.hidden = !mobileViewport.matches;
  closeMenu();
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  )
    closeMenu(true);
});
mobileViewport.addEventListener("change", syncNavigation);
syncNavigation();

// Fixed, source-verified values from GeneScope-FM's chromosome-holdout report.
// Rounded display values match the report; paired intervals are not derived
// by subtracting marginal confidence limits.
const benchmark = {
  accuracy: {
    values: [68.2, 73.7, 80.2],
    labels: ["68.2%", "73.7%", "80.2%"],
    axis: "100%",
    gain: "+6.5",
    unit: "percentage points",
    interval: "NT vs. 3-mers · paired 95% interval: +3.33 to +9.67 points",
    description:
      "Test balanced accuracy: GC and length 68.2 percent, 3-mer frequencies 73.7 percent, frozen Nucleotide Transformer 80.2 percent. Bars start at zero.",
  },
  auroc: {
    values: [73.6, 81.5, 85.9],
    labels: ["0.736", "0.815", "0.859"],
    axis: "1.0",
    gain: "+0.0439",
    unit: "AUROC",
    interval: "NT vs. 3-mers · paired 95% interval: +0.0072 to +0.0768",
    description:
      "Test AUROC: GC and length 0.736, 3-mer frequencies 0.815, frozen Nucleotide Transformer 0.859. Bars start at zero.",
  },
};
const metricControls = document.querySelector(".metric-controls");
metricControls.hidden = false;
metricControls.addEventListener("click", (event) => {
  const button = event.target.closest("[data-metric]");
  if (!button) return;
  const data = benchmark[button.dataset.metric];
  metricControls
    .querySelectorAll("button")
    .forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
  document.querySelectorAll("[data-bar]").forEach((bar, index) => {
    bar.style.width = `${data.values[index]}%`;
  });
  document.querySelectorAll("[data-value]").forEach((value, index) => {
    value.textContent = data.labels[index];
  });
  document.querySelector("#axis-max").textContent = data.axis;
  document
    .querySelector(".benchmark-chart")
    .setAttribute("aria-label", data.description);
  const unit = document.createElement("span");
  unit.textContent = data.unit;
  document
    .querySelector("#metric-gain")
    .replaceChildren(document.createTextNode(`${data.gain} `), unit);
  document.querySelector("#metric-interval").textContent = data.interval;
});

// A quiet section indicator; navigation never depends on observer support.
if ("IntersectionObserver" in window) {
  const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sectionLinks.forEach((link) => {
            if (link.hash === `#${entry.target.id}`)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    },
    { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("#home, #work, #research, #about, #contact")
    .forEach((section) => observer.observe(section));
}
document.querySelector("#year").textContent = String(new Date().getFullYear());

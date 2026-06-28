const countUp = (element) => {
  const target = Number(element.dataset.count || 0);
  const isCurrency = element.textContent.trim().startsWith("$");
  const duration = 1200;
  const start = performance.now();

  const render = (value) => {
    element.textContent = isCurrency
      ? `$${value.toLocaleString()}`
      : value.toLocaleString();
  };

  const step = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);
    const value = Math.round(target * progress);
    render(value);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  document.querySelectorAll("[data-count]").forEach((element) => {
    countUp(element);
  });

  const workflowSteps = [...document.querySelectorAll(".workflow-step")];
  let activeStep = 0;
  const workflowInterval = window.setInterval(() => {
    workflowSteps[activeStep].classList.remove("is-active");
    activeStep = (activeStep + 1) % workflowSteps.length;
    workflowSteps[activeStep].classList.add("is-active");
  }, 1800);

  window.addEventListener(
    "pagehide",
    () => {
      window.clearInterval(workflowInterval);
    },
    { once: true }
  );
});

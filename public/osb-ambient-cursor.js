/**
 * OSBW ambient cursor — trailing glow-dot (same pattern as Resonant Web Design).
 * Color: hourglass sand — glowing yellow-orange (not flat copper).
 * Desktop fine-pointer only; respects prefers-reduced-motion.
 */
(function () {
  try {
    var canUse =
      window.matchMedia(
        "(hover: hover) and (pointer: fine) and (min-width: 992px)"
      ).matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canUse || document.querySelector(".ambient-cursor")) return;

    var cursor = document.createElement("div");
    cursor.className = "ambient-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML =
      '<svg viewBox="0 0 36 36" focusable="false"><circle cx="18" cy="18" r="16" pathLength="100"></circle></svg>';
    document.body.appendChild(cursor);

    var progressRing = cursor.querySelector("circle");
    var interactiveSelector =
      'a, button, input, textarea, select, summary, [role="button"], [tabindex]:not([tabindex="-1"])';

    var targetX = 0;
    var targetY = 0;
    var currentX = 0;
    var currentY = 0;
    var hasPosition = false;
    var frameId = 0;

    function setVisible(on) {
      if (on) cursor.classList.add("is-visible");
      else cursor.classList.remove("is-visible");
    }

    function render() {
      // 0.25 = same lag as Resonant trail
      currentX += (targetX - currentX) * 0.25;
      currentY += (targetY - currentY) * 0.25;
      cursor.style.transform =
        "translate3d(" + (currentX - 3) + "px, " + (currentY - 3) + "px, 0)";
      frameId = window.requestAnimationFrame(render);
    }

    function updateProgress() {
      var scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      var progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (progressRing) {
        progressRing.style.strokeDashoffset = String(100 - progress * 100);
      }
    }

    document.addEventListener(
      "mousemove",
      function (event) {
        targetX = event.clientX;
        targetY = event.clientY;

        if (!hasPosition) {
          currentX = targetX;
          currentY = targetY;
          hasPosition = true;
          setVisible(true);
          frameId = window.requestAnimationFrame(render);
        }

        var target = event.target instanceof Element ? event.target : null;
        cursor.classList.toggle(
          "is-interactive",
          Boolean(target && target.closest(interactiveSelector))
        );
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", function () {
      setVisible(false);
    });
    document.addEventListener("mouseenter", function () {
      if (hasPosition) setVisible(true);
    });

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener(
      "pagehide",
      function () {
        if (frameId) window.cancelAnimationFrame(frameId);
      },
      { once: true }
    );

    updateProgress();
  } catch (e) {
    /* non-fatal */
  }
})();

export function makeStatsDraggable(stats) {
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function onMouseMove(event) {
    if (isDragging) {
      const dx = event.clientX - previousMousePosition.x;
      const dy = event.clientY - previousMousePosition.y;

      const statsDom = stats.dom;
      statsDom.style.left = `${statsDom.offsetLeft + dx}px`;
      statsDom.style.top = `${statsDom.offsetTop + dy}px`;

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }

  function onMouseUp() {
    isDragging = false;
  }

  stats.dom.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);

  return () => {
    stats.dom.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
}

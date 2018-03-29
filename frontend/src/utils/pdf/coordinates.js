export const viewportToScaled = (rect, viewport) => ({
  top: (viewport.top - rect.top) / rect.height,
  left: (viewport.left - rect.left) / rect.width,
  height: viewport.height / rect.height,
  width: viewport.width / rect.width,
});

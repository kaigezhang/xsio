export const getPageFromElement = (target) => {
  const node = target.closest('.react-pdf__Page');
  if (!(node instanceof HTMLElement)) {
    return null;
  }
  const number = Number(node.dataset.pageNumber);
  return { node, number };
};

export const getCanvasFromElement = (target) => {
  const parent = target.closest('.react-pdf__Page');
  // const TextNode = target.closest('.ReactPDF__Page__canvas');

  if (!(parent instanceof HTMLElement)) {
    return null;
  }
  const node = parent.childNodes[0];
  const number = Number(node.dataset.pageNumber);
  return { node, number };
};

export const getPageFromRange = (range) => {
  const { parentElement } = range.startContainer;
  if (!(parentElement instanceof HTMLElement)) {
    return null;
  }

  return getPageFromElement(parentElement);
};

export const findOrCreateContainerLayer = (container, className) => {
  let layer = container.querySelector(`.${className}`);

  if (!layer) {
    layer = document.createElement('div');
    layer.className = className;
    container.appendChild(layer);
  }

  return layer;
};

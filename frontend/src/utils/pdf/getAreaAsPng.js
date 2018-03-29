/* eslint-disable */
const getAreaAsPng = (canvas, selectors) => {
  // selectors 中的pdfRectagle 包括所需要的内容
  const { left, top, width, height } = selectors.pdfRectangles
  if (!canvas) {
    return ""
  }
  const boundingRect = canvas.getBoundingClientRect()
  const lf = left * boundingRect.width
  const tp = top * boundingRect.height
  const wd = width * boundingRect.width
  const hg = height * boundingRect.height
  // TODO cache this
  const newCanvas = document.createElement('canvas')


  if (!(newCanvas instanceof HTMLCanvasElement)) {
    return ""
  }


  newCanvas.width = wd
  newCanvas.height = hg


  const newCanvasContext = newCanvas.getContext('2d')
  if (!newCanvasContext) {
    return ""
  }
  const dpr = window.devicePixelRatio
  newCanvasContext.drawImage(
    canvas,
    lf * dpr,
    tp * dpr,
    wd * dpr,
    hg * dpr,
    0,
    0,
    wd,
    hg
  )
  return newCanvas.toDataURL("image/png")
}

export default getAreaAsPng

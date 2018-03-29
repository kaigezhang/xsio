import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import 'react-virtualized/styles.css';
/* text selection stuff */
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import debounce from 'lodash/debounce';
import last from 'lodash/last';
import rangy from 'rangy/lib/rangy-core';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import { Document, Page } from 'components/PdfViewer';
import getAreaAsPng from 'utils/pdf/getAreaAsPng';
import { getRectanglesSelector, getTextPositionSelector, getTextQuoteSelector, } from 'utils/pdf/selectors';
import { viewportToScaled } from 'utils/pdf/coordinates';
import { findOrCreateContainerLayer, getCanvasFromElement, getPageFromElement } from 'utils/pdf/pdfDom';
import { callIfDefined } from 'utils/pdf/utils';

import TipContainer from './components/TipContainer';
import MouseSelection from './components/MouseSelection';

import './PdfViewer.css';

require('rangy/lib/rangy-textrange');

// import Loader from './Loader';
// import Buttons from './Buttons';

const CLICK_TIMEOUT = 300;
let clickTimeoutId = 0;

class PdfViewer extends Component {
  static propTypes = {
    scale: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {

      // highlight 相关
      lastSelectors: undefined,
      popupTarget: {},
      lastSimpleSelection: undefined,
      ghostHighlight: null,
      scrolledToHighlightId: null,
      // 框选时候要用到
      isAreaSelectionInProgress: false,

      pdf: null,
      cachedPageHeights: null,
      responsiveScale: null,
      currentPage: 1,
      tip: null,

      isCollapsed: true,
      isMouseDown: false,
    };
    this._pages = new Map();
    this._callOrientationChangeHandler = this.handleResize.bind(this);
    this.renderHighlights = debounce(this.renderHighlights.bind(this), 100);
  }

  componentDidMount() {
    this._mounted = true;

    if (this.containerNode) {
      this.containerNode.addEventListener('mousedown', this.onMouseDown);
      this.containerNode.addEventListener('mouseup', this.onMouseUp);
    }
  }


  componentWillUnmount() {
    this._mounted = false;
    if (this.containerNode) {
      this.containerNode.addEventListener('mousedown', this.handleKeyDown);
      this.containerNode.removeEventListener('mouseup', this.onMouseUp);
    }
  }
  onMouseDown = (e) => {
    if (!(e.target instanceof HTMLElement) || e.target.closest('.PdfAnnotator__tip-layer')) {
      return null;
    }
    this.hideTipAndSelection();
    clickTimeoutId = setTimeout(
      () => this.setState({ isMouseDown: true }),
      CLICK_TIMEOUT
    );
  }
  componentDidUpdate(nextProps) {
    this.calResponsiveScale();
    this.renderHighlights();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.scale !== nextProps.scale) {
      this.reCacheHeights();
    }

    if (this.props.highlights !== nextProps.highlights) {
      console.log('highlights change', nextProps.highlights);
      this.renderHighlights(nextProps);
    }
  }


  calResponsiveScale() {
    if (this.state.cachedPageHeights && !this.state.responsiveScale) {
      const node = this._pages.get(this.state.currentPage);
      if (node) {
        this.setState({
          responsiveScale: this.state.cachedPageHeights.get(1) / node.clientHeight
        }, () => this._list.recomputeRowHeights());
      }
    }
  }


  onDocumentLoadSuccess = (pdf) => {
    this.setState({ pdf, originalScale: this.props.scale });
    this.cachePageHeights(pdf);
    callIfDefined(this.props.onPdfDocumentLoadSuccess);
    this.onDocumentReady();
  }

  onDocumentReady = () => {
    const { scrollRef } = this.props;
    scrollRef(this.scrollTo);
  }

  scrollTo = (highlight) => {
    const { pageNumber } = highlight.selectors.pdfRectangles[0];
    console.log(pageNumber, 'pageNumber');
    this.handleClick(pageNumber - 1);
  }

  /**
   * Load all pages so we can cache all page heights.
   *
   * @param {object} pdf
   * @return {void|null}
   */
  cachePageHeights = (pdf) => {
    const promises = Array
      .from({ length: pdf.numPages }, (v, i) => i + 1)
      .map(pageNumber => pdf.getPage(pageNumber));

    // 假设所有页面的高度都不相同
    Promise.all(promises).then((values) => {
      if (!this._mounted) {
        return null;
      }

      const pageHeights = values.reduce((accPageHeights, page) => {
        accPageHeights.set(page.pageIndex + 1, page.pageInfo.view[3] * this.props.scale);
        return accPageHeights;
      }, new Map());

      this.setState({ cachedPageHeights: pageHeights });
    });
  }
  // ugly hack, 为了保持文章页面的间距
  reCacheHeights = async () => {
    const { cachedPageHeights, originalScale } = this.state;
    const { scale } = this.props;
    await cachedPageHeights.forEach((value, key) => {
      cachedPageHeights.set(key, Math.round(value * (scale / originalScale) * 1000) / 1000);
    });
    this.setState({ cachedPageHeights }, () => {
      this.handleResize();
    });
  }
  computeRowHeight = ({ index }) => {
    const { cachedPageHeights, responsiveScale } = this.state;
    if (cachedPageHeights && responsiveScale) {
      const height = cachedPageHeights.get(index + 1) / responsiveScale;
      return height;
    }

    return 768;
  }

  updateCurrentVisiblePage = ({ stopIndex }) => {
    this.setState({ currentPage: stopIndex + 1 });
  }

  handleResize = () => {
    // Recompute the responsive scale factor on window resize
    const node = this._pages.get(this.state.currentPage);
    const responsiveScale = this.state.cachedPageHeights.get(this.state.currentPage) / node.clientHeight;
    if (responsiveScale !== this.state.responsiveScale) {
      this.setState({ responsiveScale }, () => this._list.recomputeRowHeights());
    }
  }

  handleClick = async index => await this._list && this._list.scrollToRow(index)

  rowRenderer = ({ key, index, style }) => {
    const pageNumber = index + 1;
    const { scale, pageClass } = this.props;
    return (
      <div style={style} key={key}>
        <div ref={ref => this._pages.set(pageNumber, ref)}>
          <StyledPage
            id={`page_${pageNumber}`}
            pdf={this.state.pdf}
            pageNumber={pageNumber}
            scale={scale}
            className={pageClass}
            onLoadError={error => console.error(error)}
          />
        </div>
      </div>
    );
  }

  inputRef = (ref) => {
    this.pages = ref;
  }

  onMouseUp = () => {
    clearTimeout();
    this.onTextSelect();
  }

  getRect = (selectors) => {
    if (selectors.image) {
      return selectors.pdfRectangles;
    }
    return selectors.isBackwards ? selectors.pdfRectangles[0] : last(selectors.pdfRectangles);
  }
  renderTipAtPosition = (popupTarget, inner) => {
    const { selectors } = popupTarget;
    if (!selectors || !selectors.pdfRectangles) {
      return null;
    }
    const rect = this.getRect(selectors);


    if (rect) {
      const { pageNumber } = rect;
      const page = this.pages.querySelector(`#page_${pageNumber}`);
      // const pageBoundingRect = page.getBoundingClientRect()

      const tipNode = findOrCreateContainerLayer(page, 'PdfAnnotator__tip-layer');
      // const { selectors } = popupTarget
      ReactDOM.render(
        <TipContainer
          popupTarget={popupTarget}
          // pageBoundingRect={pageBoundingRect}
          childrenNode={inner}
          style={{
            top: `${!selectors.isBackwards && (rect.top + rect.height) * 100}%`,
            left: `${!selectors.isBackwards && (rect.left + rect.width) * 100}%`,
            bottom: `${selectors.isBackwards && (1 - rect.top) * 100}%`,
            right: `${selectors.isBackwards && (1 - rect.left) * 100}%`,
          }}
        />,
        tipNode
      );
    }
  }

  hideTipAndSelection = () => {
    // this.containerNode.removeEventListener('mouseup', this.onMouseUp);
    const { ghostHighlight, tip } = this.state;
    let rect  = null;
    if (ghostHighlight && ghostHighlight.selectors) {
      rect = this.getRect(ghostHighlight.selectors);
    } else if (tip && tip.selectors) {
      rect = this.getRect(tip.selectors);
    }

    if (rect) {
      const { pageNumber } = rect;
      const page = this.pages.querySelector(`#page_${pageNumber}`);
      const tipNode = findOrCreateContainerLayer(page, 'PdfAnnotator__tip-layer');

      ReactDOM.unmountComponentAtNode(tipNode);
      rangy.getSelection().removeAllRanges();
      this.setState({
        popupTarget: null,
        ghostHighlight: null,
        tip: null,
      }, () => {
        this.renderHighlights();
      });
    }

    // this.containerNode.addEventListener('mouseup', this.onMouseUp);
  }

  onSelect = (selectors) => {
    const { onSelectionFinished } = this.props;
    if (!selectors) return null;
    if (isEqual(selectors, this.state.lastSelectors)) return;
    this.setState({
      lastSelectors: selectors,
      popupTarget: { selectors },
      ghostHighlight: {
        selectors,
        color: 4,
      }
    }, () => this.renderTipAtPosition(
      this.state.popupTarget,
      onSelectionFinished(
        this.state.ghostHighlight,
        () => this.hideTipAndSelection(),
        () => this.renderHighlights()
      )
    ));
  }

  onTextSelect = async () => {
    const selection = rangy.getSelection();

    // no selection object or no anchor/focus
    if (!selection || !selection.anchorNode || !selection.focusNode) {
      return this.onSelect(undefined);
    }
    // selection not contained in element?
    if (!rangy.dom.isAncestorOf(this.pages, selection.anchorNode) ||
      !rangy.dom.isAncestorOf(this.pages, selection.focusNode)) {
      return this.onSelect(undefined);
    }

    // do not allow collapsed / empty selections
    if (!selection.toString()) {
      return this.onSelect(undefined);
    }

    // do not allow selections with zero or more than one ranges
    if (selection.rangeCount !== 1) {
      return this.onSelect(undefined);
    }


    // do nothing if start and end are equal to last selection
    // NOTE: this currently does not work because getRectanglesSelector
    //       creates new TextNodes in order to measure selections
    const simpleSelection = pick(
      selection,
      'anchorNode', 'anchorOffset', 'focusNode', 'focusOffset'
    );
    if (isEqual(simpleSelection, this.state.lastSimpleSelection)) {
      return;
    }
    this.setState({
      lastSimpleSelection: simpleSelection,
    });

    const range = selection.getAllRanges()[0];
    const pageRanges = [];

    this._pages.forEach((value, key) => {
      if (value) {
        if (!range.intersectsNode(value)) return null;
        const pageRange = rangy.createRange();
        pageRange.selectNodeContents(value);
        pageRanges.push({
          pageNumber: key,
          range: range.intersection(pageRange),
        });
      }
    });


    const selectors = {
      textQuote: await getTextQuoteSelector(range, this.pages),
      isBackwards: selection.isBackwards(),
      pdfTextQuotes: await pageRanges.map((pageRange) => {
        const selector = getTextQuoteSelector(pageRange.range, this._pages.get(pageRange.pageNumber));
        selector.pageNumber = pageRange.pageNumber;
        return selector;
      }),
      pdfTextPosition: await pageRanges.map((pageRange) => {
        const selector = getTextPositionSelector(pageRange.range, this._pages.get(pageRange.pageNumber));
        selector.pageNumber = pageRange.pageNumber;
        return selector;
      }),
      pdfRectangles: await flatten(pageRanges.map((pageRange) => {
        const rectSelectors = getRectanglesSelector(range, this._pages.get(pageRange.pageNumber).childNodes[0]);
        rectSelectors.forEach(selector => selector.pageNumber = pageRange.pageNumber);
        return rectSelectors;
      })),
    };

    return this.onSelect(selectors);
  }

  groupHighlightsByPage = (highlights) => {
    // const { highlights } = nextProps || this.props;
    const { ghostHighlight } = this.state;
    const res =  [...highlights, ghostHighlight].filter(Boolean).reduce(
      (res, highlight) => {
        if (!highlight || !highlight.selectors || !highlight.selectors.pdfRectangles) {
          return {};
        }
        const { selectors } = highlight;
        const isTextSelectors = !(selectors && selectors.image);
        if (isTextSelectors) {
          const pageNumbers = uniq(selectors.pdfRectangles.map(rect => rect.pageNumber));
          // TODO: 不太确定，这里的reduce是否会给一个页面引入过多的selectors
          pageNumbers.forEach((pageNumber) => {
            res[pageNumber] = res[pageNumber] || [];
            res[pageNumber].push(highlight);
          });
        } else {
          const { pageNumber } = selectors.pdfRectangles;
          // const pn = String(pageNumber);
          res[pageNumber] = res[pageNumber] || [];
          res[pageNumber].push(highlight);
        }
        return res;
      }, {}
    );
    return res;
  }

  findOrCreateHighlighterLayer = (page) => {
    const pageDiv = this.pages.querySelector(`#page_${page}`);
    if (!pageDiv) {
      return null;
    }
    return findOrCreateContainerLayer(
      pageDiv,
      'PdfAnnotator__highlight-layer'
    );
  }

  showTip = (tip, callback) => {
    const {
      isCollapsed,
      ghostHighlight,
      isMouseDown,
      isAreaSelectionInProgress
    } = this.state;
    const highlightInProgress = !isCollapsed || ghostHighlight;
    if (highlightInProgress || isMouseDown || isAreaSelectionInProgress) {
      return null;
    }
    this.renderTipAtPosition(tip, callback);
  }
  screenShot = (selectors, pageNumber) => {
    const canvas = this.pages.querySelector(`#page_canvas_${pageNumber}`);
    return getAreaAsPng(canvas, selectors);
  }

  renderHighlights(nextProps) {
    const { highlightTransform, highlights } = nextProps || this.props;
    const { pdf } = this.state;
    // highlights = highlights || [];
    if (!pdf) { return null; }
    const { numPages } = pdf;
    const highlightsByPage = this.groupHighlightsByPage(highlights);
    const { tip, scrolledToHighlightId } = this.state;
    // const { popupTarget } = this.state;

    // return highlightTransform(popupTarget);


    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const highlightLayer = this.findOrCreateHighlighterLayer(pageNumber);
      if (highlightLayer) {
        ReactDOM.render(
          <div>
            {
              (highlightsByPage[String(pageNumber)] || []).map(
                (highlight, index) => {
                  const { selectors, ...rest } = highlight;
                  if (tip && tip.highlight.id === String(highlight.id)) {
                    this.showTip(tip.highlight, tip.callback(selectors));
                  }
                  //
                  const isScrolledTo = Boolean(
                    scrolledToHighlightId === highlight.id
                  );
                  return highlightTransform(
                    highlight,
                    index,
                    (highlight, callback) => {
                      this.setState({
                        tip: { highlight, callback }
                      });
                      this.showTip(highlight, callback(highlight));
                    },
                    this.hideTipAndSelection,
                    (rect) => {
                      const viewport = this.pages.querySelector(`#page_${rect.pageNumber}`);
                      return viewportToScaled(rect, viewport);
                    },
                    selectors => this.screenShot(selectors, pageNumber),
                    isScrolledTo,
                  );
                }
              )
            }
          </div>,
          highlightLayer
        );
      }
    }
  }

  toggleTextSelection = (flag) => {
    const { toggleAreaSelection } = this.props;
    this.pages.classList.toggle('PdfAnnotator--disable-selection', flag);
    toggleAreaSelection(flag);
  }

  viewportPositionToScaled =(rect) => {
    // const pdfRectangles = {
    //   top: (boundingRect.top - rect.top) / rect.height,
    //   left: (boundingRect.left - rect.left) / rect.width,
    //   height: boundingRect.height / rect.height,
    //   width: boundingRect.width / rect.width,
    //   pageNumber: page.number,
    // };
  }

  onSelection = (
    startTarget,
    boundingRect,
    resetSelection
  ) => {
    /* 这个函数就主要是在canvas画图使用, 需要知道所在的页面DOM, 并且知道画出的图形的区域 */
    const page = getPageFromElement(startTarget);
    const { onSelectionFinished } = this.props;
    if (!page.node) {
      return;
    }
    const rect = page.node.getBoundingClientRect();
    const pdfRectangles = {
      top: (boundingRect.top - rect.top) / rect.height,
      left: (boundingRect.left - rect.left) / rect.width,
      height: boundingRect.height / rect.height,
      width: boundingRect.width / rect.width,
      pageNumber: page.number,
    };

    const image = this.screenShot({ pdfRectangles }, page.number);
    const selectors = {
      pdfRectangles,
      image,
    };

    const ghostHighlight = {
      selectors,
      color: 4
    };

    this.setState({
      ghostHighlight,
      popupTarget: { selectors }
    }, () => {
      this.renderTipAtPosition(
        this.state.popupTarget,
        onSelectionFinished(
          ghostHighlight,
          () => this.hideTipAndSelection(),
          () => {
            resetSelection();
            this.renderHighlights();
          }));
    });
    // this.renderTipAtPosition(
    //   { selectors },
    //   onSelectionFinished(
    //     ghostHighlight,
    //     () => this.hideTipAndSelection(),
    //     () => this.setState({
    //       ghostHighlight,
    //     }, () => {
    //       resetSelection();
    //       this.renderHighlights();
    //     })
    //   )
    // );
  }
  shouldStart = (e) => {
    const { enableAreaSelection } = this.props;
    return !!(enableAreaSelection &&
      e.target instanceof HTMLElement &&
      Boolean(e.target.closest('.react-pdf__Page')));
  }


  render() {
    const { file, enableAreaSelection, loading } = this.props;
    const { pdf } = this.state;
    return (
      <div
        ref={node => this.containerNode = node}
        // onMouseUp={() => setTimeout(this.onMouseUp, 0)}
      >

        <Document
          file={file}
          loading={loading}
          onLoadSuccess={this.onDocumentLoadSuccess}
          onLoadError={error => console.error(error)}
          inputRef={this.inputRef}
        >
          {
            pdf &&
            <WindowScroller onResize={this.handleResize}>
              {
                ({ height, isScrolling, onChildScroll, scrollTop }) => (
                  <AutoSizer disableHeight>
                    {
                      ({ width }) => (
                        <List
                          autoheight
                          height={height}
                          width={width}
                          isScrolling={isScrolling}
                          onRowsRendered={this.updateCurrentVisiblePage}
                          onScroll={onChildScroll}
                          scrollToAlignment="start"
                          scrollTop={scrollTop}
                          overscanRowCount={5}
                          rowCount={pdf.numPages}
                          rowHeight={this.computeRowHeight}
                          rowRenderer={this.rowRenderer}
                          style={{ outline: 'none' }}
                          ref={ref => this._list = ref}
                        />
                      )
                    }

                  </AutoSizer>
                )
              }
            </WindowScroller>
          }
          { pdf ? (
            <MouseSelection
              onDragStart={() => this.toggleTextSelection(true)}
              onDragEnd={() => this.toggleTextSelection(false)}
              onChange={isVisible => this.setState({
                isAreaSelectionInProgress: isVisible
              })}
              shouldStart={this.shouldStart}
              onSelection={this.onSelection}
            />
          ) : null}
        </Document>
      </div>
    );
  }
}

// PdfViewer.childContextTypes = {
//   popupTarget: PropTypes.object,
// };

const StyledPage = styled(Page)`
  position: relative;
  display: block;
  margin: 0 auto;
  background-clip: content-box;
  background-color: ${color.smokeLight};
  box-shadow: 0 0 1px 2px ${color.smokeDark};
  user-select: none;
  -webkit-touch-callout: none;
  transition: all .3s ease;
  width: fit-content;
`;

PdfViewer.propTypes = {
  highlights: PropTypes.array,
};

PdfViewer.defaultProps = {
  highlights: []
};
export default PdfViewer;

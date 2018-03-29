import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'styled-components-grid';
import { color } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';
import { withRouter } from 'react-router-dom';

import PdfViewer, { AreaHighlight, Highlight, Popup, Tip } from 'components/PdfAnnotator';
import ScrollZoom from 'components/ScrollZoom';
import Button from 'components/Button';
import LoadingIndicator from 'components/LoadingIndicator';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import Document from 'scenes/Document';
/* Editor insert annotation */
import { splitAndInsertBlock, insertImageFile } from 'components/Editor/changes';
import { dataURLtoBlob } from 'utils'

import Sidebar from './components/Sidebar';
import Side from './components/Side';


const getNextId = () => String(Math.random()).slice(2);
const HighlightPopup = ({ _fields }) => (_fields.comment ? (
  <div className="Highlight__popup">
    { _fields.comment }
    <p>what stht fucn</p>
  </div>
) : null);

const propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
};

class Pdf extends Component {
  state = {
    scale: 1.13,
    highlights: []
  }

  componentWillMount() {
    this.fetch();
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.fileId !== nextProps.match.params.fileId) {
      this.fetch(nextProps);
    }
  }

  fetch = async (nextProps) => {
    this.props.enableProgressBar();
    const { getFileInfo, getFile, getHighlights, match } = nextProps || this.props;
    const { id: fileId } = match.params;
    await Promise.all([
      getFileInfo(fileId),
      getHighlights(fileId),
      getFile(fileId)
    ]);
  }
  // getChildContext() {   return {     scale: this.state.scale   } }

  zoom(direction) {
    let newValue = 0;
    if (direction === 'in') {
      newValue = Math.round((this.state.scale * 1.1) * 100) / 100;
      newValue = newValue < 1.8 ? newValue : this.state.scale;
    } else {
      newValue = Math.round((this.state.scale * 0.9) * 100) / 100;
      newValue = newValue > 0.8
        ? newValue
        : this.state.scale;
    }
    this.setState({ scale: newValue });
  }

  updateHighlight= (highlightId, selectors) => {
    this.setState({
      highilghts: this.state.highlights.map(h => (h.id === highlightId ? {
        ...h,
        selectors: {
          ...h.selectors,
          ...selectors,
        }
      } : h))
    });
  }

  addHighlight = (highlight) => {
    const { fileId } = this.props.params;
    const { addHighlight } = this.props;
    return addHighlight({
      ...highlight,
      file: fileId
    });
  }
  resetHighlights = () => {
    this.setState({
      highlights: []
    });
  }

  enableAreaSelection = (flag) => {
    this.setState({
      areaSelectionEnabled: flag
    });
  }

  onImageUploadStart = () => { console.log('start...'); }
  onImageUploadStop = () => { console.log('stop...'); }

  insertIntoEditor =(options, ghostHighlight) => {
    console.log('slate highlight', ghostHighlight);
    const selectors = ghostHighlight.selectors;
    const isTextQuote = !!(selectors && selectors.textQuote);
    this.editor.focus();
    if (isTextQuote) {
      this.editor.change((change) => {
        change.call(splitAndInsertBlock, options)
          .insertText(selectors.textQuote.content)
          .collapseToEnd()
          .collapseToEndOfNextBlock();
        return change.focus();
      });
    } else {
      const file = dataURLtoBlob(selectors.image)
      this.editor.change(change => change.call(insertImageFile, file, this.editor, this.onImageUploadStart, this.onImageUploadStop)
      );
    }
  }

  onSelectionFinished = (
    ghostHighlight,
    hideTipAndSelection,
    transformSelection
  ) => (
    <Tip
      onOpen={transformSelection}
      insertIntoEditor={() => this.insertIntoEditor({ type: 'block-quote' }, ghostHighlight)}
      onConfirm={(comment) => {
        this.addHighlight({
          selectors: ghostHighlight.selectors,
          comment
        });
        hideTipAndSelection();
      }}
    />
  )

  onPdfDocumentLoadSuccess = () => {
    this.props.disableProgressBar();
  }

  inputRef = (ref) => {
    console.log('pdf editor', ref);
    this.editor = ref;
  }

  render() {
    const { fileData, highlights } = this.props;
    const { scale, areaSelectionEnabled } = this.state;
    const zoomin = () => {
      this.zoom('in');
    };

    const zoomout = () => {
      this.zoom('out');
    };

    return (
      <StyledContainer align="center" justify="center">

        <Grid.Unit size={{ desktop: 2 / 3, tablet: 2 / 3 }}>
          <ScrollZoom zoomin={zoomin} zoomout={zoomout} >
            <StyledViewer cursor={areaSelectionEnabled ? 1 : 0}>
              <StyledToolbar>
                <Button
                  isSecondary
                  onClick={zoomin}
                  isFullWidth
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                  }}
                >
                  plus
                </Button>
                <Button
                  isSecondary
                  onClick={zoomout}
                  isFullWidth
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                  }}
                >
                  minus
                </Button>
                <Button
                  isSecondary
                  onClick={() => this.enableAreaSelection(true)}
                  isFullWidth
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                  }}
                >
                  crop
                </Button>
              </StyledToolbar>

              <PdfViewer
                loading={
                  <StyledLoadingPlaceholder justify="center" align="center" />
                }
                onPdfDocumentLoadSuccess={this.onPdfDocumentLoadSuccess}
                highlights={highlights}
                file={fileData}
                scale={scale}
                enableAreaSelection={areaSelectionEnabled}
                toggleAreaSelection={this.enableAreaSelection}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenShot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !(highlight.selectors && highlight.selectors.image);
                  const component = isTextHighlight ? (
                    <Highlight highlight={highlight} isScrolledTo={isScrolledTo} />
                  ) : (
                    <AreaHighlight
                      highlight={highlight} onChange={(selectors) => {
                      this.updateHighlight(
                        highlight.id,
                        { selectors: { pdfRectangles: viewportToScaled(selectors), image: screenShot(selectors) } }
                      );
                    }}
                    />
                  );

                  return (<Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={popupContent => setTip(highlight, highlight => popupContent)}
                    onMouseOut={hideTip}
                    key={index}
                    childrenNode={component}
                  />);
                }}
                // 这里按照原先的想法是把区域和文字分开，文字和图片作为内容放到一起
                onSelectionFinished={this.onSelectionFinished}
              />


            </StyledViewer>
          </ScrollZoom>
        </Grid.Unit>


        <Grid.Unit size={{ desktop: 1 / 3, tablet: 1 / 3 }}>
          {/* <Sidebar
            highlights={highlights}
            user={this.props.user}
            resetHighlights={this.resetHighlights}
          /> */}
          <Side inputRef={this.inputRef} />
        </Grid.Unit>

      </StyledContainer>

    );
  }
}

// const styledPage = `
//   position: 'relative',
//   display: 'block',
//   margin: '0 auto',
//   background-clip: 'content-box',
//   background-color: ${color.text},
//   box-shadow: '0 0 1px 2px ${color.textSlate}',
//   user-select: 'none',
//   -webkit-touch-callout: 'none',
//   transition: 'all .3s ease',
//   width: 'fit-content',
// `;

const StyledLoadingPlaceholder = styled(LoadingPlaceholder)`
    height: 100vh;
`;

const StyledContainer = styled(Flex)`
    width: 100%;
    overflow: hidden;
`;
const StyledViewer = styled.div`
  overflow: hidden;
  box-sizing: border-box;
  padding: 0 !important;
  .textLayer {
    div {
      cursor: ${props => (props.cursor ? 'crosshair !important' : 'text')};
    }
  }
    
`;
const StyledToolbar = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  button {
    margin-bottom: 1.2rem;
    display: block;
    width: 20px;
    height: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default withRouter(Pdf);


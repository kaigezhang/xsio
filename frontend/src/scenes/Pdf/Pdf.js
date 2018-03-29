import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from 'styled-components-grid';
import { color } from 'shared/styles/constants';
import Flex from 'shared/components/Flex';
import { withRouter } from 'react-router-dom';

import Actions, { Action, Separator } from 'components/Actions';
import Subheading from 'components/Subheading';
import NewDocumentIcon from 'components/Icon/NewDocumentIcon';
import PdfViewer, { AreaHighlight, Highlight, Popup, Tip } from 'components/PdfAnnotator';
import ScrollZoom from 'components/ScrollZoom';
import LoadingPlaceholder from 'components/LoadingPlaceholder';

import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';


const getNextId = () => String(Math.random()).slice(2);

/* eslint-disable */
const parseIdFromHash = () => location.hash.slice('#highlight-'.length);
const resetHash = () => { location.hash = ''; };
/* eslint-enable */

const HighlightPopup = ({ _fields }) => (_fields.comment ? (
  <StyledPopup>
    { _fields.comment }
  </StyledPopup>
) : null);

const StyledPopup = styled.div`
  background: ${color.smokeDark};
  color: ${color.text};
  padding: 3px 6px;
`;

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

  componentDidMount() {
    window.addEventListener('hashchange', this.scrollToHighlightFromHash, false);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.scrollToHighlightFromHash, false);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.fileId !== nextProps.match.params.fileId) {
      this.fetch(nextProps);
    }
  }

  scrollToHighlightFromHash = () => {
    console.log('hash change')
    const highlight = this.getHighlightById(parseIdFromHash());
    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  }

  scrollViewerTo = (highlight) => {}

  getHighlightById = (id) => {
    const { annotations: highlights } = this.props.file;
    const highlight = highlights.find(highlight => highlight.id === id);
    console.log(highlight, 'get highlight by id');
    return highlight;
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
    const { id: fileId } = this.props.match.params;
    const { addHighlight } = this.props;
    return addHighlight(highlight, fileId);
  }
  enableAreaSelection = (flag) => {
    this.setState({
      areaSelectionEnabled: flag
    });
  }

  onSelectionFinished = (
    ghostHighlight,
    hideTipAndSelection,
    transformSelection
  ) => (
    <Tip
      onOpen={transformSelection}
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
    this.editor = ref;
  }
  generateDocument = () => {

  }
  renderActions= () => (
    <Actions align="center" justify="flex-end" style={{ backgroundColor: 'transparent' }}>
      <Action>
        <a onClick={this.generateDocument}>
          <NewDocumentIcon />
        </a>
      </Action>
    </Actions>
  )

  render() {
    const { fileData, file } = this.props;

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

          <StyledViewer cursor={areaSelectionEnabled ? 1 : 0}>

            <Toolbar
              zoomin={zoomin}
              zoomout={zoomout}
              enableAreaSelection={() => this.enableAreaSelection(true)}
            />
            <ScrollZoom zoomin={zoomin} zoomout={zoomout} >
              <PdfViewer
                loading={
                  <StyledLoadingPlaceholder justify="center" align="center" />
                }
                scrollRef={(scrollTo) => {
                  this.scrollViewerTo = scrollTo;
                  this.scrollToHighlightFromHash();
                }}
                onPdfDocumentLoadSuccess={this.onPdfDocumentLoadSuccess}
                highlights={file.annotations}
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
                      highlight={highlight}
                      onChange={(selectors) => {
                        this.updateHighlight(
                          highlight.id,
                          { selectors: { pdfRectangles: viewportToScaled(selectors), image: screenShot(selectors) } }
                        );
                      }}
                    />
                  );
                  // TODO make this happen
                  return component;
                }}
                // 这里按照原先的想法是把区域和文字分开，文字和图片作为内容放到一起
                onSelectionFinished={this.onSelectionFinished}
              />
            </ScrollZoom>

          </StyledViewer>

        </Grid.Unit>


        <Grid.Unit size={{ desktop: 1 / 3, tablet: 1 / 3 }}>
          <React.Fragment>
            <Sidebar
              file={file}
            />
            { this.renderActions() }
          </React.Fragment>

        </Grid.Unit>

      </StyledContainer>

    );
  }
}


const StyledLoadingPlaceholder = styled(LoadingPlaceholder)`
    height: 100vh;
`;

const StyledContainer = styled(Flex)`
   position:absolute;
   width: 100%;
   height: 100%;
   overflow: hidden;
   box-sizing: border-box;
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


export default withRouter(Pdf);


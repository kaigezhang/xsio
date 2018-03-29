import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PDFJS from 'pdfjs-dist';
import {
  callIfDefined,
  cancelRunningTask,
  errorOnDev,
  makeCancellable,
} from 'utils/pdf/utils';

import { isPage, isRotate } from 'utils/pdf/propTypes';

import './TextLayer.css';


class PageTextLayer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      textContent: null,
    };
    this.renderTextLayer = this.renderTextLayer.bind(this);
  }

  componentDidMount() {
    this.getTextContent();
    // this.renderPageTextLayer()
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.page !== this.context.page) {
      this.getTextContent(nextContext);
    }
  }

  componentWillUnmount() {
    cancelRunningTask(this.runningTask);
  }

    onGetTextSuccess = (textContent) => {
      let _textContent = null;
      if (textContent) {
        _textContent = textContent;
      }

      callIfDefined(
        this.context.onGetTextSuccess,
        _textContent,
      );

      this.setState({ textContent: _textContent });
      callIfDefined(
        this.renderTextLayer,
        this.state.textContent,
      );
    }

    onGetTextError = (error) => {
      if (
        error.name === 'RenderingCancelledException' ||
            error.name === 'PromiseCancelledException'
      ) {
        return;
      }

      errorOnDev(error.message, error);

      callIfDefined(
        this.context.onGetTextError,
        error,
      );

      this.setState({ textContent: false });
    }

    get unrotatedViewport() {
      const { page, scale } = this.context;

      return page.getViewport(scale);
    }

    // get eventProps() {
    //   return makeEventProps(this.context)
    // }

    /**
     * It might happen that the page is rotated by default. In such cases, we shouldn't rotate
     * text content.
     */
    get rotate() {
      const { page, rotate } = this.context;
      return rotate - page.rotate;
    }

    get sideways() {
      const { rotate } = this;
      return rotate % 180 !== 0;
    }

    get defaultSideways() {
      const { rotation } = this.unrotatedViewport;
      return rotation % 180 !== 0;
    }

    getTextContent(context = this.context) {
      const { page } = this.context;
      if (!page) {
        throw new Error('Attempted to load page text content, but no page was specified.');
      }

      if (this.state.textContent !== null) {
        this.setState({ textContent: null });
      }
      this.runningTask = makeCancellable(page.getTextContent());

      // return this.runningTask.promise.then((_textContent) => {
      //   this.renderTextLayer(_textContent)
      // })
      return this.runningTask.promise
        .then(this.onGetTextSuccess)
        .catch(this.onGetTextError);
    }


    async renderTextLayer(_textContent) {
      // const { textContent } = this.state
      const textContent = _textContent;
      const { unrotatedViewport: viewport } = this;

      textContent.innerHTML = '';
      this._textLayer = await PDFJS.renderTextLayer({
        container: this._textLayerDiv,
        textContent,
        viewport,
        enhanceTextSelection: true,
      });
      this._textLayer.expandTextDivs(true);
      this._textLayerDiv.normalize();
    }
    render() {
      const { page } = this.context;
      const { pageNumber } = this.props;
      return (
        <div
          ref={div => (this._textLayerDiv = div)}
          className="textLayer"
          id={`textlayer_${pageNumber}`}
        />
      );
    }
}


PageTextLayer.contextTypes = {
  onGetTextError: PropTypes.func,
  onGetTextSuccess: PropTypes.func,
  page: isPage,
  rotate: isRotate,
  scale: PropTypes.number,
};


export default PageTextLayer;

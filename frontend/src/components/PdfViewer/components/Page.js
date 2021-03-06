import React, { Component } from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'merge-class-names';

import {
  callIfDefined,
  cancelRunningTask,
  errorOnDev,
  isProvided,
  makeCancellable,
  makePageCallback,
} from 'utils/pdf/utils';
import { makeEventProps } from 'utils/pdf/events';
import PageCanvas from '../Page/PageCanvas';
// import PageSVG from './Page/PageSVG';
import TextLayer from '../Page/TextLayer';
import AnnotationLayer from '../Page/AnnotationLayer';


import { eventsProps, isClassName, isLinkService, isPageIndex, isPageNumber, isPage, isPdf, isRotate } from 'utils/pdf/propTypes';

export default class Page extends Component {
  state = {
    page: null,
  }

  componentDidMount() {
    this.loadPage();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (
      nextContext.pdf !== this.context.pdf ||
      this.getPageNumber(nextProps) !== this.getPageNumber()
    ) {
      callIfDefined(
        this.props.unregisterPage,
        this.pageIndex,
      );

      if (this.state.page !== null) {
        this.setState({ page: null });
      }

      this.loadPage(nextProps, nextContext);
    }
  }

  componentWillUnmount() {
    callIfDefined(
      this.props.unregisterPage,
      this.pageIndex,
    );

    cancelRunningTask(this.runningTask);
  }

  getChildContext() {
    if (!this.state.page) {
      return {};
    }

    const context = {
      page: this.state.page,
      rotate: this.rotate,
      scale: this.scale,
    };

    if (this.props.onRenderError) {
      context.onRenderError = this.props.onRenderError;
    }
    if (this.props.onRenderSuccess) {
      context.onRenderSuccess = this.props.onRenderSuccess;
    }
    if (this.props.onGetAnnotationsError) {
      context.onGetAnnotationsError = this.props.onGetAnnotationsError;
    }
    if (this.props.onGetAnnotationsSuccess) {
      context.onGetAnnotationsSuccess = this.props.onGetAnnotationsSuccess;
    }
    if (this.props.onGetTextError) {
      context.onGetTextError = this.props.onGetTextError;
    }
    if (this.props.onGetTextSuccess) {
      context.onGetTextSuccess = this.props.onGetTextSuccess;
    }

    return context;
  }

  /**
   * Called when a page is loaded successfully
   */
  onLoadSuccess = (page) => {
    this.setState({ page }, () => {
      callIfDefined(
        this.props.onLoadSuccess,
        makePageCallback(page, this.scale),
      );

      callIfDefined(
        this.props.registerPage,
        page.pageIndex,
        this.ref,
      );
    });
  }

  /**
   * Called when a page failed to load
   */
  onLoadError = (error) => {
    if (
      error.name === 'RenderingCancelledException' ||
      error.name === 'PromiseCancelledException'
    ) {
      return;
    }

    errorOnDev(error.message, error);

    callIfDefined(
      this.props.onLoadError,
      error,
    );

    this.setState({ page: false });
  }

  getPageIndex(props = this.props) {
    if (isProvided(props.pageNumber)) {
      return props.pageNumber - 1;
    }

    if (isProvided(props.pageIndex)) {
      return props.pageIndex;
    }

    return null;
  }

  getPageNumber(props = this.props) {
    if (isProvided(props.pageNumber)) {
      return props.pageNumber;
    }

    if (isProvided(props.pageIndex)) {
      return props.pageIndex + 1;
    }

    return null;
  }

  get pageIndex() {
    return this.getPageIndex();
  }

  get pageNumber() {
    return this.getPageNumber();
  }

  get rotate() {
    if (isProvided(this.props.rotate)) {
      return this.props.rotate;
    }

    if (isProvided(this.context.rotate)) {
      return this.context.rotate;
    }

    const { page } = this.state;

    return page.rotate;
  }

  get scale() {
    const { scale, width } = this.props;
    const { page } = this.state;

    const { rotate } = this;

    // Be default, we'll render page at 100% * scale width.
    let pageScale = 1;

    // If width is defined, calculate the scale of the page so it could be of desired width.
    if (width) {
      const viewport = page.getViewport(scale, rotate);
      pageScale = width / viewport.width;
    }

    return scale * pageScale;
  }

  get eventProps() {
    return makeEventProps(this.props, () => {
      const { scale } = this;
      const { page } = this.state;
      return makePageCallback(page, scale);
    });
  }

  get pageKey() {
    return `${this.state.page.pageIndex}@${this.scale}/${this.rotate}`;
  }

  get pageKeyNoScale() {
    return `${this.state.page.pageIndex}/${this.rotate}`;
  }

  get pageProps() {
    return {
      page: this.state.page,
      rotate: this.rotate,
      scale: this.scale,
    };
  }

  loadPage(props = this.props, context = this.context) {
    const { pdf } = context;

    if (!pdf) {
      throw new Error('Attempted to load a page, but no document was specified.');
    }

    const pageNumber = this.getPageNumber(props);

    this.runningTask = makeCancellable(pdf.getPage(pageNumber));

    return this.runningTask.promise
      .then(this.onLoadSuccess)
      .catch(this.onLoadError);
  }

  renderTextLayer() {
    const { renderTextLayer } = this.props;

    if (!renderTextLayer) {
      return null;
    }

    return (
      <TextLayer key={`${this.pageKey}_text`} pageNumber={this.pageNumber} />
    );
  }

  renderAnnotations() {
    const { renderAnnotations } = this.props;

    if (!renderAnnotations) {
      return null;
    }

    return (
      <AnnotationLayer key={`${this.pageKey}_annotations`} />
    );
  }


  renderCanvas() {
    return [
      <PageCanvas key={`${this.pageKey}_canvas`} pageNumber={this.pageNumber} />,
      this.renderTextLayer(),
      // this.renderAnnotations(),
    ];
  }

  renderError() {
    return (
      <div className="react-pdf__message react-pdf__message--error">{this.props.error}</div>
    );
  }

  renderLoader() {
    return (
      <div className="react-pdf__message react-pdf__message--loading">{this.props.loading}</div>
    );
  }

  renderChildren() {
    const {
      children,
      // renderMode,
    } = this.props;

    return [
      this.renderCanvas(),
      children,
    ];
  }

  render() {
    const { pdf } = this.context;
    const { className, id } = this.props;
    const { page } = this.state;

    let content;
    if (pdf === null || page === null) {
      content = this.renderLoader();
    } else if (pdf === false || page === false) {
      content = this.renderError();
    } else {
      content = this.renderChildren();
    }

    return (
      <div
        id={id}
        className={mergeClassNames('react-pdf__Page', className)}
        ref={(ref) => {
          const { inputRef } = this.props;
          if (inputRef) {
            inputRef(ref);
          }

          this.ref = ref;
        }}
        style={{ position: 'relative' }}
        data-page-number={this.pageNumber}
        {...this.eventProps}
      >
        {content}
      </div>
    );
  }
}

Page.defaultProps = {
  renderAnnotations: true,
  // renderMode: 'canvas',
  renderTextLayer: true,
  scale: 1.0,
};

Page.childContextTypes = {
  onGetTextError: PropTypes.func,
  onGetTextSuccess: PropTypes.func,
  onRenderError: PropTypes.func,
  onRenderSuccess: PropTypes.func,
  page: isPage,
  rotate: isRotate,
  scale: PropTypes.number,
};

Page.contextTypes = {
  linkService: isLinkService,
  pdf: isPdf,
  registerPage: PropTypes.func,
  rotate: isRotate,
  unregisterPage: PropTypes.func,
};

Page.propTypes = {
  children: PropTypes.node,
  className: isClassName,
  inputRef: PropTypes.func,
  onGetTextError: PropTypes.func,
  onGetTextSuccess: PropTypes.func,
  onLoadError: PropTypes.func,
  onLoadSuccess: PropTypes.func,
  onRenderError: PropTypes.func,
  onRenderSuccess: PropTypes.func,
  pageIndex: isPageIndex,
  pageNumber: isPageNumber,
  renderAnnotations: PropTypes.bool,
  // renderMode: PropTypes.oneOf(['canvas', 'svg']),
  renderTextLayer: PropTypes.bool,
  rotate: isRotate,
  scale: PropTypes.number,
  width: PropTypes.number,
  ...eventsProps(),
};

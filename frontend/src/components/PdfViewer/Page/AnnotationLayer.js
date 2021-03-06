import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PDFJS from 'pdfjs-dist';

import {
  callIfDefined,
  cancelRunningTask,
  errorOnDev,
  makeCancellable,
} from '../../../utils/pdf/utils';

import { isLinkService, isPage, isRotate } from '../../../utils/pdf/propTypes';

// import style from './AnnotationLayer.scss'

export default class AnnotationLayer extends Component {
  state = {
    annotations: null,
  }

  componentDidMount() {
    this.getAnnotations();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.page !== this.context.page) {
      this.getAnnotations(nextContext);
    }
  }

  componentWillUnmount() {
    cancelRunningTask(this.runningTask);
  }

  onGetAnnotationsSuccess = (annotations) => {
    callIfDefined(
      this.context.onGetAnnotationsSuccess,
      annotations,
    );

    this.setState({ annotations });
  }

  onGetAnnotationsError = (error) => {
    if (
      error.name === 'RenderingCancelledException' ||
      error.name === 'PromiseCancelledException'
    ) {
      return;
    }

    errorOnDev(error.message, error);

    callIfDefined(
      this.context.onGetAnnotationsError,
      error,
    );

    this.setState({ annotations: false });
  }

  get viewport() {
    const { page, rotate, scale } = this.context;

    return page.getViewport(scale, rotate);
  }

  getAnnotations(context = this.context) {
    const { page } = context;

    if (!page) {
      throw new Error('Attempted to load page text content, but no page was specified.');
    }

    if (this.state.annotations !== null) {
      this.setState({ annotations: null });
    }

    this.runningTask = makeCancellable(page.getAnnotations());

    return this.runningTask.promise
      .then(this.onGetAnnotationsSuccess)
      .catch(this.onGetAnnotationsError);
  }

  renderAnnotations() {
    const { annotations } = this.state;

    if (!annotations) {
      return;
    }

    const { linkService, page } = this.context;
    const viewport = this.viewport.clone({ dontFlip: true });

    const parameters = {
      annotations,
      div: this.annotationLayer,
      linkService,
      page,
      viewport,
    };

    try {
      PDFJS.AnnotationLayer.render(parameters);
    } catch (error) {
      errorOnDev(error.message, error);
    }
  }

  render() {
    return (
      <div
        className="react-pdf__Page__annotations annotationLayer"
        ref={(ref) => { this.annotationLayer = ref; }}
      >
        {this.renderAnnotations()}
      </div>
    );
  }
}

AnnotationLayer.contextTypes = {
  linkService: isLinkService,
  onGetAnnotationsError: PropTypes.func,
  onGetAnnotationsSuccess: PropTypes.func,
  page: isPage,
  rotate: isRotate,
};

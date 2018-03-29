// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

const propTypes = {
  text: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  onCopy: PropTypes.func,
};


const __DEV__ = JSON.stringify(JSON.parse(process.env.NODE_ENV !== 'production')); //eslint-disable-line

class CopyToClipboard extends PureComponent {
  onClick = (ev) => {
    const { text, onCopy, children } = this.props;
    const elem = React.Children.only(children);
    copy(text, {
      debug: __DEV__,
    });

    if (onCopy) onCopy();

    if (elem && elem.props && typeof elem.props.onClick === 'function') {
      elem.props.onClick(ev);
    }
  };

  render() {
    const { text: _text, onCopy: _onCopy, children, ...rest } = this.props;
    const elem = React.Children.only(children);
    return React.cloneElement(elem, { ...rest, onClick: this.onClick });
  }
}

export default CopyToClipboard;

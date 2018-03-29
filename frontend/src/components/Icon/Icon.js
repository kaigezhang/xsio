// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { color } from 'shared/styles/constants';


const propTypes = {
  className: PropTypes.string,
  light: PropTypes.bool,
  black: PropTypes.bool,
  primary: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func,
  children: PropTypes.node,
};


export default function Icon({
  children,
  viewBox,
  className,
  onClick,
  ...rest
}) {
  const size = rest.size ? `${rest.size}px` : '24px';

  let fill = color.slateDark;
  if (rest.color) fill = rest.color;
  if (rest.light) fill = color.white;
  if (rest.black) fill = color.black;
  if (rest.primary) fill = color.primary;
  const scaleViewBox = viewBox || '0 0 24 24';

  return (
    <svg
      fill={fill}
      width={size}
      height={size}
      viewBox={scaleViewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      {children}
    </svg>
  );
}

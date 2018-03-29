// @flow
import React from 'react';
import Icon from './Icon';

export default function TrashIcon(props) {
  return (
    <Icon {...props}>
      <path
        d="M10,6 L10,5 L10,5 C10,4.44771525 10.4477153,4 11,4 L13,4 C13.5522847,4 14,4.44771525 14,5 L14,6 L18,6 C18.5522847,6 19,6.44771525 19,7 C19,7.55228475 18.5522847,8 18,8 L17.8571429,8 L17.132679,18.1424941 C17.0579211,19.1891049 16.1870389,20 15.1377616,20 L8.86223841,20 C7.81296107,20 6.94207892,19.1891049 6.86732101,18.1424941 L6.14285714,8 L6,8 C5.44771525,8 5,7.55228475 5,7 C5,6.44771525 5.44771525,6 6,6 L6,6 L10,6 Z M8.86223841,18 L15.1377616,18 L15.8520473,8 L8.14795269,8 L8.86223841,18 Z" />
    </Icon>
  );
}

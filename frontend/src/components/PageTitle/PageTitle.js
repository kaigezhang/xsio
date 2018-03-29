import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const propTypes = {
  title: PropTypes.string,
};


const PageTitle = ({ title }) => (
  <Helmet>
    <title>{`${title} - Xueshu` }</title>
  </Helmet>
);

export default PageTitle
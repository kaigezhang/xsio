import { connect } from 'react-redux';

import { collectionsSelector } from 'store/selectors/collections';
import { uiSelector } from 'store/selectors/ui';
import { prefetchDocument } from 'store/actions/documents';

import Collections from './Collections';


// const mapState = state => ({
//   collections: collectionsSelector(state),
//   ui: uiSelector(state),
// });

const mapState = (state) => {
  const collections = collectionsSelector(state);

  const ui = uiSelector(state);
  return {
    collections, ui
  };
};

const mapDispatch = dispatch => ({
  prefetchDocument: () => dispatch(prefetchDocument())
});


export default connect(mapState, mapDispatch)(Collections);

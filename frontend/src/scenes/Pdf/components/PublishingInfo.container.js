import { connect } from 'react-redux';

import { highlightSelector } from 'store/selectors/file';
import PublishingInfo from './PublishingInfo';

const mapState = (state, { highlight }) => ({
  highlight: highlightSelector(state, highlight)
});


export default connect(mapState)(PublishingInfo);

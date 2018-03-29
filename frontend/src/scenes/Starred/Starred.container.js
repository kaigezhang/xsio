import { connect } from 'react-redux';
import { getStarredDocuments } from 'store/actions/documents';
import { starredSelector } from 'store/selectors/documents';
import { statusSelector } from 'store/selectors/status';
import Starred from './Starred';


const mapState = state => ({
  starred: starredSelector(state),
  status: statusSelector(state),
});


const mapDispatch = dispatch => ({
  fetchStarredDocuments: () => dispatch(getStarredDocuments())
});


export default connect(mapState, mapDispatch)(Starred);

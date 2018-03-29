import { connect } from 'react-redux';
import { getDraftsDocuments } from 'store/actions/documents';
import { draftsSelector } from 'store/selectors/documents';
import { statusSelector } from 'store/selectors/status';
import Drafts from './Drafts';


const mapState = state => ({
  drafts: draftsSelector(state),
  status: statusSelector(state),
});


const mapDispatch = dispatch => ({
  getDraftsDocuments: () => dispatch(getDraftsDocuments())
});


export default connect(mapState, mapDispatch)(Drafts);

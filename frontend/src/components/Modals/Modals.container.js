import { connect } from 'react-redux';
import { clearActiveModal } from 'store/actions/ui';
import { uiSelector } from 'store/selectors/ui';
import Modals from './Modals';


const mapState = state => ({
  ui: uiSelector(state)
});

const mapDispatch = dispatch => ({
  clearActiveModal: () => dispatch(clearActiveModal())
});

export default connect(mapState, mapDispatch)(Modals);

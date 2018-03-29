import { connect } from 'react-redux';
import { uiSelector } from 'store/selectors/ui';
import { userSelector } from 'store/selectors/shared/auth';
import { setActiveModal } from 'store/actions/ui';
import Main from './Main';

const mapState = state => ({
  ui: uiSelector(state),
  user: userSelector(state),
});

const mapDispatch = dispatch => ({
  setActiveModal: (name, props) => dispatch(setActiveModal(name, props))
});

export default connect(mapState, mapDispatch)(Main);

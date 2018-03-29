import { connect } from 'react-redux';
import { userSelector } from 'store/selectors/shared/auth';
import Settings from './Settings';

const mapState = state => ({
  user: userSelector(state),
});

// const mapDispatch = dispatch => ({
//   setActiveModal: (name, props) => dispatch(setActiveModal(name, props))
// });

export default connect(mapState)(Settings);

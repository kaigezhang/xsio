import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { uiSelector } from 'store/selectors/ui';
import { toggleMobileSidebar, hideMobileSidebar } from 'store/actions/ui';
import Sidebar from './Sidebar';

const mapState = state => ({
  ui: uiSelector(state)
});

const mapDispatch = dispatch => ({
  hideMobileSidebar: () => dispatch(hideMobileSidebar()),
  toggleMobileSidebar: () => dispatch(toggleMobileSidebar())
});

export default connect(mapState, mapDispatch)(Sidebar);

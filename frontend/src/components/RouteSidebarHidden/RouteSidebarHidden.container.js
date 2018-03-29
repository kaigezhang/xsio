import { connect } from 'react-redux';
import { enableEditMode, disableEditMode } from 'store/actions/ui';
import RouteSidebarHidden from './RouteSidebarHidden';

const mapDispatch = dispatch => ({
  enableEditMode: () => dispatch(enableEditMode()),
  disableEditMode: () => dispatch(disableEditMode()),
});


export default connect(null, mapDispatch)(RouteSidebarHidden);

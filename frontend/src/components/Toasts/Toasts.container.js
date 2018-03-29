import { connect } from 'react-redux';
import { errorsSelector  } from 'store/selectors/errors';
import Toasts from './Toasts';


const mapState = state => ({
  errors: errorsSelector(state)
});


export default connect(mapState)(Toasts);

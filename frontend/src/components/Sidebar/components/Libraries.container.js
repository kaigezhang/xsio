import { connect } from 'react-redux';
import { librariesSelector } from 'store/selectors/files';
import Libraries from './Libraries';

const mapState = state => ({
  libraries: librariesSelector(state)
});

export default connect(mapState)(Libraries);

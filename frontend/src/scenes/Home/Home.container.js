import { connect } from 'react-redux';
import { authSelector } from 'store/selectors/shared/auth';

import Home from './Home';

const mapState = state => ({ auth: authSelector(state) });

export default connect(mapState)(Home)

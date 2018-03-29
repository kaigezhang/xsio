import { connect } from 'react-redux';
import {
  starFile,
  unstarFile,
  pinFile,
  unpinFile,
  downloadFile
} from 'store/actions/file';
import FileMenu from './FileMenu';


const mapDispatch = dispatch => ({
  starFile: fileId => starFile(fileId),
  unstarFile: fileId => unstarFile(fileId),
  pinFile: fileId => pinFile(fileId),
  unpinFile: fileId => unpinFile(fileId),
  downloadFile: File => downloadFile(File),
});


export default connect(null, mapDispatch)(FileMenu);

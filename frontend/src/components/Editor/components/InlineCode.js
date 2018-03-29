import styled from 'styled-components';
import { color } from 'shared/styles/constants';

const InlineCode = styled.code.attrs({
  spellcheck: false,
})`
  padding: .25em;
  background: ${color.smoke};
  border-radius: 4px;
  border: 1px solid ${color.strokeDark};
`;

export default InlineCode;

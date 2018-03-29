import React, { Component } from 'react';
import Button from 'components/Button';
import Input from 'components/Input';
import AnnotatorIcon from 'components/Icon/AnnotatorIcon';
import SubmitIcon from 'components/Icon/SubmitIcon';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';

class Tip extends Component {
  state = {
    compact: true,
    text: ''
  }
  // for tip contianer
  componentDidUpdate(nextProps, nextState) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen } = this.props;
    const { compact, text } = this.state;
    return (
      <StyledTip>
        { compact ? (
          <Button
            icon={<AnnotatorIcon light viewBox="0 0 1024 1024" />}
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
            }}
          />
        ) : (
          <StyledCard>
            <Input
              type="textarea"
              placeholder="Drop some idea"
              value={text}
              onChange={e => this.setState({ text: e.target.value })}
              ref={(node) => {
                if (node) {
                  node.focus();
                }
              }}
            />
            {/* <input type="submit" value="Save" /> */}
            <StyledButton
              light
              icon={<SubmitIcon primary viewBox="0 0 1024 1024" size="24" />}
              onClick={(e) => {
                e.preventDefault();
                onConfirm(text);
              }}
            />
          </StyledCard>
        ) }
      </StyledTip>
    );
  }
}

const StyledTip = styled.div`
    
`;

const StyledButton = styled(Button)`
  margin-top: -10px;
  width: 100%;
`
const StyledCompact = styled.div`
  cursor: pointer;
  background-color: #3d464d;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
`;

const StyledCard = styled.div`
  padding: 3px 6px;
  background: ${color.smoke};
  background-clip: padding-box;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(37, 40, 43, 0.2);
  textarea {
    padding: 5px;
    font-size: 16px;
    width: 240px;
    height: 154px;
    overflow-y: hidden;
    background: ${color.smokeLight};
    color: ${color.text};
    outline: none;
    border: none;
  }
`;
export default Tip;

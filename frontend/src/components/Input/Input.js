// @flow
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Flex from 'shared/components/Flex';
import { size, color } from 'shared/styles/constants';
import { propTypes } from 'redux-form';

const RealTextarea = styled.textarea`
  border: 0;
  flex: 1;
  padding: 8px 12px;
  outline: none;
  background: none;

  &:disabled,
  &::placeholder {
    color: ${color.slate};
  }
`;

const RealInput = styled.input`
  border: 0;
  flex: 1;
  padding: 8px 12px;
  outline: none;
  background: none;

  &:disabled,
  &::placeholder {
    color: ${color.slate};
  }
`;

const Wrapper = styled.div``;

export const Outline = styled(Flex)`
  display: flex;
  flex: 1;
  margin: 0 0 ${size.large};
  color: inherit;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => (props.hasError ? 'red' : color.slateLight)};
  border-radius: 4px;
  font-weight: normal;

  &:focus {
    border-color: ${color.slate};
  }
`;

export const LabelText = styled.div`
  font-weight: 500;
  padding-bottom: 4px;
`;


const formPropTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
};

const Input = ({
  type = 'text',
  label,
  className,
  ...rest
}) => {
  const InputComponent = type === 'textarea' ? RealTextarea : RealInput;
  // console.log(InputComponent, 'inputComponent')
  /* eslint-disable */
  return (
    <Wrapper className={className}>
      <label>
        {label && <LabelText>{label}</LabelText>}
        <Outline>
          <InputComponent type={type} {...rest} />
        </Outline>
      </label>
    </Wrapper>
  );
  /* eslint-enable */
};

const authFormProps = {
  type: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  hasError: PropTypes.bool,
};

export const AuthInput = ({
  input,
  type = 'text',
  label,
  className,
  hasError
}) => {
  const InputComponent = type === 'textarea' ? RealTextarea : RealInput;
  // console.log(InputComponent, 'inputComponent')
  /* eslint-disable */
  return (
    <Wrapper className={className}>
      <label>
        {label && <LabelText>{label}</LabelText>}
        <Outline hasError={hasError} >
          <InputComponent {...input} type={type} />
        </Outline>
      </label>
    </Wrapper>
  );
  /* eslint-enable */
};

AuthInput.propsTypes = authFormProps;
AuthInput.defaultProps = {
  ...propTypes.input,
  type: 'text',
  autoFocus: false,
  hasError: false
};

Input.propTypes = formPropTypes;
export default Input;

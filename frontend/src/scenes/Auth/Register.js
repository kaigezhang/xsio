import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import { Redirect } from 'react-router-dom';
import Button from 'components/Button';
import { AuthInput } from 'components/Input';
import HelpText from 'components/HelpText';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';
import Alert from 'components/Alert';

import { Field, propTypes, reduxForm } from 'redux-form';

const formPropTypes = {
  ...propTypes,
  history: PropTypes.object,
  registerUser: PropTypes.func,
  clearError: PropTypes.func,
  auth: PropTypes.object,
  logout: PropTypes.func,
  // auth: {
  //   error: PropTypes.shape({
  //     code: PropTypes.string,
  //     title: PropTypes.string,
  //   })
  // }
};

class Registration extends Component {
  componentWillMount() {
    this.props.clearError();
  }

  componentWillUnmount() {
    this.props.clearError();
  }
  onSubmit = formData => this.props.registerUser(formData)

  errorMessage() {
    const { auth: { error } } = this.props;
    if (!error) {
      return null;
    }

    const errorMessage = error.detail;

    return (
      <Alert type="danger">
        <span style={{ padding: '6px 0' }}>{errorMessage}</span>
      </Alert>
    );
  }
  render() {
    const { handleSubmit, submitting, auth, logout } = this.props;
    const isAuthenticating = submitting;
    if (auth.user && auth.isAuthenticated) return <Redirect to="/dashboard" />;
    logout();
    return (
      <CenteredContent justify="center" auto>
        <PageTitle title="Login" />
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <HelpText>
            请使用邮箱和密码注册, 已有账号, <StyledButton href="/login">去登陆</StyledButton>
          </HelpText>
          { this.errorMessage() }
          <Field
            component={AuthInput}
            disabled={isAuthenticating}
            name="username"
            label="用户名"
            required
          />
          <Field
            component={AuthInput}
            disabled={isAuthenticating}
            name="email"
            label="邮箱"
            required
          />
          <Field
            component={AuthInput}
            disabled={isAuthenticating}
            name="password"
            type="password"
            label="密码"
            required
          />
          <Field
            component={AuthInput}
            disabled={isAuthenticating}
            name="passwordConfirmation"
            type="password"
            label="密码确认"
            required
          />
          <Button type="submit" disabled={isAuthenticating}>
            { isAuthenticating ? '注册中...' : '注册'}
          </Button>
        </form>
      </CenteredContent>

    );
  }
}

const StyledButton = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  color: ${color.black};
  background: ${props => props.color || color.smokeDark};
  border-radius: 4px;
  font-weight: 600;
`;

Registration.propTypes = formPropTypes;
// Login.defaultProps = defaultProps;
// Login.contextTypes = {
//   t: PropTypes.func.isRequired,
// };

const validate = (values) => {
  const errors = {};
  const { username, email, password, passwordConfirmation } = values;

  ['username', 'email', 'password', 'passwordConfirmation'].forEach((key) => {
    if (!values[key]) {
      errors[key] = '必填';
    }
  });
  if (email && !email.match(/\S+@\S+\.\S+/)) {
    errors.email = '非法邮箱';
  }
  if (password && password.length < 8) {
    errors.password = '不小于8位';
  }
  if (password !== passwordConfirmation) {
    errors.passwordConfirmation = '两次输入不相同';
  }
  return errors;
};

export default reduxForm({
  form: 'registration',
  validate
})(Registration);

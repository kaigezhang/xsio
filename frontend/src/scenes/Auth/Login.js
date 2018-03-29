import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import { Redirect } from 'react-router-dom';
import { AuthInput } from 'components/Input';
import Button from 'components/Button';
import HelpText from 'components/HelpText';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';
import Alert from 'components/Alert';

import { Field, propTypes, reduxForm } from 'redux-form';
import { translatedFormError } from 'utils/translations';

const formPropTypes = {
  ...propTypes,
  history: PropTypes.object,
  loginUser: PropTypes.func,
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

class Login extends PureComponent {
  componentWillMount() {
    this.props.clearError();
  }

  componentWillUnmount() {
    this.props.clearError();
  }
  onSubmit = formData => this.props.loginUser(formData)

  errorMessage() {
    const { auth: { error } } = this.props;
    console.log(error, 'error');
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
            还没有账号?  <StyledButton href="/register">去注册</StyledButton>
          </HelpText>
          { this.errorMessage() }
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
          <Button type="submit" disabled={isAuthenticating}>
            { isAuthenticating ? 'Loging...' : 'Login'}
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

Login.propTypes = formPropTypes;
// Login.defaultProps = defaultProps;
// Login.contextTypes = {
//   t: PropTypes.func.isRequired,
// };

const validate = (values) => {
  const errors = {};
  const email = values.email;
  const password = values.password;


  if (!email) {
    errors.email = translatedFormError('required');
  } else if (!email.match(/\S+@\S+\.\S+/)) {
    errors.email = translatedFormError('notAnEmail');
  }
  if (!password) {
    errors.password = translatedFormError('required');
  }
  return errors;
};

export default reduxForm({
  form: 'login',
  validate
})(Login);

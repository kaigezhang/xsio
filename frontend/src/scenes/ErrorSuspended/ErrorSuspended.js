// @flow
import React from 'react';

import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';

const ErrorSuspended = (({ auth }) => (
  <CenteredContent>
    <PageTitle title="Your account has been suspended" />
    <h1>
      <span role="img" aria-label="Warning sign">
        ⚠️
      </span>{' '}
      Your account has been suspended
    </h1>

    <p>
      A team admin (<strong>{auth.suspendedContactEmail}</strong>) has suspended your
      account. To re-activate your account, please reach out to them directly.
    </p>
  </CenteredContent>
));

export default ErrorSuspended;

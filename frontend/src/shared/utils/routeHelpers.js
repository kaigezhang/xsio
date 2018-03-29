// @flow

export function slackAuth(state, scopes = [
  'identity.email', 'identity.basic', 'identity.avatar', 'identity.team'
], redirectUri = `${process.env.URL}/auth/slack`) {
  const baseUrl = 'https://slack.com/oauth/authorize';
  const params = {
    client_id: process.env.SLACK_KEY,
    scope: scopes
      ? scopes.join(' ')
      : '',
    redirect_uri: redirectUri,
    state
  };

  const urlParams = Object
    .keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  return `${baseUrl}?${urlParams}`;
}

export function githubUrl() { return 'https://www.github.com/outline'; }

export function githubIssuesUrl() { return 'https://www.github.com/outline/outline/issues'; }

export function blogUrl() { return 'https://medium.com/getoutline'; }

export function twitterUrl() { return 'https://twitter.com/outlinewiki'; }

export function spectrumUrl() { return 'https://spectrum.chat/outline'; }

export function mailToUrl() { return 'mailto:hello@getoutline.com'; }

export function developers() { return '/developers'; }

export function changelog() { return '/changelog'; }

export function signin() { return '/login'; }

export function signup() { return '/register'; }

export function about() { return '/about'; }

export function privacy() { return '/privacy'; }

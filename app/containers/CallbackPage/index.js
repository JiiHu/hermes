/*
 * CallbackPage
 *
 * callback from spotify
 */
import React from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import A from 'components/A';
import messages from './messages';
import List from './List';
import ListItem from './ListItem';
import ListItemTitle from './ListItemTitle';

export default class CallbackPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null
    };
  }

  saveAuthCode() {
    let hash = window.location.hash.substring(1);
    let result = hash.split('&').reduce(function (result, item) {
      let parts = item.split('=');
      result[parts[0]] = parts[1];
      return result;
    }, {});

    let code = result.access_token;

    if (code != null) {
      localStorage.setItem('authCode', code);
      this.setState({code});
    }
  }

  componentDidMount() {
    this.saveAuthCode();
  }

  render() {

    if (this.state.code) {
      return ( <Redirect to='/'/> );
    }

    return (
      <div style={{textAlign: 'center'}}>
        <H1 style={{textAlign: 'center'}}>
          Something went wrong 😔
        </H1>
        <A href={"/"}>Try again</A>
      </div>
    );
  }
}

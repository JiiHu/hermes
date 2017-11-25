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
import messages from './messages';
import List from './List';
import ListItem from './ListItem';
import ListItemTitle from './ListItemTitle';

import queryString from 'query-string';

export default class CallbackPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null
    };
  }

  saveAuthCode() {
    let params = queryString.parse(this.props.location.search);
    let code = params.code;

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
      <H1 style={{textAlign: 'center'}}>
        Something went wrong 😔
      </H1>
    );
  }
}

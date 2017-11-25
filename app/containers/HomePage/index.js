/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import H1 from 'components/H1';
import H2 from 'components/H2';
import A from 'components/A';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';
import spotifyApi from '../../constants/Spotify';

export class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      code: null
    };
  }

  loadAuthCode() {
    let localCode = localStorage.getItem('authCode');
    if (localCode) {
      this.setState({code: localCode});
    }
  }

  componentDidMount() {
    this.loadAuthCode();
  }

  authorized() {
    return(
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <div>
          <CenteredSection>
            <H2>fukin mint</H2>
          </CenteredSection>
        </div>
      </article>
    );
  }

  noAuthorization() {

    let scopes = ['user-read-private', 'user-read-email'];
    let state = 'meme-state';
    let authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

    return(
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <div>
          <CenteredSection>
            <H2>Jes jes jes</H2>
            <p>
              <FormattedMessage {...messages.startProjectMessage} />
            </p>
          </CenteredSection>
          <CenteredSection>
            <H2>
              Login to Spotify
            </H2>
            <A href={authorizeURL}>
              Login now
            </A>

          </CenteredSection>
        </div>
      </article>
    );
  }

  render() {
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };

    return (
      this.state.code ?
        this.authorized()
      :
        this.noAuthorization()
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  repos: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
};



const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
)(HomePage);

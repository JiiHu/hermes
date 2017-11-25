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
    this.spotify = spotifyApi;
    this.state = {
      code: null
    };
    this.topFeatures = [];
    this.topTracks = [];
  }

  authorizeSpotify() {
    let localCode = localStorage.getItem('authCode');

    if (localCode != null) {
      this.setState({code: localCode});
      this.spotify.setAccessToken(localCode);
    }
  }

  resetAuthorization() {
    localStorage.removeItem("authCode");
    this.setState({code: null});
  }

  componentDidMount() {
    this.authorizeSpotify();

    let _me = this;

    this.spotify.getMyTopTracks({limit: 100})
      .then(function(data) {
        _me.topTracks = data.body.items;

        _me.analysisForTopTracks();
      }, function(err) {
        _me.resetAuthorization();
        console.error(err);
      });
  }

  analyzePlaylists() {
    let playlists = [];
    let playlistIds = Object.keys(playlists);

    let _me = this;

    playlistIds.map(id => (
      this.spotify.getPlaylistTracks('spotifycharts', id)
        .then(function(data) {

          var trackIds = data.body.items.map(item => (
            item.track.id
          ));

        }, function(err) {
          _me.resetAuthorization();
        })
    ));
  }

  analysisForTopTracks() {
    let trackIds = this.topTracks.map(track => (
      track.id
    ));

    let _me = this;

    this.spotify.getAudioFeaturesForTracks(trackIds)
      .then(function(data) {

        let features = {
          valence: 0,
          tempo: 0,
          acousticness: 0,
          energy: 0,
          danceability: 0,
          liveness: 0,
          speechiness: 0,
          mode: 0,
          key: 0,
        };

        data.body.audio_features.map(track => (
          Object.keys(features).map(key => (
            features[key] += track[key]
          ))
        ));

        let trackCount = data.body.audio_features.length;
        Object.keys(features).map(key => (
          features[key] = parseInt(features[key] / trackCount * 1000.0) / 1000.0
        ))

        _me.topFeatures = features;

      }, function(err) {
        _me.resetAuthorization();
      });
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
            <H2>What you are based on your music taste</H2>
          </CenteredSection>
        </div>
      </article>
    );
  }

  noAuthorization() {

    let scopes = ['playlist-read-private', 'playlist-read-collaborative', 'user-library-read', 'user-read-private', 'user-read-birthdate', 'user-read-email', 'user-follow-read', 'user-read-playback-state', 'user-read-recently-played', 'user-read-currently-playing', 'user-top-read'];
    let state = 'meme-state';
    let authorizeURL = this.spotify.createAuthorizeURL(scopes, state);

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

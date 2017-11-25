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
import H3 from 'components/H3';
import A from 'components/A';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import ResultSection from './ResultSection';
import ResultContainer from './ResultContainer';
import CompYou from './CompYou';
import CompValue from './CompValue';
import CompCountry from './CompCountry';
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
import countryPlaylists from '../../constants/countryPlaylists';
import analyzedCountryPlaylists from '../../constants/analyzedCountryPlaylists';

import Result from './Result';

export class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.spotify = spotifyApi;
    this.state = {
      code: null,
      closest: null,
      furthest: null
    };
    this.topFeatures = [];
    this.topTracks = [];
    //this.countries = countryPlaylists;
    this.countries = analyzedCountryPlaylists;
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

  printDevCountryJson() {
    // see if all countries are analyzed
    let amount = Object.values(this.countries).map(item => (
      item.meanFeatures ? true : false
    )).filter(v => v).length;

    if (amount != Object.keys(this.countries).length) return;

    // print the JSON to save locally
    console.log( JSON.stringify(this.countries)  );
  }

  // smaller value = closer
  calculateCloseness(countryFeatures) {
    let total = 0;

    Object.keys(countryFeatures).map(key => (
      total += Math.abs(
        this.topFeatures[key] - countryFeatures[key]
      )
    ));

    return (
      Math.round(total / Object.keys(countryFeatures).length * 100) / 100
    )
  }

  findClosest() {
    // calculate for each country that how close they are to user
    Object.keys(this.countries).map(id => (
      this.countries[id]["closeness"] = this.calculateCloseness( this.countries[id]["meanFeatures"] )
    ));

    let closest = Object.values(this.countries).sort(function(a, b) {
      return a["closeness"] - b["closeness"];
    })[0];

    let furthest = Object.values(this.countries).sort(function(a, b) {
      return b["closeness"] - a["closeness"];
    })[0];

    this.setState({closest: closest});
    this.setState({furthest: furthest});
  }

  // analyze all countries. only needed to run on dev env.
  analyzePlaylists() {
    let playlistIds = Object.keys(this.countries);

    let _me = this;

    playlistIds.map(id => (
      this.spotify.getPlaylistTracks('spotifycharts', id)
        .then(function(data) {

          var trackIds = data.body.items.map(item => (
            item.track.id
          ));
          _me.countries[id]["trackIds"] = trackIds;

          _me.spotify.getAudioFeaturesForTracks(trackIds)
            .then(function(data) {
              _me.countries[id]["meanFeatures"] = _me.analyseFeatures({}, data.body.audio_features);

              let amount = Object.values(_me.countries).map(item => (
                item.meanFeatures ? true : false
              )).filter(v => v).length;

              if (amount == Object.keys(_me.countries).length) {
                _me.findClosest();
              }

              //_me.printDevCountryJson()
            }, function(err) {
              _me.resetAuthorization();
            });

        }, function(err) {
          _me.resetAuthorization();
        })
    ));
  }

  analyseFeatures(features, audio_features) {
    features = {
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

    audio_features.map(track => (
      Object.keys(features).map(key => (
        track != null ?
          features[key] += track[key]
        : null
      ))
    ));

    let trackCount = audio_features.length;
    Object.keys(features).map(key => (
      features[key] = parseInt(features[key] / trackCount * 1000.0) / 1000.0
    ))

    return features;
  }

  analysisForTopTracks() {
    let trackIds = this.topTracks.map(track => (
      track.id
    ));

    let _me = this;

    this.spotify.getAudioFeaturesForTracks(trackIds)
      .then(function(data) {
        _me.topFeatures = _me.analyseFeatures({}, data.body.audio_features);
        _me.findClosest();

      }, function(err) {
        _me.resetAuthorization();
      });

    // analyze all countries
    // this.analyzePlaylists();
  }

  visualizedPercentage(user, country) {
    let value = Math.round( (1 - (user/country)) * 100);

    if (value >= 0) value = " " + value;

    return(
      <div style={{fontSize: "20px"}}>
        { value + " %" }
      </div>
    )
  }

  authorized() {
    return(
      <article>
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <ResultContainer>
          <ResultSection>
            { this.state.closest ?
              <div>
                <H3>You are closest to</H3>
                <H2>{ this.state.closest.name }</H2>
              </div>
              :
              null
            }
          </ResultSection>
          <ResultSection>
            { this.state.furthest ?
              <div>
                <H3>You are furthest from</H3>
                <H2>{ this.state.furthest.name }</H2>
              </div>
              :
              null
            }
          </ResultSection>
        </ResultContainer>
        <p style={{textAlign: 'center', color: '#aaa'}}>{"Percentages below mean the difference of your top tracks compared to country's current top tracks' features."}</p>
        <div>
          { this.state.furthest ?
            <div>
              <div style={{textAlign: "center"}}>
                { Object.keys(this.state.furthest.meanFeatures).map(id =>
                    <div style={{marginBottom: "10px"}} key={"furthest-"+id}>
                      <CompYou>
                        { this.visualizedPercentage(this.topFeatures[id], this.state.closest.meanFeatures[id]) }
                      </CompYou>
                      <CompValue> { id } </CompValue>
                      <CompCountry>
                        { this.visualizedPercentage(this.topFeatures[id], this.state.furthest.meanFeatures[id]) }
                      </CompCountry>
                    </div>
                )}
              </div>
            </div>
            :
            null
          }
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

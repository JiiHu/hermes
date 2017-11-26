import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    background: #fafafa;
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 30px 0;
  }

  body.fontLoaded {
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  h1 {
    font-size: 60px;
  }

  h2 {
    font-size: 42px;
    line-height: 1.2;
    margin-bottom: 5px;
    margin-top: 5px;
  }

  h3 {
    color: #aaa;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 5px;
  }

  p,
  label {
    line-height: 1.5em;
  }

  .album {
    border-radius: 5px;
    display: block;
    margin: 20px auto 0;
    max-width: 150px;
  }

  @media (max-width: 767px) {
    h1 {
      font-size: 42px;
      font-size: 2.5rem;
    }

    h2 {
      font-size: 32px;
    }
  }
`;

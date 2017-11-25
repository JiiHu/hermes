/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';

const A = styled.a`
  background: #1db954;
  border-radius: 40px;
  color: #fff;
  display: inline-block;
  font-size: 16px;
  margin-top: 20px;
  padding: 15px 50px;
  text-decoration: none;
  transition: all 0.15s ease-in-out;

  &:focus,
  &:hover {
    background: #1ed760;
    text-decoration: none;
    transition: all 0.15s ease-in-out;
  }
`;

export default A;

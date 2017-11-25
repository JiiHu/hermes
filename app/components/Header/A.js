import NormalA from 'components/A';

const A = NormalA.extend`
  background: #1db954;
  border-radius: 40px;
  color: #fff;
  padding: 10px 30px;

  &:focus,
  &:hover {
    background: #1ed760;
  }
`;

export default A;

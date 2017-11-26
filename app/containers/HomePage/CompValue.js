import Comp from './Comp';

const CompValue = Comp.extend`
  font-size: 22px;
  font-weight: bold;
  width: 45%;

  @media (max-width: 767px) {
    font-size: 18px;
  }
`;

export default CompValue;

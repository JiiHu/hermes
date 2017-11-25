
import React from 'react';
import PropTypes from 'prop-types';

function Result(props) {
  return (
    <div className="Result">
      { props.element.name }
    </div>
  );
}

export default Result;

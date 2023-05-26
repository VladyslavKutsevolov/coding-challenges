import React from "react";
import PropTypes from "prop-types";

const Loader = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="loader text-center text-white sticky">
        Loading users...
      </div>
    );
  }
};

Loader.propTypes = {
  /** trigger loader default: false */
  isLoading: PropTypes.bool.isRequired,
};

export default Loader;

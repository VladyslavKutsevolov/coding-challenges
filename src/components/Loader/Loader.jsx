import React from "react";

const Loader = ({ isLoading }) => {
  if (isLoading)
    return (
      <div className="loader text-center text-white">Loading users...</div>
    );
};

export default Loader;

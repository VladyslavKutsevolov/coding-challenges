import React, { useEffect, useState } from "react";
import { saveToLocalStorage } from "@/utils/helpers";
import PropTypes from "prop-types";

const SaveTableOrderPopup = ({ headers, show, close }) => {
  const [showPopup, setShowPopup] = useState(show);

  useEffect(() => {
    setShowPopup(show);
  }, [show]);

  if (!showPopup) {
    return null;
  }

  return (
    <div className="absolute bottom-4 right-4 flex flex-col align-center justify-content-center bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded px-4 py-4 items-center">
      <span className="text-gray-300">
        Do you want to save new table order?
      </span>
      <div className="flex mt-3">
        <button
          onClick={() => {
            saveToLocalStorage("headers", headers);
            close();
          }}
          className="text-white mr-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded uppercase"
        >
          Yes
        </button>
        <button
          onClick={close}
          className="text-white bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded uppercase"
        >
          No
        </button>
      </div>
    </div>
  );
};

SaveTableOrderPopup.propTypes = {
  /** Table headers */
  headers: PropTypes.array.isRequired,

  /** trigger display popup default: false */
  show: PropTypes.bool.isRequired,

  /** close popup */
  close: PropTypes.func.isRequired,
};

export default SaveTableOrderPopup;

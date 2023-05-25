import React, { useEffect, useState } from "react";
import { saveToLocalStorage } from "@/utils/helpers";

const SaveTableOrderPopup = ({ headers, show, close }) => {
  const [showPopup, setShowPopup] = useState(show);

  useEffect(() => {
    setShowPopup(show);
  }, [show]);

  if (!showPopup) {
    return null;
  }

  return (
    <div className="confirm-popup absolute bottom-4 right-4 flex flex-col align-center justify-content-center dark:bg-gray-800 px-4 py-4 items-center">
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

export default SaveTableOrderPopup;

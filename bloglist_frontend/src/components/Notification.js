import React from "react";

const Notification = ({ notification: { type, message } }) => {
  const style = {
    backgroundColor: type === "success" ? "rgb(88, 174, 90)" : "rgb(255, 0, 0)"
  };

  if (message === null) return null;

  return (
    <div className="notification" style={style}>
      {message}
    </div>
  );
};

export default Notification;

import React from "react";
import "./LoginCard.css";

const LoginCard = ({ children }) => {
  const cardStyle = {
    width: "90%", // Flexible width
    maxWidth: "450px", // Prevents it from getting too large
    minHeight: "425px", // Minimum height
    borderRadius: "10px",
    // border: "2px solid black",
    backgroundColor: "rgba(255, 255, 255, 1)",
    padding: "0px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 10px",

  };

  return <div className="Card" style={cardStyle}>{children}</div>;
};

export default LoginCard;
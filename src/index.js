import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

let DATA = [];

//https://laughing-darwin-718a59.netlify.app/.netlify/functions/api
//http://localhost:9000/.netlify/functions/api

ReactDOM.render(
  <>
    <div className="loader"> loading...</div>
  </>,
  document.getElementById("root")
);

let loading = <div className="loader"> loading...</div>;

fetch(`https://jason-11.herokuapp.com/json/`, {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "",
  },
  mode: "cors",
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    loading = "";

    let initTrx = [];
    for (let i = 0; i < data.results.length; i++) {
      initTrx = {
        id: data.results[i].trxid,
        fiscalType: data.results[i].trxtype,
        desc: data.results[i].trxdesc,
        dolValue: data.results[i].trxvalue,
      };
      DATA.push(initTrx);
    }
    ReactDOM.render(
      <>
        {loading}
        <App trxs={DATA} />
      </>,
      document.getElementById("root")
    );
  })
  .catch((e) => console.log(e));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

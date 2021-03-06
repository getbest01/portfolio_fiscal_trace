import React, { useState, useRef, useEffect } from "react";
import Transactions from "./components/Transactions";
import Form from "./components/Form";
import FilterRadio from "./components/FilterRadio";
import { nanoid } from "nanoid";

const FILTER_MAP = {
  All: () => true,
  Earned: (trx) => trx.fiscalType === "Earned",
  Spent: (trx) => trx.fiscalType === "Spent",
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App(props) {
  const [trx, setTrx] = useState(props.trxs);
  const [filter, setFilter] = useState("All");
  const listHeadingRef = useRef(null);
  const prevTrxLength = usePrevious(trx.length);
  const [earnedTotal, setEarnedTotal] = useState("0");
  const [spentTotal, setSpentTotal] = useState("0");

  const filterListRadio = FILTER_NAMES.map((fiscalType) => (
    <FilterRadio
      key={fiscalType}
      name={fiscalType}
      isPressed={fiscalType === filter}
      setFilter={setFilter}
    />
  ));

  const trxList = trx
    .filter(FILTER_MAP[filter])
    .map((trx) => (
      <Transactions
        id={trx.id}
        fiscalType={trx.fiscalType}
        desc={trx.desc}
        dolValue={trx.dolValue}
        key={trx.id}
        deleteTrx={deleteTrx}
        editTrx={editTrx}
        inputCheck={inputCheck}
      />
    ));

  //# of transactions update
  useEffect(() => {
    if (trx.length - prevTrxLength === -1) {
      if (listHeadingRef.current) {
        listHeadingRef.current.focus();
      }
    }
  }, [trx.length, prevTrxLength]);

  //Earned and Soent total calc whenever data changes
  useEffect(() => {
    if (trxList.filter((x) => x.props.fiscalType === "Earned").length > 0) {
      setEarnedTotal(
        trxList
          .filter((x) => x.props.fiscalType === "Earned")
          .map((x) => x.props.dolValue)
          .reduce((a, x) => parseInt(a) + parseInt(x))
      );
    } else {
      setEarnedTotal("0");
    }

    if (trxList.filter((x) => x.props.fiscalType === "Spent").length > 0) {
      setSpentTotal(
        trxList
          .filter((x) => x.props.fiscalType === "Spent")
          .map((x) => x.props.dolValue)
          .reduce((a, x) => parseInt(a) + parseInt(x))
      );
    } else {
      setSpentTotal("0");
    }
  }, [trxList]);

  //saving transaction list to database [replace table data with transaction list]
  function finishDay() {
    fetch("https://jason-11.herokuapp.com/replace", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "",
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify(trx),
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        alert(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //New or edit transaction input data check
  function inputCheck(inputType, inputDesc, inputValue) {
    let errorCode = "";
    errorCode += inputType === "" ? " inputType is null " : "";
    errorCode += inputDesc === "" ? " transaction detail is required " : "";
    errorCode += inputValue === "" ? " Value is required " : "";
    errorCode += !/^[0-9]*[.]?[0-9]*$/.test(inputValue)
      ? " Value is not number type "
      : "";
    return errorCode;
  }

  //Edit transaction
  function editTrx(id, newFiscalType, newDesc, newDolValue) {
    const editedTrxList = trx.map((trx) => {
      if (id === trx.id) {
        return {
          ...trx,
          fiscalType: newFiscalType,
          desc: newDesc,
          dolValue: newDolValue,
        };
      }
      return trx;
    });
    setTrx(editedTrxList);
  }

  //add transaction
  function addTrx(fiscalType, desc, dolValue) {
    const newTrx = {
      id: "trx-" + nanoid(),
      fiscalType: fiscalType,
      desc: desc,
      dolValue: dolValue,
    };

    setTrx([...trx, newTrx]);
  }

  //delete transaction
  function deleteTrx(id) {
    const remainingTrx = trx.filter((trx) => id !== trx.id);
    setTrx(remainingTrx);
  }

  //rendering
  return (
    <div className="trxapp">
      <div className="heading-pos">
        <h1>Fiscal Trace</h1>
        <input
          type="button"
          value="DB update"
          className="topHead"
          onClick={finishDay}
        ></input>
      </div>
      <Form addTrx={addTrx} inputCheck={inputCheck} />

      <div className="filters">
        <fieldset>
          <legend>List filter</legend>
          <div className="class-filter">{filterListRadio}</div>
        </fieldset>
      </div>
      <div>
        <fieldset>
          <legend>Summary</legend>
          <div className="summary-bottom">
            <p>- Number of transactions: {trxList.length}</p>
            <p>- Total earned: ${parseFloat(earnedTotal).toLocaleString()}</p>
            <p>- Total spent: ${parseFloat(spentTotal).toLocaleString()}</p>
          </div>
        </fieldset>
      </div>
      <ul
        className="trx-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        <fieldset>
          <legend>Transaction List</legend>
          {trxList}
        </fieldset>
      </ul>
    </div>
  );
}

export default App;

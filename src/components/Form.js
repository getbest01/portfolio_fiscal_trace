import React, { useState } from "react";

function Form(props) {
  const [fiscalType, setFiscalType] = useState("Earned");
  const [desc, setDesc] = useState("");
  const [dolValue, setDolValue] = useState("");

  function handleChange(e) {
    if (e.target.id === "fiscal-desc") {
      setDesc(e.target.value);
    } else if (e.target.id === "fiscal-dol-value") {
      setDolValue(e.target.value);
    } else if (e.target.id === "selectType") {
      setFiscalType(e.target.value);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    let errorCode = props.inputCheck(fiscalType, desc, dolValue);
    if (errorCode.length === 0) {
      props.addTrx(fiscalType, desc, dolValue);
      setDesc("");
      setDolValue("");
    } else {
      alert(errorCode);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="formFrm">
      <fieldset>
        <legend>New transaction input</legend>
        <div className="inputForm">
          <select
            onChange={handleChange}
            id="selectType"
            defaultValue="Earned"
            className="inputCell inputType"
          >
            <option>Earned</option>
            <option>Spent</option>
          </select>

          <input
            className="inputCell inputDesc"
            type="text"
            id="fiscal-desc"
            name="desc"
            autoComplete="off"
            placeholder="e.g. Oil change"
            value={desc}
            onChange={handleChange}
          />
          <input
            className="inputCell inputValue"
            type="text"
            id="fiscal-dol-value"
            name="dolValue"
            autoComplete="off"
            placeholder="e.g. 500"
            value={dolValue}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn__primary btn__lg">
            Add
          </button>
        </div>
      </fieldset>
    </form>
  );
}

export default Form;

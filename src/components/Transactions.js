import React, { useRef, useEffect, useState } from "react";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Transactions(props) {
  const [isEditing, setEditing] = useState(false);
  const [newFiscalType, setFiscalType] = useState("");
  const [newDesc, setDesc] = useState("");
  const [newDolValue, setDolValue] = useState("");
  const editSelectRef = useRef(null);
  const editDescRef = useRef(null);
  const editValRef = useRef(null);
  //const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);
  const wasEditing = usePrevious(isEditing);

  function handleChange(e) {
    if (e.target.name === "fiscal-desc") {
      setDesc(e.target.value);
    } else if (e.target.name === "fiscal-dol-value") {
      setDolValue(e.target.value);
    } else if (e.target.name === "selectType") {
      setFiscalType(e.target.value);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    let errorCode = props.inputCheck(newFiscalType, newDesc, newDolValue);
    if (errorCode.length === 0) {
      props.editTrx(props.id, newFiscalType, newDesc, newDolValue);
      setFiscalType("");
      setDesc("");
      setDolValue("");
      setEditing(false);
    } else {
      alert(errorCode);
    }
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <select
          className="edit-cell inputType"
          id={props.id}
          defaultValue={props.fiscalType}
          onChange={handleChange}
          name="selectType"
          ref={editSelectRef}
          title={newFiscalType}
        >
          <option>Earned</option>\<option>Spent</option>\
        </select>
        <input
          className="edit-cell inputDesc"
          type="text"
          value={newDesc}
          onChange={handleChange}
          ref={editDescRef}
          name="fiscal-desc"
          placeholder={props.desc}
          title={editDescRef.value}
        />
        <input
          className="edit-cell inputValue"
          type="text"
          value={newDolValue}
          onChange={handleChange}
          ref={editValRef}
          name="fiscal-dol-value"
          placeholder={props.dolValue}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn trx-cancel"
          onClick={() => {
            setEditing(false);
          }}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn__primary trx-edit">
          Save
        </button>
      </div>
    </form>
  );
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <span className="trxDataType">{props.fiscalType}</span>
        <span className="trxDataDesc">{props.desc}</span>
        <span className="trxDataValue">{`$ ${parseFloat(
          props.dolValue
        ).toLocaleString()}`}</span>
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn"
          onClick={() => {
            setEditing(true);
            setFiscalType(props.fiscalType);
          }}
          ref={editButtonRef}
        >
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTrx(props.id)}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (!wasEditing && isEditing) {
      editSelectRef.current.focus();
    }
    if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);

  return (
    <li className="transaction">
      {isEditing ? editingTemplate : viewTemplate}
    </li>
  );
}

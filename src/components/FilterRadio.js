import React from "react";

function FilterRadio(props) {
  return (
    <>  
    <input
      type="radio" 
      name="filter"
      className="btn radio-btn" 
      defaultChecked={props.isPressed}
      onClick={()=> props.setFilter(props.name)}
      />{props.name}
      </>
  );
}

export default FilterRadio;
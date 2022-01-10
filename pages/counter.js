import Web3 from "web3";
import React, { useState, useEffect } from "react";
import War from "./abi.json";

function ButtonIncrement(props) {
  return (
    <button style={{ marginLeft: ".5rem" }} onClick={props.onClickFunc}>
      +1
    </button>
  );
}
function ButtonDecrement(props) {
  return (
    <button style={{ marginLeft: ".5rem" }} onClick={props.onClickFunc}>
      -1
    </button>
  );
}
function Display(props) {
  return <label style={{ marginLeft: ".5rem" }}>{props.message}</label>;
}
export default function Counter() {
  const [counter, setCounter] = useState(1);
  const incrementCounter = () => setCounter(counter + 1);
  let decrementCounter = () => setCounter(counter - 1);
  if (counter <= 1) {
    decrementCounter = () => setCounter(1);
  }
  return (
    <div>
      <ButtonIncrement onClickFunc={incrementCounter} />
      <Display message={counter} />
      <ButtonDecrement onClickFunc={decrementCounter} />
    </div>
  );
}

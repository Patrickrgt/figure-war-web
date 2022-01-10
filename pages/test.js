import Web3 from "web3";
import React, { useState, useEffect } from "react";
import War from "./abi.json";
import { Main } from "next/document";

export default function Test() {
  // Contract Address
  const [contractAddress, setContractAddress] = useState(
    "0x2E57cE2b4a890e6402DbD70a33C4B30860499c1a"
  );

  // Contract ABI
  const [abi, setAbi] = useState(War);

  // Contract Address Methods
  const [warContract, setWarContract] = useState("");

  // User Address
  const [userAddress, setUserAddress] = useState("");

  //   Price Per Mint
  const [pricePer, setPricePer] = useState(0);

  //   Mint amount
  const [mintAmount, setMintAmount] = useState(1);
  let incrementMintAmount = () => setMintAmount(mintAmount + 1);
  let decrementMintAmount = () => setMintAmount(mintAmount - 1);

  if (mintAmount <= 0) {
    decrementMintAmount = () => setMintAmount(0);
  } else if (mintAmount >= 10) {
    incrementMintAmount = () => setMintAmount(10);
  }

  useEffect(() => {
    loadWeb3();
    console.log("Calling wallet and contract");
  }, []);

  async function loadWeb3() {
    if (typeof window.web3 !== "undefined") {
      window.web3 = new Web3(window.ethereum);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }

    window.ethereum.enable().then((accounts) => {
      window.web3.eth.net.getNetworkType().then((network) => {
        if (network !== "rinkeby") {
          alert(
            `You are on the ${network} network. Please switch to the Rinkeby network for testing.`
          );
        } else {
          setUserAddress(accounts[0]);
          console.log(userAddress);
          callContract();
        }
      });
    });
  }

  async function callContract() {
    await setWarContract(new window.web3.eth.Contract(abi, contractAddress));
    console.log(warContract);
  }

  //   async function mintWar() {
  //     const gasAmount = await warContract.methods
  //       .mintWar(warAmount)
  //       .estimateGas({ from: userAddress, value: 0 });
  //   }

  return (
    <main>
      <button onClick={decrementMintAmount}>-</button>
      <h1>{mintAmount}</h1>
      {/* <input onChange={(e) => setMintAmount(e.target.value)}></input> */}
      <button onClick={incrementMintAmount}>+</button>

      <button onClick={() => mintWar()}>mint</button>
    </main>
  );
}

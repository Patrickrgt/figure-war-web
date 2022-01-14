import Web3 from "web3";
import React, { useState, useEffect } from "react";
import War from "./abi.json";

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

  //   War Header
  const [warHeader, setWarHeader] = useState("Would you like to go to war?");
  let changeWarHeader = () => {
    var comments = [
      "Press yes dumbass",
      "Okay whatever",
      "So why are you here",
      "Get lost fool",
      "Ok nice joke now press yes",
      "Ok pussy",
    ];
    var random = Math.floor(Math.random() * comments.length);
    var randomComment = comments[random];
    if (randomComment === warHeader) {
      changeWarHeader();
    } else setWarHeader(randomComment);
  };

  //   Go to war
  const [warBinary, setWarBinary] = useState(true);
  let goToWar = () => {
    setWarHeader("Would you like to go to war?");
    if (userAddress) {
      setWarBinary(!warBinary);
    } else {
      loadWeb3();
      setConnectMsg("Please connect to MetaMask");
    }
  };

  //   NFT Color
  const [warColor, setWarColor] = useState();

  //   Mint Parameters Color
  const [mintParameters, setMintParameters] = useState(0);

  //   Connect Message
  const [connectMsg, setConnectMsg] = useState("");

  //   Error Message
  const [errMsg, setErrMsg] = useState("Please input color here");

  //   Network
  const [network, setNetwork] = useState("");

  //   Mint amount
  //   const [mintAmount, setMintAmount] = useState(1);
  //   let incrementMintAmount = () => setMintAmount(mintAmount + 1);
  //   let decrementMintAmount = () => setMintAmount(mintAmount - 1);

  //   if (mintAmount <= 0) {
  //     decrementMintAmount = () => setMintAmount(0);
  //   } else if (mintAmount >= 10) {
  //     incrementMintAmount = () => setMintAmount(10);
  //   }

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
        setNetwork(network);
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

  async function mintWar() {
    window.web3 = new Web3(window.ethereum);
    window.web3.eth.net.getNetworkType().then(async (network) => {
      if (network !== "rinkeby") {
        alert(
          `You are on the ${network} network. Please switch to the Rinkeby network for testing.`
        );
      } else {
        try {
          const gasAmount = await warContract.methods
            .mint(1)
            .estimateGas({ from: userAddress, value: 0 });
          await warContract.methods
            .mint(warColor)
            .send({ from: userAddress, value: 0, gas: String(gasAmount) })
            .on("transactionHash", function (hash) {
              console.log("transactionHash", hash);
            });
        } catch {
          setErrMsg("input 0 for white 1 for black");
        }
      }
    });
  }

  return (
    <main>
      <section className="connect-container">
        {userAddress ? (
          <button className="connect-button">
            ...{userAddress.substring(36)}
          </button>
        ) : (
          <button className="connect-button" onClick={() => loadWeb3()}>
            connect wallet
          </button>
        )}
      </section>

      {/* <button onClick={decrementMintAmount}>-</button> */}
      {/* <input onChange={(e) => setMintAmount(e.target.value)}></input> */}
      {/* <button onClick={incrementMintAmount}>+</button> */}

      {warBinary ? (
        <div className="war-container">
          <h1>{warHeader}</h1>
          <h2>{connectMsg}</h2>
          <button className="war-button" onClick={goToWar}>
            Yes
          </button>
          <button className="war-button" onClick={changeWarHeader}>
            No
          </button>
        </div>
      ) : (
        <div className="mint-container">
          <button className="mint-x" onClick={goToWar}>
            x
          </button>
          <input
            className="mint-input"
            type="number"
            placeholder={errMsg}
            onChange={(e) => setWarColor(e.target.value)}
          ></input>
          {network !== "rinkeby" ? (
            <button className="unable-mint-button">mint</button>
          ) : (
            <button className="mint-button" onClick={() => mintWar()}>
              mint
            </button>
          )}
        </div>
      )}
    </main>
  );
}

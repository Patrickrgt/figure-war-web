import Web3 from "web3";
import React, { useState, useEffect } from "react";
import War from "./abi.json";
import Parallax from "parallax-js";

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

  //   Go to war
  const [warBinary, setWarBinary] = useState(true);
  let goToWar = () => {
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

  const [bgColor, setBGColor] = React.useState("");
  const bgStyles = {
    "background-color": bgColor,
    transition: "all ease 1s",
  };

  const [mousePosition, setMousePosition] = useState(0);
  const [windowW, setWindowW] = useState(0);
  const [windowH, setWindowH] = useState(0);
  const [xTranslate, setXTranslate] = useState(0);
  const [yTranslate, setYTranslate] = useState(0);
  const [hColor, setHColor] = React.useState("");
  const hStyles = {
    color: hColor,
    transition: "all ease 1s",
    transform: `translateX(${xTranslate}px) translateY(${yTranslate}px)`,
  };

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
    var scene = document.getElementById("scene");
    var parallaxInstance = new Parallax(scene);
    setWindowW(window.innerWidth);
    setWindowH(window.innerHeight);
    window.addEventListener("mousemove", parallax);
    loadWeb3();
    // console.log("Calling wallet and contract");
  }, []);

  function parallax(e) {
    var x = (e.clientX * -15) / 100;
    var y = (e.clientY * -15) / 100;
    console.log(x, y);
    setXTranslate(x);
    setYTranslate(y);
  }

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
          // console.log(userAddress);
          callContract();
        }
      });
    });
  }

  async function callContract() {
    await setWarContract(new window.web3.eth.Contract(abi, contractAddress));
    // console.log(warContract);
  }

  async function mintWar(e) {
    // console.log("running");
    // console.log(e);
    // window.web3 = new Web3(window.ethereum);

    if (network !== "rinkeby") {
      alert(
        `You are on the ${network} network. Please switch to the Rinkeby network for testing.`
      );
    } else {
      try {
        if (e === "Yes") {
          await setWarColor(1);
        } else await setWarColor(0);
        const gasAmount = await warContract.methods
          .mint(warColor)
          .estimateGas({ from: userAddress, value: 0 });
        await warContract.methods
          .mint(warColor)
          .send({ from: userAddress, value: 0, gas: String(gasAmount) })
          .on("transactionHash", function (hash) {
            console.log("transactionHash", hash);
          });
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <main
      id="main-container"
      style={bgStyles}
      // onMouseEnter={(e) => {
      //   console.log(e);
      //   setXTranslate(mousePosition.clientX);
      //   setYTranslate(mousePosition.clientY);
      // }}
    >
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

      <div className="war-container">
        <div id="scene">
          <h1 data-depth="0.5">Would you like to go to war?</h1>
        </div>
        <h1 style={hStyles}>Would you like to go to war?</h1>

        <h2>{connectMsg}</h2>
        <button
          className="war-button-yes"
          onMouseEnter={() => {
            setHColor("rgb(255, 255, 255)");
            setBGColor("rgb(0, 0, 0)");
          }}
          onMouseLeave={() => setBGColor("")}
          onClick={(e) => mintWar(e.target.innerText)}
        >
          Yes
        </button>
        <button
          className="war-button-no"
          onMouseEnter={() => {
            setHColor("rgb(0, 0, 0)");
            setBGColor("rgb(255, 255, 255)");
          }}
          onMouseLeave={() => setBGColor("")}
          onClick={(e) => mintWar(e.target.innerText)}
        >
          No
        </button>
      </div>
    </main>
  );
}

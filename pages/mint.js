import Head from "next/head";
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

  const [offX, setOffX] = useState(0);
  const [offY, setOffY] = useState(0);
  const bgStyles = {
    "background-color": bgColor,
    transition: "all ease 1s",
    "--maskX": offX,
    "--maskY": offY,
  };
  const cloneBgStyles = {
    "background-color": bgColor,
  };

  const [mousePosition, setMousePosition] = useState(0);
  const [windowW, setWindowW] = useState(0);
  const [windowH, setWindowH] = useState(0);

  const [xTranslate, setXTranslate] = useState(0);
  const [yTranslate, setYTranslate] = useState(0);
  const [hColor, setHColor] = React.useState("white");
  const [hCloneColor, setHCloneColor] = React.useState("black");

  const hStyles = {
    color: hColor,
  };

  const hCloneStyles = {
    color: hCloneColor,
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
    // var scene = document.getElementById("scene");
    // var parallaxInstance = new Parallax(scene);
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
    console.log(e);
    // window.web3 = new Web3(window.ethereum);

    if (network !== "rinkeby") {
      alert(
        `You are on the ${network} network. Please switch to the Rinkeby network for testing.`
      );
    } else {
      try {
        if (e === "Yes") {
          await setWarColor(0);
          // await mint(e);
        }
        if (e === "No") {
          await setWarColor(1);
          // await mint(e);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    if (warContract) {
      console.log(warColor);
      mintFunc();
    }
  }, [warColor]);

  async function mintFunc() {
    // if (e === "Yes") {
    //   await setWarColor(0);
    // }
    // if (e === "No") {
    //   await setWarColor(1);
    // }

    const gasAmount = await warContract.methods
      .mint(warColor)
      .estimateGas({ from: userAddress, value: 0 });
    await warContract.methods
      .mint(warColor)
      .send({ from: userAddress, value: 0, gas: String(gasAmount) })
      .on("transactionHash", async function (hash) {
        console.log("transactionHash", hash);
        const interval = setInterval(function () {
          console.log("Attempting to get transaction receipt...");
          web3.eth.getTransactionReceipt(hash, function (err, rec) {
            if (rec) {
              console.log(rec);
              console.log(rec.logs[1].topics[1]);
              clearInterval(interval);
            }
          });
        }, 1000);
      });
  }

  function mouseMove(e) {
    const width = e.target.clientWidth;
    const height = e.target.clientHeight;
    const oX = (e.nativeEvent.offsetX / width) * 100;
    const oY = (e.nativeEvent.offsetY / height) * 100;
    setOffX(oX);
    setOffY(oY);
    console.log(offX, offY);
  }

  function mouseOut(e) {
    const width = e.target.clientWidth;
    const height = e.target.clientHeight;
    setOffX(50);
    setOffY(50);
  }

  return (
    <div>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https :: //fonts.googleapis.com/css2?family= Noto + Serif + JP & display = swap "
          rel=" stylesheet "
        />
      </Head>

      <main
        id="main-container"
        onMouseMove={(e) => mouseMove(e)}
        onMouseOut={(e) => mouseOut(e)}
        style={bgStyles}
        // onMouseEnter={(e) => {
        //   console.log(e);
        //   setXTranslate(mousePosition.clientX);
        //   setYTranslate(mousePosition.clientY);
        // }}
      >
        <main style={cloneBgStyles} id="main-clone-container"></main>
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
          {/* <div id="scene">
          <h1 data-depth="0.5">Would you like to go to war?</h1>
        </div> */}
          <div className="header-container">
            <article className="header">
              <h1 style={hStyles}>Would you like to go to war?</h1>
            </article>
            <article className="header clone-header">
              <h1 style={hCloneStyles}>Would you like to go to war?</h1>
            </article>
          </div>

          {/* <h1 style={hStyles}>Would you like to go to war?</h1> */}

          <h2>{connectMsg}</h2>
          <button
            className="war-button-yes"
            onMouseEnter={() => {
              setHColor("rgb(255, 255, 255)");
              setBGColor("rgb(0, 0, 0)");
              setHColor("white");
              setHCloneColor("white");
            }}
            onMouseLeave={() => {
              setBGColor("");
              setHColor("white");
              setHCloneColor("black");
            }}
            onClick={(e) => mintWar(e.target.innerText)}
          >
            Yes
          </button>
          <button
            className="war-button-no"
            onMouseEnter={() => {
              setHColor("rgb(0, 0, 0)");
              setBGColor("rgb(255, 255, 255)");
              setHColor("black");
              setHCloneColor("black");
            }}
            onMouseLeave={() => {
              setBGColor("");
              setHColor("white");
              setHCloneColor("black");
            }}
            onClick={(e) => mintWar(e.target.innerText)}
          >
            No
          </button>
        </div>
      </main>
    </div>
  );
}

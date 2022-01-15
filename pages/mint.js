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

  async function mintWar(e) {
    console.log("running");
    console.log(e);
    window.web3 = new Web3(window.ethereum);
    window.web3.eth.net.getNetworkType().then(async (network) => {
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

      <div className="war-container">
        <h1>Would you like to go to war?</h1>
        <h2>{connectMsg}</h2>
        <button
          className="war-button"
          onClick={(e) => mintWar(e.target.innerText)}
        >
          Yes
        </button>
        <button
          className="war-button"
          onClick={(e) => mintWar(e.target.innerText)}
        >
          No
        </button>
      </div>
    </main>
  );
}

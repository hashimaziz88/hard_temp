import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LockABI from "./contracts/Lock.json";
import contractAddress from "./contracts/contract-address.json";
import { Dapp } from "./components/Dapp";
import "./App.css";

function App() {
  const [unlockTime, setUnlockTime] = useState(null);
  const [owner, setOwner] = useState(null);
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    const loadContract = async () => {
      if (!window.ethereum) {
        alert("MetaMask not detected!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const lockContract = new ethers.Contract(
        contractAddress.Lock,
        LockABI.abi,
        signer
      );

      // Fetch details
      const contractUnlockTime = await lockContract.unlockTime();
      const contractOwner = await lockContract.owner();
      const contractBalance = await provider.getBalance(contractAddress.Lock);

      setUnlockTime(
        new Date(Number(contractUnlockTime) * 1000).toLocaleString()
      );
      setOwner(contractOwner);
      setBalance(ethers.formatEther(contractBalance));
    };

    loadContract();
  }, []);

  return (
    <div>
      <h2>Lock Contract Details</h2>
      <p>
        <strong>Unlock Time:</strong> {unlockTime}
      </p>
      <p>
        <strong>Owner Address:</strong> {owner}
      </p>
      <p>
        <strong>Contract Balance:</strong> {balance} ETH
      </p>
    </div>
  );
}

export default App;

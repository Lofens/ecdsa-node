import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [nonce, setNonce] = useState(0);
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        signature={signature}
        setSignature={setSignature}
        nonce={nonce}
        setNonce={setNonce}
        amount={amount}
        setAmount={setAmount}
        recipient={recipient}
        setRecipient={setRecipient}
        recoveryBit={recoveryBit}
        setRecoveryBit={setRecoveryBit}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        signature={signature}
        setSignature={setSignature}
        recipient={recipient}
        setRecipient={setRecipient}
        amount={amount}
        setAmount={setAmount}
        recoveryBit={recoveryBit}
        setNonce={setNonce}
       />
    </div>
  );
}

export default App;

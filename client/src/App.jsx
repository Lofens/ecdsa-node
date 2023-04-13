import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [shouldSign, setShouldSign] = useState(false);
  const [signatureObj, setSignatureObj] = useState({});

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        shouldSign={shouldSign}
        setShouldSign={setShouldSign}
        signatureObj={signatureObj}
        setSignatureObj={setSignatureObj}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        shouldSign={shouldSign}
        setShouldSign={setShouldSign}
        signatureObj={signatureObj}
        setSignatureObj={setSignatureObj}
       />
    </div>
  );
}

export default App;

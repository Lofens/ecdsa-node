import { recoverPublicKey } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

const Sign = (props) => {
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState(0);
  const [txSuccess, setTxSuccess] = useState("");

  async function getKey(e) {
    e.preventDefault();
    try {
      const pubKey = recoverPublicKey(props.hash, signature, 0);
      if (toHex(pubKey) == props.address) {
        setTxSuccess("Transaction is sent");
      }
    } catch (error) {
      console.log(error);
      setTxSuccess("Error. Try again");
    }
  }

  return props.show == false ? (
    <div>
      <p>Loading...</p>
      <CircularProgress color="inherit" />
    </div>
  ) : (
    <div className="container transfer">
      <h1>Transaction Hash </h1>
      <p>{props.hash}</p>
      <form onSubmit={getKey}>
        <h2>Sign Transaction:</h2>
        <label>
          Signature (Hexadecimal)
          <input
            placeholder="Ex: 304502..."
            value={signature}
            onChange={(e) => {
              setSignature(e.target.value);
            }}
          />
          <br></br>
          Recovery Bit
          <input
            placeholder="Ex: 0"
            value={recoveryBit}
            onChange={(e) => setRecoveryBit(e.target.value)}
          />
        </label>
        <input type="submit" className="button" value="Submit" />
      </form>

      

      {{ txSuccess } ? (
        <p>{txSuccess}</p>
      ) : (
        <>
          <CircularProgress color="inherit" />
          <p>Loading...</p>
        </>
      )}
    </div>
  );
};

export default Sign;
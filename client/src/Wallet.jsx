import server from "./server";
import { useState } from "react";
import { toHex, utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import * as secp from "ethereum-cryptography/secp256k1";

function Wallet({ address, setAddress, balance, setBalance, shouldSign, signatureObj, setSignatureObj }) {
  const [privateKey, setPrivateKey] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  async function onChangePrivateKey(evt) {
    evt.preventDefault();

    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
  }

  async function sign(evt) {
    evt.preventDefault();

    if (shouldSign) {
      const hashedMessage = keccak256(utf8ToBytes("someMessage"));

      try {
        const signature = await secp.sign(hashedMessage, privateKey);
        const signatureObj = {
          signature: toHex(signature),
          hashedMessage: toHex(hashedMessage)
        }

        setSignatureObj(signatureObj);
        setInfoMessage("Signed! Continue with Transfer");
      } catch (e) {
        setInfoMessage("Invalid private key");
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={sign}>
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>

      {shouldSign ? (
        <label>
          Sign using Wallet Private Key
          <input placeholder="Type your private key hex" value={privateKey} onChange={onChangePrivateKey}></input>

          <input type="submit" className="button" value="Sign Transaction" />
          <label>
            {infoMessage}
          </label>
        </label>
      ) : (
        <div></div>
      )}
    </form>
  );
}

export default Wallet;

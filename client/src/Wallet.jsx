import server from "./server";
import { useState } from "react";
import { toHex, utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import * as secp from "ethereum-cryptography/secp256k1";

function Wallet({ address, setAddress, balance, setBalance, signature, setSignature, nonce, setNonce, amount, setAmount, recipient, setResipient, setRecoveryBit}) {
  const [privateKey, setPrivateKey] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const { data: { balance } } = await server.get(`balance/${address}`);
      setBalance(balance);

      const { data: { nonce } } = await server.get(`nonce/${address}`);
      setNonce(nonce);
    } else {
      setBalance(0);
    }
  }

  async function onChangePrivateKey(evt) {
    evt.preventDefault();

    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
  }

  async function createSignature(event) {
    event.preventDefault();

    const allFieldsAreFilled = address !== "" && privateKey !== "" && amount > 0 && recipient !== "" && nonce >= 0;

    if (allFieldsAreFilled) {
      setInfoMessage("");

      try {
        const signature = await secp.sign(getHashedTransactionMessage(), privateKey, { recovered: true });

        setSignature(signature[0].toString());
        setRecoveryBit(signature[1].toString());
        setInfoMessage("Signature created successfully");
      } catch(e){
        setInfoMessage(e.message);
      }
    } else {
      setInfoMessage("Please fill all fields to generate a signature");
    }
  }

  function getHashedTransactionMessage() {
    const message = JSON.stringify({
        sender: address.toLowerCase(),
        amount: parseInt(amount),
        nonce: parseInt(nonce) + 1,
        recipient: recipient.toLowerCase()
      });

    return keccak256(utf8ToBytes(message));
  }

  return (
    <form className="container transfer" onSubmit={createSignature}>
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>

      {/* {signature === "" ? ( */}
        <label>
          Sign using Wallet Private Key
          <input placeholder="Type your private key hex" value={privateKey} onChange={onChangePrivateKey}></input>

          <input type="submit" className="button" value="Sign Transaction" />
          <label>
            {infoMessage}
          </label>
        </label>
      {/* ) : (
        <div></div>
      )} */}
    </form>
  );
}

export default Wallet;

import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, signature, setSignature, recipient, setRecipient, amount, setAmount, recoveryBit, setNonce }) {
  const [errorMessage, setErrorMessage] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (signature !== "" && signature instanceof Int8Array) {
      setErrorMessage("Please sign the transaction first");

      return;
    }

    try {
      const {
        data: { balance, nonce },
      } = await server.post(`send`, {
        sender: address,
        recipient,
        amount: parseInt(amount),
        signature,
        recoveryBit
      });

      setBalance(balance);
      setNonce(nonce);
    } catch (ex) {
      console.log(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={amount}
          onChange={setValue(setAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      {/* {signature === "" ? ( */}
        <input type="submit" className="button" value="Transfer" />
      {/* ) : (
        <input type="submit" className="button" value="Sign Transaction" />
      )} */}

      <label>
        {errorMessage}
      </label>
    </form>
  );
}

export default Transfer;

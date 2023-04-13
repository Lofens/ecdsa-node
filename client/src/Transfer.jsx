import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance, shouldSign, setShouldSign, signatureObj, setSignatureObj }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (!shouldSign) {
      await requestSignature(evt);

      return;
    }

    const signatureHex = signatureObj.signatureHex;

    if (signatureHex === "") {
      setErrorMessage("Please sign the transaction first");
      return;
    }

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        amount: parseInt(sendAmount),
        recipient,
        signatureObj
      });

      // Reset after success
      setBalance(balance);
      setSignatureObj({});
      setShouldSign(false);
    } catch (ex) {
      console.log(ex);
      alert(ex.response.data.message);
    }
  }

  async function requestSignature(event) {
    setShouldSign(true);
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
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

      {shouldSign ? (
        <input type="submit" className="button" value="Transfer" />
      ) : (
        <input type="submit" className="button" value="Sign Transaction" />
      )}

      <label>
        {errorMessage}
      </label>
    </form>
  );
}

export default Transfer;

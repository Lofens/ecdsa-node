const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { toHex } = require("ethereum-cryptography/utils");
const { recoverPublicKey } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

require('dotenv').config();

app.use(cors());
app.use(express.json());

const balances = {
  "0xaa9c7dfb18bfe50e0cb7e2d5b5ab50403d1a9da1": 100,
  "0xbdf314a464b5b93710dbf227e3d9dac197cbb27a": 50,
  "0xfc2d6f6538bfc4ac86e425b49f844c65fd5d9c7d": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature


  // Good examples I found afterwards:
  // https://www.youtube.com/watch?v=Dx5mqoEGpLo

  // Pointers:
  // - Create unique element in the hashed message (store # of transactions on server and add 1 each successful transaction) - unable to replay the same signature
  // - Create hashed message using a json object with {sender, amount, unique id, recipient} - can rebuild this on the server
  // - Private keys in .env files and add it to .gitignore


  const { recipient, amount, signatureObj } = req.body;

  const recoveredPublicKey = recoverPublicKey(signatureObj.hashedMessage, signatureObj.signature, 0);
  const sender = '0x' + toHex(keccak256(recoveredPublicKey.slice(1)).slice(-20));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

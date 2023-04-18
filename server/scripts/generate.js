const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { recoverPublicKey } = require("ethereum-cryptography/secp256k1");
require('dotenv').config();

const privateKey = secp.utils.randomPrivateKey();

const publicKeyCheck = (privateKey) => {
    const publicKeyUint8Array = secp.getPublicKey(privateKey);
    return "0x" + toHex(keccak256(publicKeyUint8Array.slice(1)).slice(-20));
}


async function testRecoverySignature() {
    // Keys
    const privateKey = ""; // private key
    const publicKey = ""; // public key without 0x

    // Hash Message
    const someMessage = "SomeMessage";
    const utf8Message = utf8ToBytes(someMessage);
    const hashedMessage = keccak256(utf8Message);

    // Create Signature
    const signature = await secp.sign(hashedMessage, privateKey);

    // Recovery key
    const recoveredPublicKey = recoverPublicKey(hashedMessage, signature, 0);

    console.log('public key', publicKey);
    console.log('recoverd public key', toHex(keccak256(recoveredPublicKey.slice(1)).slice(-20)));
}


testRecoverySignature();
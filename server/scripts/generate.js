const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { recoverPublicKey } = require("ethereum-cryptography/secp256k1");

const privateKey = secp.utils.randomPrivateKey();

const publicKeyCheck = (privateKey) => {
    const publicKeyUint8Array = secp.getPublicKey(privateKey);
    return "0x" + toHex(keccak256(publicKeyUint8Array.slice(1)).slice(-20));
}


async function testRecoverySignature() {
    // Keys
    const testPrivateKey = "616E6769652E6A6A706572657A616775696E6167612E6574682E6C696E6B0D0A"; // public: 0x17A98d2b11Dfb784e63337d2170e21cf5DD04631
    const privateKey = testPrivateKey;
    const publicKey = "17A98d2b11Dfb784e63337d2170e21cf5DD04631";

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
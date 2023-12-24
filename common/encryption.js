// We'll be using the crypto-js library now.
const CryptoJS = require("crypto-js");

const encryptionKey = 'fcda0ssdegfffc94415812w3edaxswer';
const iv = "8f25c84e73298d8a";

// We convert our key and iv into WordArrays for CryptoJS
const key = CryptoJS.enc.Utf8.parse(encryptionKey.substr(0, 32));
const ivBytes = CryptoJS.enc.Utf8.parse(iv);

exports.encrypt64 = function(password){

    // Encrypt our password from utf8 to base64
    const cipherText = CryptoJS.AES.encrypt(password, key, {iv: ivBytes});

    // Convert the encrypted cipher into a base64 string
    const base64Cipher = cipherText.toString();

    // Return a base64 String
    return base64Cipher;
};

exports.decrypt64 = function(base64Cipher){

    // Decrypt the base64-encoded ciphertext back into plaintext
    const bytes = CryptoJS.AES.decrypt(base64Cipher, key, {iv: ivBytes});
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // Return a utf8 string
    return originalText;
};

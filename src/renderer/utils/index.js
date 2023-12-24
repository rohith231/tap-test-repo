import { EncryptStorage } from 'encrypt-storage';
import { ENVIROMENT, KEYS } from '~/config/env';

const CryptoJS = require("crypto-js");

export const encryptStorage = ENVIROMENT.isdev ? window.localStorage : new EncryptStorage(KEYS.storage, {})

export const encryptWithAES = (text) => {
  return ENVIROMENT.isdev? text: CryptoJS.AES.encrypt(text, KEYS.passphrase).toString();
};

export const decryptWithAES = (ciphertext) => {
    if(ENVIROMENT.isdev) { return ciphertext; }
    else {
      const bytes = CryptoJS.AES.decrypt(ciphertext, KEYS.passphrase);
      const originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return originalText;
    }
};
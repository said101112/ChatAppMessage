import { Injectable } from '@angular/core';
import * as nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import localforage from 'localforage';
@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }
 async genererPaireDeCles(){
    const pair = nacl.box.keyPair();
    const  publique = util.encodeBase64(pair.publicKey);
      const privee = util.encodeBase64(pair.secretKey);
      await localforage.setItem('privKey',privee);
      await localforage.setItem('pubKey',publique);
    return{
      publique,privee
    };
  }
   async getPrivateKey() {
    return await localforage.getItem('privKey'); 
  }

  async getPublicKey() {
    return await localforage.getItem('pubKey');
  }
  chiffrerMessage(text:string , clepubDest:string){
   const  clepublique = util.decodeBase64(clepubDest);
    const eph = nacl.box.keyPair();
     const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const msgUint8 = util.decodeUTF8(text);
    const box = nacl.box(msgUint8, nonce, clepublique, eph.secretKey);
    return{
      cipherText:util.encodeBase64(box),
      nonce:util.encodeBase64(nonce),
       senderEphemeralPublicKey: util.encodeBase64(eph.publicKey)
    }
  }
   dichifrerMessage(payload: any, mySecretKeyB64: string) {
    const box = util.decodeBase64(payload.cipherText);
    const nonce = util.decodeBase64(payload.nonce);
    const senderPub = util.decodeBase64(payload.senderEphemeralPublicKey);
    const mySecret = util.decodeBase64(mySecretKeyB64);
    const decrypted = nacl.box.open(box, nonce, senderPub, mySecret);
    if (!decrypted) return null;
    return util.encodeUTF8(decrypted);
  }
}

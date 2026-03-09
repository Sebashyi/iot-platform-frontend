import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {
    private readonly secretKey = environment.secret_key;
    /* 'r8*Y#s1L$k9z!Pq2W@v3&Tx$7jL^Bm%Q' */

    encrypt(password: string): string {
        return CryptoJS.AES.encrypt(password, this.secretKey).toString();
    }

    decrypt(encryptedPassword: string): string {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}

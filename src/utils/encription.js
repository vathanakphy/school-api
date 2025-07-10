import { createHash } from 'crypto';

export class Encryption {
    static hashPassword(password) {
        return createHash('sha256').update(password).digest('hex');
    }
    static verifyPassword(storedHashedPassword, inputPassword) {
        const hashedInput = this.hashPassword(inputPassword);
        return hashedInput === storedHashedPassword;
    }
}
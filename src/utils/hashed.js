import { hash, compare } from 'bcrypt';

export class Crypto {
    async encrypt(data) {
        const hashed = await hash(data, 7);
        return hashed;
    }

    async compare(data, hashedData) {
        return await compare(data, hashedData);
    }
}

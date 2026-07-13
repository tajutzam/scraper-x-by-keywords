import { Actor } from 'apify';
const COOKIE_KEY = 'x-cookies';

const COOKIE_STORE_ID = process.env.COOKIE_STORE_ID;

let cachedAccounts: any[] | null = null;

export const AuthService = {
    async getCookies(): Promise<any[] | null> {
        try {
            if (!cachedAccounts) {
                console.log('Mengambil data cookies dari Cloud (I/O)...');
                const kvStore = await Actor.openKeyValueStore(COOKIE_STORE_ID);
                const data: any = await kvStore.getValue(COOKIE_KEY);
                cachedAccounts = data?.accounts || [];
            }

            if (!cachedAccounts || cachedAccounts.length === 0) return null;

            const randomIndex = Math.floor(Math.random() * cachedAccounts.length);
            const selectedAccount = cachedAccounts[randomIndex];

            console.log(`Menggunakan akun rotasi: ${selectedAccount.name}`);
            return selectedAccount.cookies;
        } catch (error) {
            console.error('Gagal mengambil cookies:', error);
            return null;
        }
    },
};

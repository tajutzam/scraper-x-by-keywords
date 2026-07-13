import { Actor } from 'apify';
import { ApifyClient } from 'apify-client';

const COOKIE_KEY = 'x-cookies';

export const AuthService = {
    async getCookies(): Promise<any[] | null> {
        try {
            const kvStore = await Actor.openKeyValueStore();
            const data:any = await kvStore.getValue(COOKIE_KEY);

            if (!data?.accounts || data.accounts.length === 0) {
                console.warn('Tidak ada data akun di cookies store.');
                return null;
            }

            const randomIndex = Math.floor(Math.random() * data.accounts.length);
            const selectedAccount = data.accounts[randomIndex];

            console.log(`Menggunakan akun rotasi: ${selectedAccount.name}`);
            return selectedAccount.cookies;
        } catch (error) {
            console.error('Gagal mengambil/rotasi cookies:', error);
            return null;
        }
    },

    async isCookieValid(page: any): Promise<boolean> {
        try {
            await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 15000 });

            const locator = page.locator('[data-testid="SideNav_NewTweet_Button"]');
            await locator.waitFor({ state: 'visible', timeout: 5000 });

            return true;
        } catch (error: any) {
            console.warn('Validasi gagal (timeout/elemen tidak ditemukan):', error.message);
            return false;
        }
    },
};

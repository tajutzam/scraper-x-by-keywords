import { Actor } from 'apify';
import { ApifyClient } from 'apify-client';

const COOKIE_KEY = 'x-cookies';

export const AuthService = {
    async getCookies(storeId?: string): Promise<any[] | null> {
        try {
            if (storeId) {
                const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
                const record = await client.keyValueStore(storeId).getRecord(COOKIE_KEY);
                return Array.isArray(record?.value) ? record.value : null;
            } else {
                const kvStore = await Actor.openKeyValueStore();
                const data = await kvStore.getValue(COOKIE_KEY);
                return Array.isArray(data) ? data : null;
            }
        } catch (error) {
            console.error('Gagal mengambil cookies:', error);
            return null;
        }
    },

    // services/auth.ts
    async isCookieValid(page: any): Promise<boolean> {
        try {
            await page.goto('https://x.com/home', { waitUntil: 'domcontentloaded', timeout: 15000 });

            const locator = page.locator('[data-testid="SideNav_NewTweet_Button"]');
            await locator.waitFor({ state: 'visible', timeout: 5000 });

            return true;
        } catch (error : any) {
            console.warn('Validasi gagal (timeout/elemen tidak ditemukan):', error.message);
            return false;
        }
    },
};

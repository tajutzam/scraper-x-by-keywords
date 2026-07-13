import 'dotenv/config';
import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';
import { AuthService } from './services/auth.js';
import { Input } from './interfaces/Input.js';
import { collectTweetsFromSearchTimelineResponse } from './services/TweetParses.js';

await Actor.init();

const input = (await Actor.getInput<Input>()) ?? ({} as Input);

const proxyConfiguration = await Actor.createProxyConfiguration({
    useApifyProxy: true,
    groups: ['RESIDENTIAL'],
});

const crawler = new PlaywrightCrawler({
    proxyConfiguration,
    headless: true,
    maxConcurrency: 1,
    preNavigationHooks: [
        async ({ page }) => {
            await page.route('**/*', (route) => {
                const resType = route.request().resourceType();
                const url = route.request().url();
                if (['image', 'font', 'media', 'stylesheet', 'other'].includes(resType) ||
                    url.includes('google-analytics') || url.includes('twitter-ads')) {
                    route.abort();
                } else {
                    route.continue();
                }
            });
        },
    ],
    async requestHandler({ page, request }) {
        const cookies = await AuthService.getCookies();
        if (!cookies) await Actor.exit('Cookies tidak valid', { exitCode: 1 });

        await page.context().addCookies(cookies as any);

        console.log(`Navigating: ${request.url}`);
        await page.goto(request.url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        const collectedTweets = new Map<string, any>();

        page.on('response', async (response) => {
            if (response.url().includes('SearchTimeline')) {
                response.json().then(data => {
                    collectTweetsFromSearchTimelineResponse(data, input.maxItems ?? 10, collectedTweets);
                }).catch(() => {});
            }
        });

        let stagnantRounds = 0;
        const maxStagnantRounds = 3;

        while (collectedTweets.size < (input.maxItems ?? 10) && stagnantRounds < maxStagnantRounds) {
            const currentSize = collectedTweets.size;

            const nextResponse = page.waitForResponse(res => res.url().includes('SearchTimeline'), { timeout: 10000 }).catch(() => null);

            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

            await nextResponse;
            await page.waitForTimeout(500);

            if (collectedTweets.size === currentSize) {
                stagnantRounds++;
            } else {
                stagnantRounds = 0;
            }
        }

        const allTweetsInCrawl = Array.from(collectedTweets.values()).slice(0, input.maxItems ?? 10);
        if (allTweetsInCrawl.length > 0) {
            await Actor.pushData(allTweetsInCrawl);
            console.log(`Saved ${allTweetsInCrawl.length} tweets.`);
        }
    },
});

const rawQuery = `${input.searchTerm} lang:in`;
await crawler.run([`https://x.com/search?q=${encodeURIComponent(rawQuery)}&src=top`]);
await Actor.exit();

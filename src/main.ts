import 'dotenv/config';
import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';
import { AuthService } from './services/auth.js';
import { Input } from './interfaces/Input.js';
import { collectTweetsFromSearchTimelineResponse } from './services/TweetParses.js';

await Actor.init();

const input = (await Actor.getInput<Input>()) ?? ({} as Input);

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new PlaywrightCrawler({
    proxyConfiguration,
    headless: true,
    maxConcurrency: 1,

    async requestHandler({ page, request }) {
        try {
            if (proxyConfiguration) {
                const proxyUrl = await proxyConfiguration.newUrl();
                console.log('Proxy yang digunakan:', proxyUrl );
            }

            const cookies = await AuthService.getCookies();

            if (!cookies || !Array.isArray(cookies)) {
                console.error('Cookies not found or in the wrong format!');
                await Actor.exit('Missing cookies', { exitCode: 1 });
                return;
            }

            await page.context().addCookies(cookies as any);

            const isValid = await AuthService.isCookieValid(page);

            if (!isValid) {
                console.error('Cookies expired!');
                await Actor.exit('Cookies expired', { exitCode: 1 });
                return;
            }

            console.log(`Opening: ${request.url}`);
            await page.goto(request.url, { timeout: 60000 });

            const collectedTweets = new Map<string, any>();

            page.on('response', async (response) => {
                if (response.url().includes('SearchTimeline')) {
                    try {
                        const fullJsonResponse = await response.json();
                        collectTweetsFromSearchTimelineResponse(
                            fullJsonResponse,
                            input.maxItems ?? 10,
                            collectedTweets,
                        );
                    } catch (e) {
                        console.error('Failed to process JSON response');
                    }
                }
            });

            let previousCount = 0;
            let stagnantRounds = 0;
            const maxStagnantRounds = 3;

            while (collectedTweets.size < (input.maxItems ?? 10) && stagnantRounds < maxStagnantRounds) {
                await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                await page.waitForTimeout(3000);

                if (collectedTweets.size === previousCount) {
                    stagnantRounds++;
                } else {
                    stagnantRounds = 0;
                }
                previousCount = collectedTweets.size;
            }

            const allTweetsInCrawl = Array.from(collectedTweets.values()).slice(0, input.maxItems ?? 10);

            if (allTweetsInCrawl.length > 0) {
                await Actor.pushData(allTweetsInCrawl);
                console.log(`Successfully saved ${allTweetsInCrawl.length} tweets.`);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
});

const rawQuery = `${input.searchTerm} lang:in`;
const encodedSearchTerm = encodeURIComponent(rawQuery);

await crawler.run([`https://x.com/search?q=${encodedSearchTerm}&src=top`]);

await Actor.exit();

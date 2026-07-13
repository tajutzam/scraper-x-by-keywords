import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';
import { AuthService } from './services/auth.js';
import { Input } from './interfaces/Input.js';
import { collectTweetsFromSearchTimelineResponse } from './services/TweetParses.js';

await Actor.init();

const {
    searchTerm = 'Kabur aja dulu',
    maxItems = 20,
    maxRequestsPerCrawl = 2,
} = (await Actor.getInput<Input>()) ?? ({} as Input);

const proxyConfiguration = await Actor.createProxyConfiguration({

});

const crawler = new PlaywrightCrawler({
    // proxyConfiguration,
    maxRequestsPerCrawl,
    headless: true,
    maxConcurrency: 1,

    async requestHandler({ page, request }) {
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
        await page.goto(request.url);

        const collectedTweets = new Map<string, any>();

        page.on('response', async (response) => {
            if (response.url().includes('SearchTimeline')) {
                try {
                    const fullJsonResponse = await response.json();
                    collectTweetsFromSearchTimelineResponse(fullJsonResponse, maxItems, collectedTweets);
                } catch (e) {
                    console.error('Failed to process JSON response');
                }
            }
        });

        let previousCount = 0;
        let stagnantRounds = 0;
        const maxStagnantRounds = 3;

        while (collectedTweets.size < maxItems && stagnantRounds < maxStagnantRounds) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(3000);

            if (collectedTweets.size === previousCount) {
                stagnantRounds++;
            } else {
                stagnantRounds = 0;
            }
            previousCount = collectedTweets.size;
        }

        const allTweetsInCrawl = Array.from(collectedTweets.values()).slice(0, maxItems);

        if (allTweetsInCrawl.length > 0) {
            await Actor.pushData(allTweetsInCrawl);
            console.log(`Successfully saved ${allTweetsInCrawl.length} tweets.`);
        }
    },
});

const rawQuery = `${searchTerm} lang:in`;
const encodedSearchTerm = encodeURIComponent(rawQuery);

await crawler.run([`https://x.com/search?q=${encodedSearchTerm}&src=Latest`]);

await Actor.exit();

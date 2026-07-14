import 'dotenv/config';
import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';
import { AuthService } from './services/auth.js';
import { Input } from './interfaces/Input.js';
import { fetchSearch } from './QueryIdExtractor.js';
import { collectTweetsFromSearchTimelineResponse } from './services/TweetParses.js';

await Actor.init();

const input: any = (await Actor.getInput<Input>()) ?? ({} as any);
const MAX_ITEMS: number = input.maxItems ?? 10;

function extractQueryId(url: string, operationName: string): string | null {
    const regex = new RegExp(`/graphql/([a-zA-Z0-9_-]+)/${operationName}(?:\\?|$)`);
    const match = url.match(regex);
    return match ? match[1] : null;
}

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new PlaywrightCrawler({
    headless: true,
    proxyConfiguration,
    maxConcurrency: 1,
    requestHandlerTimeoutSecs: 120,
    async requestHandler({ page, request, log }) {
        const cookies: any = await AuthService.getCookies();
        if (!cookies) {
            await Actor.exit('Cookies tidak valid', { exitCode: 1 });
            return;
        }
        await page.context().addCookies(cookies);

        const queryIdPromise = new Promise<string>((resolve) => {
            page.on('response', (response) => {
                const url = response.url();
                if (url.includes('SearchTimeline')) {
                    const id = extractQueryId(url, 'SearchTimeline');
                    if (id) resolve(id);
                }
            });
        });

        log.info(`Navigating: ${request.url}`);
        await page.goto(request.url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        const capturedQueryId = await Promise.race([
            queryIdPromise,
            new Promise<string>((_, reject) => setTimeout(() => reject('Timeout'), 30000)),
        ]).catch(() => null);

        if (!capturedQueryId) {
            log.error('Gagal menangkap QueryId, menutup crawler.');
            return;
        }

        log.info(`QueryId captured: ${capturedQueryId}. Fetching data...`);

        const collectedTweets = new Map<string, any>();

        try {
            const tweets = await fetchSearch({
                searchTerm: input.searchTerm,
                limit: MAX_ITEMS,
                queryId: capturedQueryId,
            });

            collectTweetsFromSearchTimelineResponse(tweets, input.maxItems ?? 10, collectedTweets);

            const allTweetsInCrawl = Array.from(collectedTweets.values()).slice(0, input.maxItems ?? 10);

            if (allTweetsInCrawl.length > 0) {
                await Actor.pushData(allTweetsInCrawl);
                console.log(`Saved ${allTweetsInCrawl.length} tweets.`);
            }
        } catch (err) {
            log.error('Error saat fetchSearch:');
        }
    },
});

const rawQuery: string = `${input.searchTerm} lang:in`;
await crawler.run([`https://x.com/search?q=${encodeURIComponent(rawQuery)}&src=top`]);
await Actor.exit();

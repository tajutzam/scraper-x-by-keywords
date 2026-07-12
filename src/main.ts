import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

await Actor.init();

interface Input {
    keyword?: string;
    maxRequestsPerCrawl?: number;
    cookies: string;
}

const {
    keyword = 'jampidsus febrie adriansyah',
    maxRequestsPerCrawl = 100,
    cookies: cookiesRaw,
} = (await Actor.getInput<Input>()) ?? ({} as Input);

if (!cookiesRaw) {
    console.error("Cookies tidak ditemukan! Isi field 'cookies' di Actor input dengan JSON array cookies kamu.");
    await Actor.exit('Missing cookies', { exitCode: 1 });
    process.exit(1);
}

let cookies = cookiesRaw;

const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new PlaywrightCrawler({
    proxyConfiguration,
    maxRequestsPerCrawl,
    headless: true,

    async requestHandler({ page, request }) {
        await page.context().addCookies(cookies as any);
        console.log(`Membuka: ${request.url}`);
        await page.goto(request.url);

        let allTweetsInCrawl: any[] = [];

        page.on('response', async (response) => {
            if (response.url().includes('SearchTimeline')) {
                try {
                    const fullJsonResponse = await response.json();
                    const instructions =
                        fullJsonResponse.data?.search_by_raw_query?.search_timeline?.timeline?.instructions || [];

                    for (const instruction of instructions) {
                        if (instruction.type === 'TimelineAddEntries') {
                            for (const entry of instruction.entries || []) {
                                const tweetResult = entry.content?.itemContent?.tweet_results?.result;
                                if (tweetResult && tweetResult.__typename === 'Tweet') {
                                    const legacy = tweetResult.legacy;
                                    const user = tweetResult.core?.user_results?.result?.legacy;
                                    const userId = tweetResult.core?.user_results?.result?.rest_id;

                                    allTweetsInCrawl.push({
                                        type: 'tweet',
                                        id: tweetResult.rest_id,
                                        url: `https://x.com/${user?.screen_name}/status/${tweetResult.rest_id}`,
                                        twitterUrl: `https://twitter.com/${user?.screen_name}/status/${tweetResult.rest_id}`,
                                        text: legacy?.full_text,
                                        source: legacy?.source,
                                        retweetCount: legacy?.retweet_count,
                                        replyCount: legacy?.reply_count,
                                        likeCount: legacy?.favorite_count,
                                        quoteCount: legacy?.quote_count,
                                        viewCount: tweetResult.views?.count,
                                        createdAt: legacy?.created_at,
                                        lang: legacy?.lang,
                                        bookmarkCount: legacy?.bookmark_count,
                                        isReply: !!legacy?.in_reply_to_status_id_str,
                                        inReplyToId: legacy?.in_reply_to_status_id_str || null,
                                        conversationId: legacy?.conversation_id_str,
                                        inReplyToUserId: legacy?.in_reply_to_user_id_str || null,
                                        inReplyToUsername: legacy?.in_reply_to_screen_name || null,
                                        isPinned: false,
                                        author: {
                                            type: 'user',
                                            userName: user?.screen_name,
                                            url: `https://x.com/${user?.screen_name}`,
                                            twitterUrl: `https://twitter.com/${user?.screen_name}`,
                                            id: userId,
                                            name: user?.name,
                                            isVerified: user?.verified,
                                            isBlueVerified: user?.is_blue_verified,
                                            profilePicture: user?.profile_image_url_https,
                                            coverPicture: user?.profile_banner_url,
                                            description: user?.description,
                                            location: user?.location,
                                            followers: user?.followers_count,
                                            following: user?.friends_count,
                                            status: '',
                                            canDm: false,
                                            canMediaTag: false,
                                            createdAt: user?.created_at,
                                            entities: { description: { urls: [] }, url: {} },
                                            fastFollowersCount: 0,
                                            favouritesCount: user?.favourites_count,
                                            hasCustomTimelines: true,
                                            isTranslator: false,
                                            mediaCount: user?.media_count,
                                            statusesCount: user?.statuses_count,
                                            withheldInCountries: [],
                                            affiliatesHighlightedLabel: {},
                                            possiblySensitive: user?.possibly_sensitive,
                                            pinnedTweetIds: [],
                                            profile_bio: {
                                                description: user?.description,
                                                entities: { description: { user_mentions: [] }, url: { urls: [] } },
                                            },
                                        },
                                        extendedEntities: {},
                                        card: {},
                                        place: {},
                                        entities: {},
                                        isRetweet: !!legacy?.retweeted_status_id_str,
                                        isQuote: !!legacy?.quoted_status_id_str,
                                        media: [],
                                        isConversationControlled: false,
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error('Gagal memproses JSON response');
                }
            }
        });

        for (let i = 0; i < 5; i++) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(3000);
        }

        if (allTweetsInCrawl.length > 0) {
            await Actor.pushData(allTweetsInCrawl);
            console.log(`Berhasil menyimpan ${allTweetsInCrawl.length} tweet.`);
        }
    },
});

const encodedKeyword = encodeURIComponent(keyword);
await crawler.run([`https://x.com/search?q=${encodedKeyword}&f=top`]);

await Actor.exit();

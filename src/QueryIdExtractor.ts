import got from 'got';
import { AuthService } from './services/auth.js';
import { ResponseSearchQuery } from './interfaces/Response.js';

interface SearchOptions {
    searchTerm: string;
    limit: number;
    queryId: string;
}

export async function fetchSearch({ searchTerm, limit, queryId }: SearchOptions) {
    const cookies = await AuthService.getCookies();
    if (!cookies) throw new Error('Cookies tidak ditemukan');

    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
    const ct0 = cookies.find((c) => c.name === 'ct0')?.value;
    if (!ct0) throw new Error('Token ct0 tidak ditemukan dalam cookies');

    const client = got.extend({
        headers: {
            authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            cookie: cookieHeader,
            'x-csrf-token': ct0,
            'content-type': 'application/json',
            'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        },
        responseType: 'json',
    });

    const allResponses: any[] = [];
    let collectedCount = 0;
    let cursor: string | undefined = undefined;

    console.log(`Mulai scraping: "${searchTerm}" dengan limit ${limit}`);

    while (collectedCount < limit) {
        await new Promise((r) => setTimeout(r, 1500));

        try {
            const res: any = await client.post(`https://x.com/i/api/graphql/${queryId}/SearchTimeline`, {
                json: {
                    variables: {
                        rawQuery: `${searchTerm}`,
                        count: 50,
                        product: 'Latest',
                        ...(cursor && { cursor }),
                    },
                    features: {
                        rweb_video_screen_enabled: false,
                        rweb_cashtags_enabled: true,
                        profile_label_improvements_pcf_label_in_post_enabled: true,
                        responsive_web_profile_redirect_enabled: false,
                        rweb_tipjar_consumption_enabled: false,
                        verified_phone_label_enabled: false,
                        creator_subscriptions_tweet_preview_api_enabled: true,
                        responsive_web_graphql_timeline_navigation_enabled: true,
                        responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
                        premium_content_api_read_enabled: false,
                        communities_web_enable_tweet_community_results_fetch: true,
                        c9s_tweet_anatomy_moderator_badge_enabled: true,
                        responsive_web_grok_analyze_button_fetch_trends_enabled: false,
                        responsive_web_grok_analyze_post_followups_enabled: true,
                        rweb_cashtags_composer_attachment_enabled: true,
                        responsive_web_jetfuel_frame: true,
                        responsive_web_grok_share_attachment_enabled: true,
                        responsive_web_grok_annotations_enabled: true,
                        articles_preview_enabled: true,
                        responsive_web_edit_tweet_api_enabled: true,
                        rweb_conversational_replies_downvote_enabled: false,
                        graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
                        view_counts_everywhere_api_enabled: true,
                        longform_notetweets_consumption_enabled: true,
                        responsive_web_twitter_article_tweet_consumption_enabled: true,
                        content_disclosure_indicator_enabled: true,
                        content_disclosure_ai_generated_indicator_enabled: true,
                        responsive_web_grok_show_grok_translated_post: true,
                        responsive_web_grok_analysis_button_from_backend: true,
                        post_ctas_fetch_enabled: false,
                        freedom_of_speech_not_reach_fetch_enabled: true,
                        standardized_nudges_misinfo: true,
                        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
                        longform_notetweets_rich_text_read_enabled: true,
                        longform_notetweets_inline_media_enabled: false,
                        responsive_web_grok_image_annotation_enabled: true,
                        responsive_web_grok_imagine_annotation_enabled: true,
                        responsive_web_grok_community_note_auto_translation_is_enabled: true,
                        responsive_web_enhance_cards_enabled: false,
                    },
                },
            });

            const data: ResponseSearchQuery = res.body;
            allResponses.push(data);

            const instructions = data.data?.search_by_raw_query?.search_timeline?.timeline?.instructions || [];
            const addEntries = instructions.find((i: any) => i.type === 'TimelineAddEntries');
            const entries = addEntries?.entries || [];

            const tweetCountInPage = entries.filter((e: any) => e.entryId.startsWith('tweet-')).length;
            collectedCount += tweetCountInPage;

            const cursorEntry = entries.find((e: any) => e.entryId.startsWith('cursor-bottom'));
            cursor = cursorEntry?.content?.value;

            console.log(
                `Dapat ${tweetCountInPage} item. Total: ${collectedCount}. Cursor: ${cursor ? 'Active' : 'None'}`,
            );

            if (collectedCount >= limit || !cursor || tweetCountInPage === 0) break;
        } catch (error) {
            console.error('Fetch error:', error);
            break;
        }
    }
    return allResponses;
}

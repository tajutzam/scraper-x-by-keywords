
export function mapTweetResult(tweetResult: any) {
    const legacy = tweetResult.legacy;
    const userResult = tweetResult.core?.user_results?.result;
    const userCore = userResult?.core;
    const userLegacy = userResult?.legacy;
    const userId = userResult?.rest_id;
    const tweetId = tweetResult.rest_id;

    return {
        type: 'tweet',
        id: tweetId,
        url: `https://x.com/${userCore?.screen_name}/status/${tweetId}`,
        twitterUrl: `https://twitter.com/${userCore?.screen_name}/status/${tweetId}`,
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
            userName: userCore?.screen_name,
            url: `https://x.com/${userCore?.screen_name}`,
            twitterUrl: `https://twitter.com/${userCore?.screen_name}`,
            id: userId,
            name: userCore?.name,
            isVerified: userResult?.verification?.verified,
            isBlueVerified: userResult?.is_blue_verified,
            profilePicture: userResult?.avatar?.image_url,
            coverPicture: userLegacy?.profile_banner_url,
            description: userLegacy?.description,
            location: userResult?.location?.location,
            followers: userLegacy?.followers_count,
            following: userLegacy?.friends_count,
            status: '',
            canDm: userResult?.dm_permissions?.can_dm ?? false,
            canMediaTag: userResult?.media_permissions?.can_media_tag ?? false,
            createdAt: userCore?.created_at,
            entities: { description: { urls: [] }, url: {} },
            fastFollowersCount: userLegacy?.fast_followers_count ?? 0,
            favouritesCount: userLegacy?.favourites_count,
            hasCustomTimelines: userLegacy?.has_custom_timelines ?? true,
            isTranslator: userLegacy?.is_translator ?? false,
            mediaCount: userLegacy?.media_count,
            statusesCount: userLegacy?.statuses_count,
            withheldInCountries: [],
            affiliatesHighlightedLabel: userResult?.affiliates_highlighted_label ?? {},
            possiblySensitive: userLegacy?.possibly_sensitive,
            pinnedTweetIds: [],
            profile_bio: {
                description: userLegacy?.description,
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
    };
}


export function collectTweetsFromSearchTimelineResponse(
    fullJsonResponse: any,
    maxItems: number,
    collectedTweets: Map<string, any>,
): void {
    const instructions =
        fullJsonResponse.data?.search_by_raw_query?.search_timeline?.timeline?.instructions || [];

    for (const instruction of instructions) {
        if (instruction.type !== 'TimelineAddEntries') continue;

        for (const entry of instruction.entries || []) {
            if (collectedTweets.size >= maxItems) return;

            const tweetResult = entry.content?.itemContent?.tweet_results?.result;
            if (!tweetResult || tweetResult.__typename !== 'Tweet') continue;

            const tweetId = tweetResult.rest_id;
            if (collectedTweets.has(tweetId)) continue;

            collectedTweets.set(tweetId, mapTweetResult(tweetResult));
        }
    }
}

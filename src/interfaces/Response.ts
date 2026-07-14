export interface ResponseSearchQuery {
  data: Data4;
}

interface Data4 {
  search_by_raw_query: Searchbyrawquery;
}

interface Searchbyrawquery {
  search_timeline: Searchtimeline;
}

interface Searchtimeline {
  timeline: Timeline;
}

interface Timeline {
  instructions: Instruction[];
  responseObjects: ResponseObjects;
}

interface ResponseObjects {
  feedbackActions: FeedbackAction[];
}

interface FeedbackAction {
  key: string;
  value: Value2;
}

interface Value2 {
  childKeys?: string[];
  clientEventInfo: ClientEventInfo2;
  confirmation: string;
  confirmationDisplayType: string;
  feedbackType: string;
  hasUndoAction: boolean;
  icon?: string;
  prompt: string;
}

interface ClientEventInfo2 {
  action: string;
  component: string;
  element: string;
}

interface Instruction {
  entries: Entry[];
  type: string;
}

interface Entry {
  content: Content2;
  entryId: string;
  sortIndex: string;
}

interface Content2 {
  __typename: string;
  clientEventInfo?: ClientEventInfo;
  entryType: string;
  feedbackInfo?: FeedbackInfo;
  itemContent?: ItemContent;
  cursorType?: string;
  value?: string;
}

interface ItemContent {
  __typename: string;
  itemType: string;
  tweetDisplayType?: string;
  tweet_results?: Tweetresults;
  clientEventInfo?: ClientEventInfo;
  content?: Content;
  highlights?: Highlights;
}

interface Highlights {
  textHighlights: TextHighlight[];
}

interface TextHighlight {
  endIndex: number;
  startIndex: number;
}

interface Content {
  confirmation: string;
  contentType: string;
  displayType: string;
  isRelevantCallback: IsRelevantCallback;
  isRelevantText: string;
  notRelevantCallback: IsRelevantCallback;
  notRelevantText: string;
  title: string;
}

interface IsRelevantCallback {
  endpoint: string;
}

interface Tweetresults {
  result: Result6;
}

interface Result6 {
  __typename: string;
  cashtag_attachments: any[];
  core: Core2;
  edit_control: Editcontrol;
  grok_analysis_button: boolean;
  grok_annotations: Grokannotations;
  grok_translated_post_with_availability: Groktranslatedpostwithavailability;
  is_translatable: boolean;
  legacy: Legacy2;
  rest_id: string;
  source: string;
  unmention_data: Affiliateshighlightedlabel;
  views: Views;
  note_tweet?: Notetweet;
  previous_counts?: Previouscounts;
  quoted_status_result?: Quotedstatusresult;
}

interface Quotedstatusresult {
  result: Result5;
}

interface Result5 {
  __typename: string;
  core: Core3;
  edit_control: Editcontrolinitial;
  grok_analysis_button: boolean;
  grok_translated_post_with_availability: Groktranslatedpostwithavailability2;
  is_translatable: boolean;
  legacy: Legacy4;
  rest_id: string;
  source: string;
  unmention_data: Affiliateshighlightedlabel;
  views: Views2;
  card?: Card;
}

interface Card {
  legacy: Legacy5;
  rest_id: string;
}

interface Legacy5 {
  binding_values: Bindingvalue[];
  card_platform: Cardplatform;
  name: string;
  url: string;
  user_refs_results: any[];
}

interface Cardplatform {
  platform: Platform;
}

interface Platform {
  audience: Audience;
  device: Device;
}

interface Device {
  name: string;
  version: string;
}

interface Audience {
  name: string;
}

interface Bindingvalue {
  key: string;
  value: Value;
}

interface Value {
  image_value?: Imagevalue;
  type: string;
  string_value?: string;
  scribe_key?: string;
  image_color_value?: Imagecolorvalue;
}

interface Imagecolorvalue {
  palette: Palette[];
}

interface Palette {
  percentage: number;
  rgb: Rgb;
}

interface Rgb {
  blue: number;
  green: number;
  red: number;
}

interface Imagevalue {
  height: number;
  url: string;
  width: number;
}

interface Views2 {
  count: string;
  state: string;
}

interface Legacy4 {
  bookmark_count: number;
  bookmarked: boolean;
  conversation_id_str: string;
  created_at: string;
  display_text_range: number[];
  entities: Entities7;
  extended_entities?: Extendedentities2;
  favorite_count: number;
  favorited: boolean;
  full_text: string;
  id_str: string;
  is_quote_status: boolean;
  lang: string;
  possibly_sensitive: boolean;
  possibly_sensitive_editable: boolean;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  retweeted: boolean;
  user_id_str: string;
}

interface Extendedentities2 {
  media: Media2[];
}

interface Entities7 {
  media?: Media2[];
  urls?: Url[];
}

interface Media2 {
  allow_download_status: Allowdownloadstatus;
  display_url: string;
  expanded_url: string;
  ext_media_availability: Extmediaavailability;
  features: Features2;
  id_str: string;
  indices: number[];
  media_key: string;
  media_results: Mediaresults;
  media_url_https: string;
  original_info: Originalinfo2;
  sizes: Sizes;
  type: string;
  url: string;
}

interface Originalinfo2 {
  focus_rects: Focusrect[];
  height: number;
  width: number;
}

interface Features2 {
  all: All;
  large: Large3;
  medium: Large3;
  orig: Large3;
  small: Large3;
}

interface Large3 {
  faces: Focusrect[];
}

interface All {
  tags: Tag[];
}

interface Tag {
  name: string;
  screen_name: string;
  type: string;
  user_id: string;
}

interface Groktranslatedpostwithavailability2 {
  data?: Data3;
  is_available: boolean;
}

interface Data3 {
  associated_data: Affiliateshighlightedlabel;
  destination_language: string;
  entities: Entities6;
  source_language: string;
  translation: string;
}

interface Entities6 {
  hashtags: any[];
  symbols: any[];
  urls: any[];
  user_mentions: any[];
}

interface Core3 {
  user_results: Userresults2;
}

interface Userresults2 {
  result: Result4;
}

interface Result4 {
  __typename: string;
  affiliates_highlighted_label: Affiliateshighlightedlabel;
  avatar: Avatar;
  core: Core;
  dm_permissions: Dmpermissions;
  follow_request_sent: boolean;
  grok_translated_bio_with_availability: Groktranslatedbiowithavailability2;
  has_graduated_access: boolean;
  id: string;
  is_blue_verified: boolean;
  legacy: Legacy3;
  location: Location;
  media_permissions: Mediapermissions;
  parody_commentary_fan_label: string;
  privacy: Privacy;
  profile_bio: Profilebio;
  profile_description_language: string;
  profile_image_shape: string;
  relationship_perspectives: Relationshipperspectives;
  rest_id: string;
  super_follow_eligible: boolean;
  super_followed_by: boolean;
  super_following: boolean;
  verification: Verification2;
}

interface Verification2 {
  verified: boolean;
}

interface Legacy3 {
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: Entities5;
  fast_followers_count: number;
  favourites_count: number;
  follow_request_sent: boolean;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  media_count: number;
  needs_phone_verification: boolean;
  normal_followers_count: number;
  notifications: boolean;
  possibly_sensitive: boolean;
  profile_banner_url: string;
  profile_interstitial_type: string;
  statuses_count: number;
  time_zone: string;
  translator_type: string;
  url: string;
  utc_offset: number;
  want_retweets: boolean;
  withheld_description: string;
  withheld_scope: string;
  pinned_tweet_ids_str?: string[];
}

interface Entities5 {
  description: Affiliateshighlightedlabel;
  url: Url2;
}

interface Groktranslatedbiowithavailability2 {
  is_available: boolean;
}

interface Previouscounts {
  bookmark_count: number;
  favorite_count: number;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
}

interface Notetweet {
  is_expandable: boolean;
  note_tweet_results: Notetweetresults;
}

interface Notetweetresults {
  result: Result3;
}

interface Result3 {
  entity_set: Entityset;
  id: string;
  text: string;
}

interface Entityset {
  hashtags: Hashtag[];
  smarttags: any[];
  symbols: any[];
  urls: Url[];
  user_mentions: Usermention2[];
  timestamps?: any[];
}

interface Views {
  count?: string;
  state: string;
}

interface Legacy2 {
  bookmark_count: number;
  bookmarked: boolean;
  conversation_id_str: string;
  created_at: string;
  display_text_range: number[];
  entities: Entities4;
  extended_entities?: Extendedentities;
  favorite_count: number;
  favorited: boolean;
  full_text: string;
  id_str: string;
  is_quote_status: boolean;
  lang: string;
  possibly_sensitive?: boolean;
  possibly_sensitive_editable?: boolean;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  retweeted: boolean;
  user_id_str: string;
  quoted_status_id_str?: string;
  quoted_status_permalink?: Quotedstatuspermalink;
}

interface Quotedstatuspermalink {
  display: string;
  expanded: string;
  url: string;
}

interface Extendedentities {
  media: Media[];
}

interface Entities4 {
  hashtags?: Hashtag[];
  media?: Media[];
  user_mentions?: Usermention2[];
}

interface Usermention2 {
  id_str: string;
  indices: number[];
  name: string;
  screen_name: string;
}

interface Media {
  additional_media_info?: Additionalmediainfo;
  display_url: string;
  expanded_url: string;
  ext_media_availability: Extmediaavailability;
  id_str: string;
  indices: number[];
  media_key: string;
  media_results: Mediaresults;
  media_url_https: string;
  original_info: Originalinfo;
  sizes: Sizes;
  type: string;
  url: string;
  video_info?: Videoinfo;
  features?: Features;
  allow_download_status?: Allowdownloadstatus;
  ext_alt_text?: string;
}

interface Allowdownloadstatus {
  allow_download: boolean;
}

interface Features {
  large: Large2;
  medium: Large2;
  orig: Large2;
  small: Large2;
}

interface Large2 {
  faces: any[];
}

interface Videoinfo {
  aspect_ratio: number[];
  variants: Variant[];
}

interface Variant {
  bitrate: number;
  content_type: string;
  url: string;
}

interface Sizes {
  large: Large;
  medium: Large;
  small: Large;
  thumb: Large;
}

interface Large {
  h: number;
  resize: string;
  w: number;
}

interface Originalinfo {
  focus_rects: (Focusrect | Focusrect)[];
  height: number;
  width: number;
}

interface Focusrect {
  h: number;
  w: number;
  x: number;
  y: number;
}

interface Mediaresults {
  result: Result2;
}

interface Result2 {
  media_key: string;
}

interface Extmediaavailability {
  status: string;
}

interface Additionalmediainfo {
  monetizable: boolean;
}

interface Groktranslatedpostwithavailability {
  data?: Data2;
  is_available: boolean;
}

interface Data2 {
  associated_data: Affiliateshighlightedlabel;
  destination_language: string;
  entities: Entities3;
  source_language: string;
  translation: string;
  preview_translation?: string;
}

interface Entities3 {
  hashtags: Hashtag[];
  symbols: any[];
  urls: any[];
  user_mentions: Usermention[];
}

interface Hashtag {
  indices: number[];
  text: string;
}

interface Grokannotations {
  is_image_editable_by_grok?: boolean;
}

interface Editcontrol {
  edit_tweet_ids?: string[];
  editable_until_msecs?: string;
  edits_remaining?: string;
  is_edit_eligible?: boolean;
  edit_control_initial?: Editcontrolinitial;
  initial_tweet_id?: string;
}

interface Editcontrolinitial {
  edit_tweet_ids: string[];
  editable_until_msecs: string;
  edits_remaining: string;
  is_edit_eligible: boolean;
}

interface Core2 {
  user_results: Userresults;
}

interface Userresults {
  result: Result;
}

interface Result {
  __typename: string;
  affiliates_highlighted_label: Affiliateshighlightedlabel;
  avatar: Avatar;
  core: Core;
  dm_permissions: Dmpermissions;
  follow_request_sent: boolean;
  grok_translated_bio_with_availability: Groktranslatedbiowithavailability;
  has_graduated_access: boolean;
  id: string;
  is_blue_verified: boolean;
  legacy: Legacy;
  location: Location;
  media_permissions: Mediapermissions;
  parody_commentary_fan_label: string;
  privacy: Privacy;
  profile_bio: Profilebio;
  profile_description_language?: string;
  profile_image_shape: string;
  relationship_perspectives: Relationshipperspectives;
  rest_id: string;
  super_follow_eligible: boolean;
  super_followed_by: boolean;
  super_following: boolean;
  verification: Verification;
  professional?: Professional;
}

interface Professional {
  category: Category[];
  professional_type: string;
  rest_id: string;
}

interface Category {
  icon_name: string;
  id: number;
  name: string;
}

interface Verification {
  verified: boolean;
  verified_type?: string;
}

interface Relationshipperspectives {
  blocked_by: boolean;
  blocking: boolean;
  followed_by: boolean;
  following: boolean;
  live_following: boolean;
  muting: boolean;
}

interface Profilebio {
  description: string;
}

interface Privacy {
  protected: boolean;
}

interface Mediapermissions {
  can_media_tag: boolean;
}

interface Location {
  location: string;
}

interface Legacy {
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: Entities2;
  fast_followers_count: number;
  favourites_count: number;
  follow_request_sent: boolean;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  media_count: number;
  needs_phone_verification: boolean;
  normal_followers_count: number;
  notifications: boolean;
  pinned_tweet_ids_str?: string[];
  possibly_sensitive: boolean;
  profile_banner_url: string;
  profile_interstitial_type: string;
  statuses_count: number;
  time_zone: string;
  translator_type: string;
  url: string;
  utc_offset: number;
  want_retweets: boolean;
  withheld_description: string;
  withheld_scope: string;
}

interface Entities2 {
  description: Affiliateshighlightedlabel;
  url?: Url2;
}

interface Url2 {
  urls: Url[];
}

interface Url {
  display_url: string;
  expanded_url: string;
  indices: number[];
  url: string;
}

interface Groktranslatedbiowithavailability {
  is_available: boolean;
  data?: Data;
}

interface Data {
  destination_language: string;
  entities: Entities;
  source_language: string;
  translation: string;
}

interface Entities {
  hashtags: any[];
  symbols: any[];
  urls: any[];
  user_mentions: Usermention[];
}

interface Usermention {
  id: string;
  id_str: string;
  indices: number[];
  name: string;
  screen_name: string;
}

interface Dmpermissions {
  can_dm: boolean;
}

interface Core {
  created_at: string;
  name: string;
  screen_name: string;
}

interface Avatar {
  image_url: string;
}

interface Affiliateshighlightedlabel {
}

interface FeedbackInfo {
  feedbackKeys: string[];
}

interface ClientEventInfo {
  component: string;
  details: Details;
  element: string;
}

interface Details {
  timelinesDetails: TimelinesDetails;
}

interface TimelinesDetails {
  controllerData: string;
}

/**
 * The email regex has complex constraints compliant with RFC 5322 standards. More details can be found [here](https://emailregex.com/).
 */
export const emailRegex: RegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * The password regex has the following constraints
 * - min. 8 chars, max. 120 chars ({8,120})
 * - at least one numeric digit ([0-9])
 * - at least one lowercase letter ([a-z])
 * - at least one uppercase letter ([A-Z])
 * - at least one special character ([^a-zA-z0-9])
 */
export const passwordRegex: RegExp =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,120}$/;

/**
 * The username regex has the following constraints
 * - min. 3 chars, max. 30 chars ({6,30})
 * - match only alphanumerics, underscores, and periods
 */
export const usernameRegex: RegExp = /^[a-zA-Z0-9_.]{3,30}$/;

/**
 * The name regex has the following constraints
 * - min. 2 chars, max. 20 chars ({2,20})
 * - match alphanumerics, apostrophes, commas, periods, dashes, and spaces
 */
export const nameRegex: RegExp = /^[A-Za-z'\-,. ]{2,20}$/;

export const fullNameRegex: RegExp = /^[a-zA-Z',.-]+ ([a-zA-Z',.-]+ *){2,30}$/;

/**
 * The website regex has the following constraints
 * - starts with http:// or https://
 * - min. 2 chars, max. 50 chars on website name
 * - match alphanumerics, and special characters used in URLs
 */
export const websiteRegex: RegExp =
  /^$|^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,50}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]{0,35})$/;

/**
 * The website regex has the following constraints
 * - max. 75 chars for bio
 * - match alphanumerics, and special characters used in URLs
 */
export const bioRegex: RegExp = /^[\s\S]{1,75}$/;

/**
 * The gender regex has the following constraints
 * - max. 20 chars for bio
 * - match alphanumerics, hyphens, and whitespaces
 */
export const genderRegex: RegExp = /^$|^[A-Za-z\- ]{2,20}$/;

/**
 * The phone regex has the following constraints
 *  - must be 10 digits
 *  - accepts 0123456789
 *
 */
export const phoneRegex: RegExp = /^[0-9]{10}$/;

/**
 * The code regex has the following constraints
 *  - must be 6 digits
 */
export const codeRegex = /^[0-9]{4}$/;

/**
 * TAGG URL REGEX
 */
export const APPLE_MUSIC = /^(http|https)?:\/\/(?:www\.)?music\.apple\.com(?:.*|\/*\/*|\/*)?/i;

export const YOUTUBE =
  /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/)|(youtube\.com\/watch\?v=)|(youtube\.com\/channel\/)|(youtube\.com\/c\/)|(youtube\.com\/user\/)|(youtu.be\/))([a-zA-Z0-9\-_])+/i;
export const SOUNDCLOUD = /^https?:\/\/(soundcloud\.app\.goo\.gl|soundcloud\.com)\/(.*)$/;
export const SPOTIFY = /^(http|https)?:\/\/(?:www\.)?open.spotify\.com(?:.*|\/)(?:\S+)?$/i;
export const TIK_TOK = /^(http|https)?:\/\/(?:www\.)?(?:vm\.)?tiktok\.com\/.*(?=((\w|-)))/i;
export const FACEBOOK = /^[ A-Za-z0-9_@.]*$/i;
export const INSTA_GRAM = /^[ A-Za-z0-9_@.]*$/i;
export const SNAPCHAT = /^[ A-Za-z0-9_@.]*$/i;
export const TWITTER = /^[ A-Za-z0-9_@.]*$/i;
export const TWITCH = /^(http|https)?:\/\/(?:www\.)?twitch\.tv\/.*(?=((\w|-)))/i;
export const APP_STORE = /^(http|https)?:\/\/(?:www\.)?apps.apple\.com\/.*(?=((\w|-)))/i;
export const APPLE_PODCAST = /^(http|https)?:\/\/(?:www\.)?podcasts.apple\.com\/.*(?=((\w|-)))/i;
export const DEPOP = /^(http|https)?:\/\/(?:www\.)?depop\.(com|app.link)\/.*(?=((\w|-)))/i;
//export const ETSY = /^(http|https)?:\/\/(?:www\.)?etsy\.com|me\/.*(?=((\w|-)))/i;
//eslint-disable-next-line
export const ETSY = 'www\.etsy\.com|me';
export const SHOPIFY = /^(http|https)?:\/\/(?:www\.)?shopify\.com\/.*(?=((\w|-)))/i;
export const POSHMARK = /^(http|https)?:\/\/(?:www\.)?poshmark|posh\.com|mk\/.*(?=((\w|-)))/i;
export const AMAZON =
  /^(http|https)?:\/\/(www|smile)\.amazon\.(com|in)\/(?:(?:[\w-]+\/)?(?:dp|gp\/product)\/(\w{10})\/)?/;
export const WEBSITE =
  /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

export const HEX_COLOR = /^#([0-9A-F]{3}){1,2}$/i;

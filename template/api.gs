/**
 * Habitica: GAS Template v1.2.1 by @Turac
 *
 * See GitHub page for info & setup instructions:
 * https://github.com/ramotar/habitica-gas-template
 */

/**
 * Define regular expression to test user ID and API tokens
 */
const TOKEN_REGEXP = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$");

/**
 * Define internal constants for USER_ID and API_TOKEN as well as AUTHOR_ID and SCRIPT_NAME
 *
 * Those are used for development purposes to prevent leakage of developer secrets.
 */
const INT_USER_ID = (typeof DEVELOPER_ID === "undefined" ? USER_ID : DEVELOPER_ID);
const INT_API_TOKEN = (typeof DEVELOPER_API_TOKEN === "undefined" ? API_TOKEN : DEVELOPER_API_TOKEN);
const INT_AUTHOR_ID = (typeof DEVELOPER_ID === "undefined" ? AUTHOR_ID : DEVELOPER_ID);
const INT_SCRIPT_NAME = (typeof DEVELOPER_SCRIPT_NAME === "undefined" ? SCRIPT_NAME : DEVELOPER_SCRIPT_NAME);

/**
 * Define the headers for API calls
 */
const HEADERS = {
  "x-client": INT_AUTHOR_ID + "-" + INT_SCRIPT_NAME,
  "x-api-user": INT_USER_ID,
  "x-api-key": INT_API_TOKEN,
}
const PARAMS = {
  "headers": HEADERS,
  "muteHttpExceptions": true
}
const GET_PARAMS = Object.assign({ "method": "get" }, PARAMS);
const POST_PARAMS = Object.assign({ "method": "post" }, PARAMS);
const DELETE_PARAMS = Object.assign({ "method": "delete" }, PARAMS);

/**
 * class RateLimit
 *
 * Class to handle the values returned by Habitica's rate limiting.
 */
class RateLimit {
  constructor(headers) {
    if (headers !== null) {
      this.update(headers);
    } else {
      this.limit = 30;
      this.remaining = 30;
      this.reset = new Date();
      this.retryAfter = null;
    }
  }

  get reached() {
    return (this.remaining === 0);
  }

  update(headers) {
    this.limit = Number(headers["x-ratelimit-limit"]);
    this.remaining = Number(headers["x-ratelimit-remaining"]);
    this.reset = new Date(headers["x-ratelimit-reset"]);

    let retryAfter = headers["Retry-After"];
    if (retryAfter !== undefined) {
      this.retryAfter = Number(retryAfter);
    }
    else {
      this.retryAfter = null;
    }

    logDebug("RateLimit.update()\n\n", this);
  }

  msToReset() {
    let now = new Date();
    return Math.max(this.reset.getTime() - now.getTime() + 500, 0);
  }

  sleepToReset() {
    Utilities.sleep(this.msToReset());
  }

  spaceOutCalls() {
    Utilities.sleep(this.msToReset() / (this.remaining + 1));
  }
}

let rateLimit = new RateLimit(null);


/**
 * api_fetch(url, params, instant [optional], maxAttempts [optional])
 *
 * Wrapper for Google Apps Script's UrlFetchApp.fetch(url, params):
 * https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchurl,-params
 *
 * Retries failed API calls, if the addressed server is down and
 * up to a total number of attempts defined by optional parameter maxAttempts.
 *
 * Also handles Habitica's rate limiting.
 */
function api_fetch(url, params, instant = false, maxAttempts = 3) {
  var response;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {

    // if rate limit reached
    if (rateLimit.reached) {
      // wait until rate limit reset
      rateLimit.sleepToReset();
    }
    // space out API calls
    else if (!instant) {
      rateLimit.spaceOutCalls();
    }

    // call API
    response = UrlFetchApp.fetch(url, params);

    // store rate limiting data
    rateLimit.update(response.getHeaders());

    // if success, return response
    if (
      response.getResponseCode() < 300
      || (
        response.getResponseCode() === 404
        && (url === "https://habitica.com/api/v3/groups/party" || url.startsWith("https://habitica.com/api/v3/groups/party/members"))
      )
    ) {
      return response;
    }

    // if rate limited due to running multiple scripts, try again
    if (response.getResponseCode() === 429) {
      // no need to wait, since rate limiting will take care
      continue;
    }
    // if 3xx or 4xx, do not retry
    if (response.getResponseCode() < 500) {
      break;
    }
    // if 5xx server error, try again after 5 seconds
    if (response.getResponseCode() >= 500) {
      if (attempt < maxAttempts - 1) {
        Utilities.sleep(5000);
      }
      continue;
    }
  }

  let domain = url.split("/", 3).join("/");

  // if request failed finally, throw exception
  throw new Error(
    "Request failed for " + domain + " returned code " + response.getResponseCode() + ". Truncated server response: " + response.getContentText(),
    { cause: response }
  );
}

/**
 * api_sendPM(message, recipient [optional])
 *
 * Sends a personal message to the given recipient.
 * If no recipient is given, sends a message to yourself.
 */
function api_sendPM(message, recipient = INT_USER_ID) {
  if (!TOKEN_REGEXP.test(recipient)) {
    throw new Error(
      "Invalid recipient ID \"" + recipient + "\", doesn't match pattern 12345678-90ab-416b-cdef-1234567890ab",
      { cause: recipient }
    )
  }

  let params = Object.assign({
    "contentType": "application/json",
    "payload": JSON.stringify({
      "message": String(message),
      "toUserId": String(recipient)
    })
  }, POST_PARAMS);

  api_fetch("https://habitica.com/api/v3/members/send-private-message", params);
}

/**
 * api_createWebhook(webhookData)
 *
 * Creates a webhook with the given webhook data.
 * webhookData is an object with key/value pairs as defined by
 * https://habitica.com/apidoc/#api-Webhook
 *
 * The url is filled in automatically and
 * the label is always set to the name of the script.
 */
function api_createWebhook(webhookData) {
  Object.assign(webhookData, {
    "url": getWebAppURL(),
    "label": getScriptName()
  })

  let params = Object.assign({
    "contentType": "application/json",
    "payload": JSON.stringify(webhookData)
  }, POST_PARAMS);

  api_fetch("https://habitica.com/api/v3/user/webhook", params);
}

/**
 * api_getContent(forceFetch [optional])
 *
 * Returns the content data from the Habitica API.
 * The content data is cached by default. Use forceFetch to force
 * a new fetch from the Habitica API and received updated content data.
 */
let _cachedContent;
function api_getContent(forceFetch = false) {
  if (forceFetch || typeof _cachedContent === "undefined") {
    let response = api_fetch("https://habitica.com/api/v3/content", GET_PARAMS);
    let obj = parseJSON(response);
    _cachedContent = obj.data;
  }
  return _cachedContent;
}

/**
 * api_getUser(forceFetch [optional])
 *
 * Returns the user data from the Habitica API.
 * The user data is cached by default. Use forceFetch to force
 * a new fetch from the Habitica API and received updated user data.
 */
let _cachedUser;
function api_getUser(forceFetch = false) {
  if (forceFetch || typeof _cachedUser === "undefined") {
    let response = api_fetch("https://habitica.com/api/v3/user", GET_PARAMS);
    let obj = parseJSON(response);
    _cachedUser = obj.data;
  }
  return _cachedUser;
}

/**
 * api_getParty(forceFetch [optional])
 *
 * Returns the party data from the Habitica API.
 * The party data is cached by default. Use forceFetch to force
 * a new fetch from the Habitica API and received updated party data.
 */
let _cachedParty;
function api_getParty(forceFetch = false) {
  if (forceFetch || typeof _cachedParty === "undefined") {
    let response = api_fetch("https://habitica.com/api/v3/groups/party", GET_PARAMS);
    let obj = parseJSON(response);
    _cachedParty = obj.data;
  }
  return _cachedParty;
}

/**
 * api_getPartyMembers(forceFetch [optional])
 *
 * Returns the party member data from the Habitica API.
 * The party member data is cached by default. Use forceFetch to force
 * a new fetch from the Habitica API and received updated party member data.
 */
let _cachedPartyMembers;
function api_getPartyMembers(forceFetch = false) {
  if (forceFetch || typeof _cachedPartyMembers === "undefined") {
    let response = api_fetch("https://habitica.com/api/v3/groups/party/members?includeAllPublicFields=true", GET_PARAMS);
    let obj = parseJSON(response);
    _cachedPartyMembers = obj.data;
  }
  return _cachedPartyMembers;
}

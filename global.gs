// [Developers] Place your user ID and script name here
// - This is used for the "X-Client" HTTP header
// - See https://habitica.fandom.com/wiki/Guidance_for_Comrades#X-Client_Header
const AUTHOR_ID = "PasteAuthorUserIdHere";
const SCRIPT_NAME = "TypeScriptNameHere";

// [Developers] Add global variables here
// - Note that these do not persist in between script calls
// - If you want to save values between calls, use PropertiesService
// - See https://developers.google.com/apps-script/reference/properties/properties-service
const scriptProperties = PropertiesService.getScriptProperties();

function doPost(e) {
  // [Developers] This is the function that will be executed whenever Habitica
  //   encounters the designated event

  const dataContents = JSON.parse(e.postData.contents);
  const webhookType = dataContents.type;

  // [Developers] Add script actions here

  return HtmlService.createHtmlOutput();
}

// [Developers] No need to edit below this point,
//   but feel free to have a look and tinker with it

const HEADERS = {
  "x-client": (typeof DEVELOPMENT == "undefined" ? AUTHOR_ID + "-" + SCRIPT_NAME : DEVELOPER_ID + "-" + DEVELOPER_SCRIPT_NAME),
  "x-api-user": (typeof DEVELOPMENT == "undefined" ? USER_ID : DEVELOPER_ID),
  "x-api-key": (typeof DEVELOPMENT == "undefined" ? API_TOKEN : DEVELOPER_API_TOKEN),
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
 * api_fetch(url, params, instant [optional], max_attempts [optional])
 *
 * Wrapper for Google Apps Script's UrlFetchApp.fetch(url, params):
 * https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchurl,-params
 *
 * Retries failed API calls, if the addressed server is down and
 * up to a total number of attempts defined by optional parameter max_attempts.
 *
 * Also handles Habitica's rate limiting, if their API is called.
 */
function api_fetch(url, params, instant = false, max_attempts = 3) {
  var response;

  for (let attempt = 0; attempt < max_attempts; attempt++) {

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
    // if 5xx server error, try again after 10 seconds
    if (response.getResponseCode() >= 500) {
      if (attempt < max_attempts - 1) {
        Utilities.sleep(10000);
      }
      continue;
    }
  }

  let domain = url.split("/", 3).join("/");

  // if request failed finally, throw exception
  throw new Error(
    "Request failed for " + domain + " returned code " + response.getResponseCode() + ". Truncated server response: " + response.getContentText()
  );
}

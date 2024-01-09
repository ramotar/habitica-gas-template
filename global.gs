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

// [Developers] No need to edit below this point,
//   but feel free to have a look and tinker with it

const HEADERS = {
  "x-client" : AUTHOR_ID + "-" + SCRIPT_NAME,
  "x-api-user" : USER_ID,
  "x-api-key" : API_TOKEN,
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
    this.limit = Number(headers.get("X-RateLimit-Limit"));
    this.remaining = Number(headers.get("X-RateLimit-Remaining"));
    this.reset = new Date(headers.get("X-RateLimit-Reset"));

    if (headers.has("Retry-After")) {
      this.retryAfter = Number(headers.get("Retry-After"));
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
 * fetch(url, params, max_retries [optional])
 * 
 * Wrapper for Google Apps Script's UrlFetchApp.fetch(url, params):
 * https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#fetchurl,-params
 * 
 * Retries failed API calls, if the addressed server is down and
 * up to a total number of attempts defined by optional parameter max_retries.
 * 
 * Also handles Habitica's rate limiting, if their API is called.
 */
function fetch(url, params, instant = false, max_retries = 3) {
  for (let i = 0; i < max_retries; i++) {
 
    // if rate limit reached
    if (rateLimit.reached) {
      // wait until rate limit reset  
      rateLimit.sleepToReset();

    // space out API calls 
    } else if (!instant) {
      rateLimit.spaceOutCalls();
    }
 
    // call API
    let response;
    while (true) {
      try {
        response = UrlFetchApp.fetch(url, params);
        break;

      // if address unavailable, wait 5 seconds & try again
      } catch (e) {
        if (!webhook && e.stack.includes("Address unavailable")) {
          Utilities.sleep(5000);
        } else {
          throw e;
        }
      }
    }
 
    // store rate limiting data
    rateLimit.update(response.getHeaders());
 
    // if success, return response
    if (response.getResponseCode() < 300 || (response.getResponseCode() === 404 && (url === "https://habitica.com/api/v3/groups/party" || url.startsWith("https://habitica.com/api/v3/groups/party/members")))) {
      return response;

    // if rate limited due to running multiple scripts, try again
    } else if (response.getResponseCode() === 429) {
      i--;

    // if 502 server error, try again after 30 seconds
    } else if (response.getResponseCode() === 502) {
      Utilities.sleep(30000);
      i--;
 
    // if 3xx or 4xx or failed 3 times, throw exception
    } else if (response.getResponseCode() < 500 || i >= 2) {
      throw new Error("Request failed for https://habitica.com returned code " + response.getResponseCode() + ". Truncated server response: " + response.getContentText());
    }
  }
}

function doPost(e) {
  // [Developers] This is the function that will be executed whenever Habitica
  //   encounters the designated event

  const dataContents = JSON.parse(e.postData.contents);
  const webhookType = dataContents.type;

  // [Developers] Add script actions here

  return HtmlService.createHtmlOutput();
}



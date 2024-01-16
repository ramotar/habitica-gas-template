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
  "x-client": AUTHOR_ID + "-" + SCRIPT_NAME,
  "x-api-user": USER_ID,
  "x-api-key": API_TOKEN,
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

function doPost(e) {
  // [Developers] This is the function that will be executed whenever Habitica
  //   encounters the designated event

  const dataContents = JSON.parse(e.postData.contents);
  const webhookType = dataContents.type;

  // [Developers] Add script actions here

  return HtmlService.createHtmlOutput();
}

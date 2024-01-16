/* ========================================== */
/* [Users] Required script data to fill in    */
/* ========================================== */
const USER_ID = "PasteYourUserIdHere";
const API_TOKEN = "PasteYourApiTokenHere";
// IMPORTANT: Do not share your API token with anyone
const WEB_APP_URL = "PasteGeneratedWebAppUrlHere";

/* ========================================== */
/* [Users] Required customizations to fill in */
/* ========================================== */
// [Developers] Place all mandatory user-modified variables here
// - e.g. skill to use, number of times to use, task to use skill on, etc.

/* ========================================== */
/* [Users] Optional customizations to fill in */
/* ========================================== */
// [Developers] Place all optional user-modified variables here
// - e.g. enable/disable notifications, enable/disable script features, etc.

/* ========================================== */
/* [Users] Do not edit code below this line   */
/* ========================================== */
function doOneTimeSetup() {
  // [Developers] These are one-time initial setup instructions that we'll ask
  //   the user to manually execute only once, during initial script setup
  // - Add api_createWebhook() here, already set up to activate the trigger to the
  //   event that you want to service
  // - Feel free to do all other one-time setup actions here as well
  //   e.g. creating tasks, reward buttons, etc.
}

function doRemoval() {
  // [Developers] These are one-time instructions that we'll tell the user to
  //   execute during script removal
  // - Add api_removeWebhook() here, if you created a webhook during initial setup
  // - Remove all other permanent changes the script has introduced during initial
  //   setup and normal use
}

function validateOptions() {
  let valid = true;
  let tokenRegExp = new RegExp("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{8}");

  if (typeof USER_ID !== "string" || !tokenRegExp.test(USER_ID)) {
    error("USER_ID must equal your Habitica User ID.\n\ne.g. const USER_ID = \"12345678-90ab-416b-cdef-1234567890ab\";\n\nYour Habitica User ID can be found at https://habitica.com/user/settings/api");
    valid = false;
  }

  if (typeof API_TOKEN !== "string" || !tokenRegExp.test(USER_ID)) {
    error("API_TOKEN must equal your Habitica API Token.\n\neg. const API_TOKEN = \"2345678-90ab-416b-cdef-1234567890ab\";\n\nYour Habitica API Token can be found at https://habitica.com/user/settings/api");
    valid = false;
  }

  if (valid) {
    try {
      getUser(true);
    } catch (e) {
      if (e.stack.includes("There is no account that uses those credentials")) {
        console.log("ERROR: Your USER_ID and/or API_TOKEN is incorrect. Both of these can be found at https://habitica.com/user/settings/api");
        valid = false;
      } else {
        throw e;
      }
    }
  }
}

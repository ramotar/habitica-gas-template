// [Developers] Add global variables here
// - Note that these do not persist in between script calls
// - If you want to save values between calls, use PropertiesService
// - See https://developers.google.com/apps-script/reference/properties/properties-service
const scriptProperties = PropertiesService.getScriptProperties();

/* ================================================= */
/* [Developers] No need to edit below this point,    */
/*   but feel free to have a look and tinker with it */
/* ================================================= */

/**
 * parseJSON(json)
 *
 * Wrapper for JSON.parse(json)
 * https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 *
 * This function is mainly for debugging purposes, since JSON.parse() fails often.
 * It logs the failed JSON string to the debugging console and appends to the error as its cause.
 */
function parseJSON(json) {
  try {
    return JSON.parse(json);
  }
  catch (error) {
    logDebug("parseJSON() - Failed JSON string:\n\n", json);
    error.cause = json;
    throw error;
  }
}

/**
 * getScriptName()
 *
 * Returns the name of this script.
 */
function getScriptName() {
  return DriveApp.getFileById(ScriptApp.getScriptId()).getName();
}

/**
 * getWebAppURL()
 *
 * Returns the Web App URL of the current script deployment.
 * This value is stored once the user opens the Web App in the browser.
 */
function getWebAppURL() {
  let webAppURL = scriptProperties.getProperty("webAppURL");

  if (!webAppURL) {
    throw new Error("Web App URL is not yet set");
  }

  return webAppURL;
}

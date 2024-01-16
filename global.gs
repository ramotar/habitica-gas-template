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
 * doPost(e)
 * 
 * Function to handle POST requests to the Web App.
 * Each webhook activation will send a POST request
 * and thereby trigger this function.
 * 
 * Since webhooks need to respond within 30 seconds
 * (see https://habitica.fandom.com/wiki/Webhooks#Technical_Details),
 * doPost() calls two separate processing functions -
 * one to take care of immediate actions (which should be very lightweight)
 * and the second for heavy work (via an asynchronous trigger).
 */
function doPost(e) {
  try {
    const dataContents = parseJSON(e.postData.contents);
    const type = dataContents.type;

    // Process the webhook
    processWebhookInstant(type, dataContents);
    
    // Create a trigger for delayed processing
    var trigger = ScriptApp.newTrigger('doPostTriggered').timeBased().after(1);
    CacheService.getScriptCache().put(
      trigger.getUniqueId(),
      dataContents
    );
    trigger.create();
  }
  catch (error) {
    // Log the error to the console
    logError(error.stack);

    // To prevent Habitica from shutting down the webhook because it is unresponsive,
    // the error is not re-thrown and doPost() will exit normally.
    // Since this execution will therefore not be detected as failed by Google Apps Script,
    // the user is informed via mail about the error condition.
    let body = "Your script, " + getScriptName() + ", has recently failed to finish successfully. The error stack is shown below.\n\n";
    body += error.stack;
    if (error.hasOwnProperty("cause")) {
      body += "\n\ncaused by:\n\n" + JSON.stringify(error.cause);
    }

    MailApp.sendEmail(
      Session.getEffectiveUser().getEmail(),
      getScriptName() + " failed!",
      body
    );
  }

  // Send a response - no matter what happened
  return HtmlService.createHtmlOutput();
}

function doPostTriggered(e) {
  // Retrieve triggerId and the webhook data
  const triggerId = e.triggerUid;
  const dataContents = CacheService.getScriptCache().get(triggerId);
  const type = dataContents.type;

  // Delete the trigger
  let triggers = ScriptApp.getProjectTriggers();
  for (let trigger in triggers) {
    if (trigger.getUniqueId() === triggerId) {
      ScriptApp.deleteTrigger(trigger);
      break;
    }
  }

  // Process the webhook
  processWebhookDelayed(type, dataContents);
}

/**
 * doGet(e)
 * 
 * Function to handle GET requests to the Web App.
 * Serves the interface to the script user.
 */
function doGet(e) {
  let webAppURL = ScriptApp.getService().getUrl();
  setWebAppURL(webAppURL);

  let template = HtmlService.createTemplateFromFile('doGet');
  template.installTime = getInstallTime();

  let output = template.evaluate();
  output.setTitle(getScriptName());

  return output;
}

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
 * setWebAppURL(webAppURL) / getWebAppURL()
 * 
 * Set the Web App URL.
 * 
 * Return the Web App URL of the current script deployment.
 * This value is stored once the user opens the Web App in the browser.
 * Throws an error, if the Web App URL hasn't been stored yet.
 */
function setWebAppURL(webAppURL) {
  scriptProperties.setProperty("webAppURL", String(webAppURL));
}
function getWebAppURL() {
  let webAppURL = scriptProperties.getProperty("webAppURL");
  
  if (!webAppURL) {
    throw new Error("Web App URL is not yet set");
  }

  return webAppURL;
}

/**
 * updateInstallTime() / deleteInstallTime() / getInstallTime()
 * 
 * Updates the setup time to now.
 * 
 * Deletes the stored setup time.
 * 
 * Returns the time the of the last setup execution
 * or null, if setup wasn't executed yet.
 */
function updateInstallTime() {
  scriptProperties.setProperty("installTime", new Date().toISOString());
}
function deleteInstallTime() {
  scriptProperties.deleteProperty("installTime");
}
function getInstallTime() {
  let installTime = scriptProperties.getProperty("installTime");
  
  if (installTime) {
    installTime = new Date(installTime);
  }

  return installTime;
}

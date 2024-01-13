// [Developers] Place all other functions in this or other separate files
// - Ideally prefix functions that access the API with "api_" to quickly see which ones
//   access the API and to be able to budget your 30 requests per minute limit well


function doGet(e) {
  var webAppURL = ScriptApp.getService().getUrl();
  scriptProperties.setProperty("webAppURL", webAppURL);

  doOneTimeSetup

  return ContentService.createTextOutput(webAppURL);
}


function doPost(e) {
  // [Developers] This is the function that will be executed whenever Habitica
  //   encounters the designated event

  const dataContents = JSON.parse(e.postData.contents);
  const webhookType = dataContents.type;

  // [Developers] Add script actions here

  return HtmlService.createHtmlOutput();
}
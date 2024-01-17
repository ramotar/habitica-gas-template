// [Authors] Place all other functions in this or other separate files
// - Ideally prefix functions that access the API with "api_" to quickly see which ones
//   access the API and to be able to budget your 30 requests per minute limit well

function processWebhookInstant(type, data) {
  // [Authors] This function gets called immediately,
  //   whenever a webhook of your script is activated.
  // - Place immediate reactions here.
  // - Make sure, that the processing time does not exceed 30 seconds.
  //   Otherwise you risk the deactivation of your webhook.

  api_sendPM("This is the immediate reaction to the webhook \"" + type + "\"\n" + JSON.stringify(data));
}

function processWebhookDelayed(type, data) {
  // [Authors] This function gets called asynchronously,
  //   whenever a webhook of your script is activated.
  // - Here you can take care of heavy work, that may take longer.
  // - It may take up to 30 - 60 seconds for this function to activate
  //   after the webhook was triggered.

  api_sendPM("This is the delayed reaction to the webhook \"" + type + "\"\n" + JSON.stringify(data));
}

function processTrigger() {
  // [Authors] This function gets called by the example trigger.
  // - This is the place for recurrent tasks.
}

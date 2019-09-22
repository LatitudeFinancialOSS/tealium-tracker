import { callUtag, flushUtagQueue } from "./utagCaller";

function createTealiumTracker({
  getDataLayer,
  getQueryString,
  schema,
  debugMode = false
}) {
  document.addEventListener("utag-loaded", () => {
    if (debugMode) {
      console.log("utag loaded");
    }

    flushUtagQueue({ debugMode });
  });

  let validate;

  if (schema) {
    const Ajv = require("ajv");
    const ajv = new Ajv({ allErrors: true });

    validate = ajv.compile(schema);
  }

  function validateDataLayer(dataLayer, errorMessage) {
    if (!validate || validate(dataLayer)) {
      return true;
    }

    console.error(
      `tealium-tracker: ${errorMessage} because data validation failed: ${JSON.stringify(
        validate.errors,
        null,
        2
      )}`
    );
    return false;
  }

  function trackPageLoad(data) {
    const dataLayer = getDataLayer(data);

    if (validateDataLayer(dataLayer, `didn't call utag.view`)) {
      callUtag("view", dataLayer, { validateDataLayer, debugMode });
    }
  }

  function trackEvent(data) {
    const dataLayer = getDataLayer(data);

    if (validateDataLayer(dataLayer, `didn't call utag.link`)) {
      callUtag("link", dataLayer, { validateDataLayer, debugMode });
    }
  }

  return {
    trackPageLoad,
    trackEvent,
    getQueryString
  };
}

export default createTealiumTracker;

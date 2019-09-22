const utagQueue = [];

function callUtag(type, data, { debugMode }) {
  if (typeof window.utag === "undefined") {
    if (debugMode) {
      console.log(
        `utag hasn't loaded yet, queueing utag.${type} call with`,
        JSON.stringify(data, null, 2)
      );
    }

    utagQueue.push({
      type,
      data
    });
  } else {
    if (debugMode) {
      console.log(`utag.${type} called with`, JSON.stringify(data, null, 2));
    }

    // Note: `utag.${type}` adds additional fields to the `data` passed to it.
    // This is why we log `data` BEFORE calling `utag.${type}`.
    window.utag[type](data);
  }
}

function flushUtagQueue({ debugMode }) {
  if (utagQueue.length === 0) {
    return;
  }

  if (debugMode) {
    console.log(
      `flushing utag queue with ${utagQueue.length} item${
        utagQueue.length === 1 ? "" : "s"
      }`
    );
  }

  while (utagQueue.length > 0) {
    const { type, data } = utagQueue.shift();

    callUtag(type, data, { debugMode });
  }
}

export { callUtag, flushUtagQueue };

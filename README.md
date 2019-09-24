# tealium-tracker

## Install

```shell
npm install --save tealium-tracker
```

## How to use

First, you'll need to inject the [utag script](https://docs.tealium.com/platforms/javascript/install/#universal-tag-utag-js) onto the page.

If using Gatsby, see [gatsby-plugin-tealium-utag](https://github.com/moroshko/gatsby-plugin-tealium-utag).

Once `utag` is globally available, initialize the Tealium tracker.

```js
import initTealiumTracker from "tealium-tracker";

const { trackPageLoad, trackEvent } = initTealiumTracker();
```

This gives you access to `trackPageLoad` and `trackEvent` functions that you can call with the data object (a.k.a. the data layer).

```js
// When page loads
trackPageLoad(myDataLayer); // this will call utag.view(myDataLayer)

// When button is clicked
trackEvent(myDataLayer); // this will call utag.link(myDataLayer)
```

### Note

Since the `utag` script loads asynchronously, you might encounter the case where `trackPageLoad` or `trackEvent` are called **before the utag script finished loading.**

In this case, `tealium-tracker` will put the `utag` calls in a queue and flush the queue once the `utag` script is loaded.

For this to work, you must emit a `"utag-loaded"` event when the `utag` script is loaded.

```js
<script type="text/javascript">
(function(a,b,c,d){
a='//tags.tiqcdn.com/utag/[ACCOUNT]/[PROFILE]/[ENV]/utag.js';
b=document;c='script';d=b.createElement(c);
d.onload=function() { b.dispatchEvent(new Event("utag-loaded")); };
d.src=a;d.type='text/java'+c;d.async=true;
a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a)
})();
</script>
```

If using Gatsby, [gatsby-plugin-tealium-utag](https://github.com/moroshko/gatsby-plugin-tealium-utag) takes care of emitting this event.

## Validation

When `schema` is passed, `tealium-tracker` will automatically validate the data object against the schema before calling `utag.view` or `utag.link`.

```js
const { trackPageLoad, trackEvent } = initTealiumTracker({ schema });
```

We use [Ajv](https://github.com/epoberezkin/ajv) to perform the validation, so `schema` can be something like:

```js
const schema = {
  type: "object",
  required: ["site", "page"],
  properties: {
    site: {
      type: "string",
      minLength: 1
    },
    page: {
      type: "string",
      minLength: 1
    },
    button: {
      type: "string",
      minLength: 1
    }
  }
};
```

## Debug mode

To output useful information to the console, do:

```js
const { trackPageLoad, trackEvent } = initTealiumTracker({ debugMode: true });
```

## Related

- [gatsby-plugin-tealium-utag](https://github.com/moroshko/gatsby-plugin-tealium-utag) - Easily insert Tealium's utag onto a Gatsby page.
- [react-event-tracker](https://github.com/moroshko/react-event-tracker) - Easily track events in your React application.

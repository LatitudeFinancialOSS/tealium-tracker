const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "tealium-tracker.umd.js",
    library: "initTealiumTracker",
    libraryExport: "default",
    libraryTarget: "umd"
  }
};

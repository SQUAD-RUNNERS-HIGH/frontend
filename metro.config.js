// metro.config.js
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");


module.exports = getSentryExpoConfig(__dirname);
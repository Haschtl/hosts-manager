import React from "react";
import { AppRegistry } from "proton-native";
import {AdAway} from "./app";

export let a=2
AppRegistry.registerComponent("adaway", <AdAway />); // and finally render your main component

// ================================================================================
// This is for hot reloading (this will be stripped off in production by webpack)
// THIS SHOULD NOT BE CHANGED
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept(["./app"], function () {
    const app = require("./app")["default"];
    AppRegistry.updateProxy(app);
  });
}

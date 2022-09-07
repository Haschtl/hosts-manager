"use strict";
exports.__esModule = true;
var node_notifier_1 = require("node-notifier");
node_notifier_1["default"].on("click", function (_notifierObject, _options, _event) {
    console.log("Hi!");
});
node_notifier_1["default"].on("timeout", function (_notifierObject, _options) {
    console.log("Hi!");
});
var n = {
    notify: function (_a) {
        var title = _a.title, message = _a.message;
        node_notifier_1["default"].notify({
            title: title,
            message: message,
            icon: "./drawable/icon.png"
        });
    }
};
exports["default"] = n;

import notifier from "node-notifier";
notifier.on("click", (notifierObject, options, event) => {
  console.log("Hi!");
});
notifier.on("timeout", (notifierObject, options) => {
  console.log("Hi!");
});
notifier.notify({
  title: "My notification",
  message: "Hello, there!",
  icon: "./icon.png",
});

import React, { Component } from "react"; // import from react

import notifier from "node-notifier";
import { Window, App, Text, View, TextInput } from "proton-native"; // import the proton-native components

 
/* Todo: 
- Show Group
- Enable/disable groups
- Enable/disable all
- Update button, if link specified
- Add button (list of known ad blockers), Add button in each group, add group button
- Find,remove duplicates
*/ 




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


export class AdAway extends Component {
  render() {
    // all Components must have a render method
    return (
      <App>
        {/* you must always include App around everything */}
        <Window
          // borderless={true}
          // closed={false}
          // menuBar={true}
          // title="AdAway"
          style={{ width: 450, height: 600, backgroundColor: "black" }}
        >
          <View
            style={{
              width: "100%",
              height: "30%",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 80,
                textAlign: "right",
                marginRight: 35,
                marginBottom: 15,
                fontWeight: 200,
              }}
            >
              Hallo
            </Text>
            
          </View>
          <View style={{ flex: 1 }}>

            <TextInput
              value={hostsFile.toString()}
              style={{ color: "white", flex: 1 }}
              multiline
              ></TextInput>
              </View>
        </Window>
      </App>
    );
  }
}

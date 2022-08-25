import SysTray from "systray";
import fs from "fs";


export const systray = new SysTray({
  menu: {
    // you should using .png icon in macOS/Linux, but .ico format in windows
    icon: Buffer.from(fs.readFileSync("./icon.ico")).toString("base64"),
    title: "AdAway",
    tooltip: "AdAway",
    items: [
      {
        title: "Enable",
        tooltip: "Enable AdAway",
        enabled: true,
        checked: false,
      },
      {
        title: "Disable",
        tooltip: "Disable AdAway",
        enabled: true,
        checked: false,
      },
      {
        title: "Exit",
        tooltip: "bb",
        enabled: true,
        checked: false,
      },
    ],
  },
  debug: false,
  copyDir: true,
});

systray.onClick((action) => {
  if (action.seq_id === 0) {
    console.log("Hi!");
  } else if (action.seq_id === 1) {
    systray.kill();
  }
});

export const stopSystray = () => {
  systray.kill(false);
};

/* eslint no-console: off */

import notifier from 'node-notifier';

notifier.on('click', (_notifierObject: any, _options: any, _event: any) => {
  console.log('Click!');
});
notifier.on('timeout', (_notifierObject: any, _options: any) => {
  console.log('Timeout!');
});
const n = {
  notify: ({ title, message }: any) => {
    notifier.notify({
      title,
      message,
      icon: './drawable/icon.png',
    });
  },
};
export default n;

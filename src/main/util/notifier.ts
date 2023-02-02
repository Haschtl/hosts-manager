/* eslint no-console: off */
import notifier from 'node-notifier';

import { getAssetPath } from './files';

notifier.on('click', (_notifierObject: any, _options: any, _event: any) => {
  console.log('Click!');
});
notifier.on('timeout', (_notifierObject: any, _options: any) => {
  console.log('Timeout!');
});
const n = {
  notify: ({ title, message }: { title?: string; message?: string }) => {
    notifier.notify({
      title,
      message,
      icon: getAssetPath(
        process.env.NODE_ENV === 'production',
        'drawable/icon.png'
      ),
      // appId: 'AdAway',
    });
  },
};
export default n;

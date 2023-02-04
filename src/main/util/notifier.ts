/* eslint no-console: off */
import notifier from 'node-notifier';

import { getAssetPath } from './files';

notifier.on('click', () => {
  console.log('Click!');
});
notifier.on('timeout', () => {
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
    });
  },
};
export default n;

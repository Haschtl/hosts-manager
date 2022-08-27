import notifier from 'node-notifier';

notifier.on('click', (_notifierObject: any, _options: any, _event: any) => {
  console.log('Hi!');
});
notifier.on('timeout', (_notifierObject: any, _options: any) => {
  console.log('Hi!');
});
export default {
  notify: ({title, message}: any) => {
    notifier.notify({
      title: title,
      message: message,
      icon: './drawable/icon.png',
    });
  },
};

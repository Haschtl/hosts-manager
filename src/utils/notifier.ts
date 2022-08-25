import notifier from 'node-notifier';

notifier.on('click', (_notifierObject: any, _options: any, _event: any) => {
  console.log('Hi!');
});
notifier.on('timeout', (_notifierObject: any, _options: any) => {
  console.log('Hi!');
});
notifier.notify({
  title: 'My notification',
  message: 'Hello, there!',
  icon: './drawable/icon.png',
});

import {useColorScheme} from 'react-native';

export let IsDarkMode = () => {
  return useColorScheme() === 'dark';
};

import { combineReducers } from 'redux';
import { getUniqueID } from 'shared/helper';
import {
  SourceFiles,
  Settings,
  HostsFile,
  SourceConfig,
} from '../../shared/types';
import { AppState } from './types';

const sourceTemplates: Partial<SourceConfig>[] = [
  {
    label: 'AdAway',
    format: 'block',
    type: 'url',
    url: 'https://adaway.org/hosts.txt',
    applyRedirects: false,
    location: './sources/AdAway.hosts',
  },
  {
    label: 'Pete Lowe blocklist hosts',
    format: 'block',
    type: 'url',
    url: 'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext',
    applyRedirects: false,
    location: './sources/Pete_Lowe_blocklist_hosts.hosts',
  },
  {
    label: 'StevenBlack Unified hosts',
    format: 'block',
    type: 'url',
    url: 'https://raw.githubusercontent.com/StevenBlack/master/hosts',
    applyRedirects: false,
    comment:
      'Unified hosts file with base extensions, URL: https://github.com/StevenBlack/hosts',
    location: './sources/StevenBlack_Unified_hosts.hosts',
  },
  {
    label: 'Ultimate Hosts Blacklist',
    format: 'block',
    type: 'url',
    url: 'https://hosts.ubuntu101.co.za/hosts',
    applyRedirects: false,
    comment:
      'Largest Unified Hosts File in the Universe, URL: https://github.com/Ultimate-Hosts-Blacklist/Ultimate.Hosts.Blacklist',
    location: './sources/Ultimate_Hosts_Blacklist.hosts',
  },
  {
    label: 'Facebook',
    format: 'block',
    type: 'url',
    url: 'https://www.github.developerdan.com/hosts/lists/facebook-extended.txt',
    applyRedirects: false,
    comment:
      'A hosts file to block all Facebook and Facebook related services, including Messenger, Instagram, and WhatsApp.',
    location: './sources/Facebook.hosts',
  },
  {
    label: 'AMP Hosts',
    format: 'block',
    type: 'url',
    url: 'https://www.github.developerdan.com/hosts/lists/amp-hosts-extended.txt',
    applyRedirects: false,
    comment:
      "Google's Accelerated Mobile Pages (AMP) are taking over the web. Block AMP pages with this list. URL: https://github.com/lightswitch05/hosts",
    location: './sources/AMP_Hosts.hosts',
  },
  {
    label: 'Dating Services',
    format: 'block',
    type: 'url',
    url: 'https://www.github.developerdan.com/hosts/lists/dating-services-extended.txt',
    applyRedirects: false,
    comment:
      "Block all dating services. This list covers everything from eharmony and match.com to AshleyMadison and SwingLifeStyle. If your not interested in hot local singles, this is the list for you. This is a new blocking category for me to take on, and I'm discovering that there are a lot more dating services then I initial thought. I'm going to give it my best effort to maintain this list, but if it ends up being too challenging and time consuming, I might have to drop it. Anyways, give it a try and let me know what you think - good or bad. I've been out of the dating game for a while now, so I expect there to be some large gaps in coverage - especially in terms of apps - so please give drop me a ticket if you find some missing services and help make this a list worth using. URL: https://github.com/lightswitch05/hosts",
    location: './sources/Dating_Services.hosts',
  },
  {
    label: 'Hate and Junk',
    format: 'block',
    type: 'url',
    url: 'https://www.github.developerdan.com/hosts/lists/hate-and-junk-extended.txt',
    applyRedirects: false,
    comment:
      "This is an opinionated list to block things that I consider to be hateful or just plain junk. This list isn't for censorship, but rather websites that I wouldn't want my children to read without having a discussion first. Topics include but are not limited to hate groups, anti-vax, flat earth, and climate change denial. You are welcome to use this list if you like. If you disagree with something in this list... well, that's just, like, your opinion, man. URL: https://github.com/lightswitch05/hosts",
    location: './sources/Hate_and_Junk.hosts',
  },
  {
    label: 'Tracking Aggressive',
    format: 'block',
    type: 'url',
    url: 'https://www.github.developerdan.com/hosts/lists/tracking-aggressive-extended.txt',
    applyRedirects: false,
    comment:
      'I do not recommend this list for most users. It is a very aggressive block list for tracking, geo-targeting, & ads. This list will likely break functionality, so do not use it unless you are willing to maintain your own whitelist. If you find something in this list that you think is a mistake, please open a ticket and we can discuss it. Keep in mind that this is an aggressive list. URL: https://github.com/lightswitch05/hosts',
    location: './sources/Tracking_Aggressive.hosts',
  },
  {
    label: 'StevenBlack Fakenews',
    format: 'block',
    type: 'url',
    url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews/hosts',
    applyRedirects: false,
    comment: 'URL: https://github.com/StevenBlack/hosts/tree/master/alternates',
    location: './sources/StevenBlack_Fakenews.hosts',
  },
  {
    label: 'StevenBlack Gambling',
    format: 'block',
    type: 'url',
    url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling/hosts',
    applyRedirects: false,
    comment: 'URL: https://github.com/StevenBlack/hosts/tree/master/alternates',
    location: './sources/StevenBlack_Gambling.hosts',
  },
  {
    label: 'StevenBlack Porn',
    format: 'block',
    type: 'url',
    url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn/hosts',
    applyRedirects: false,
    comment: 'URL: https://github.com/StevenBlack/hosts/tree/master/alternates',
    location: './sources/StevenBlack_Porn.hosts',
  },
  {
    label: 'StevenBlack Social',
    format: 'block',
    type: 'url',
    url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/social/hosts',
    applyRedirects: false,
    comment: 'URL: https://github.com/StevenBlack/hosts/tree/master/alternates',
    location: './sources/StevenBlack_Social.hosts',
  },
  {
    label: 'Windows Telemetry',
    format: 'block',
    type: 'url',
    url: 'https://raw.githubusercontent.com/Forsaked/hosts/master/hosts',
    applyRedirects: false,
    comment:
      'This Repo provides a HOSTS-File which will block the Windows 10 Telemetry, without breaking the Update-Function. URL: https://github.com/Forsaked/hosts',
    location: './sources/Windows_Telemetry.hosts',
  },
  {
    label: 'ADios',
    format: 'block',
    type: 'url',
    url: 'https://raw.githubusercontent.com/AlexRabbit/ADios-ADS/master/hosts',
    applyRedirects: false,
    comment:
      'Twitch Ads, Spotify Ads, Porn Ads (not porn), Ads, Malware, Trackers, Spyware, SPAM sites, Adware, Gambling sites, Scammer sites, Microsoft tracking, Crypto mining. URL: https://github.com/AlexRabbit/ADios',
    location: './sources/ADios.hosts',
  },
];
const VERSION = '1.0.0';
export const initialSettings: Settings = {
  autoUpdates: false,
  blockMode: 'admin',
  darkMode: true,
  diagnostics: false,
  ipv6: true,
  logging: false,
  blockedHostOverwrite: '0.0.0.0',
  removeComments: false,
};
export const initialState: AppState = {
  sourceTemplates,
  active: false,
  isElevated: true,
  version: VERSION,
  settings: initialSettings,
  systemHosts: { path: '', lines: [] },
  sourcesConfig: { sources: [] },
  profiles: [],
  sources: { files: [] },
  firewall: { rules: [] },
  searchText: '',
};
export const loadState = async () => {
  const config = await window.files.loadConfig();
  const exists = await window.files.sourcesExist();
  let sources: SourceFiles | undefined;
  let profiles: HostsFile[] | undefined;
  const systemHosts = await window.files.loadHostsFile();
  if (exists) {
    sources = await window.files.loadSources();
    profiles = await window.files.loadProfiles();
    // if (sources) {
    //   window.files.saveSources(sources);
    // }
  }
  const sourcesConfig = await window.files.loadSourcesConfig();
  sourcesConfig?.sources.forEach((sc) => {
    const f = sources?.files.find((s) => s.path === sc.location);
    if (f === undefined) {
      const id = sc.label.replaceAll(' ', '_');
      sources?.files.push({ path: `./sources/${id}.hosts`, lines: [] });
    }
    if (sc.location === undefined) {
      sc.location = `./sources/${sc.label.replaceAll(' ', '_')}.hosts`;
    }
  });
  sources?.files.forEach((f) => {
    const c = sourcesConfig?.sources.find((s) => s.location === f.path);
    if (c === undefined) {
      console.log(`Adding missing config for ${f.path}`);
      sourcesConfig?.sources.push({
        applyRedirects: false,
        comment: 'Auto-imported',
        enabled: false,
        format: 'block',
        label: f.path,
        lastChange: new Date(Date.now()).toString(),
        location: f.path,
        type: 'file',
        url: undefined,
        id: getUniqueID(sourcesConfig),
      });
    }
  });
  const rules = await window.firewall.rules.get();
  return {
    active: false,
    version: VERSION,
    settings: { ...config, ...initialSettings },
    firewall: { rules },
    sources,
    profiles,
    systemHosts,
    sourcesConfig,
  } as Partial<AppState>;
};

const appReducer = (
  state = initialState,
  action: { type: string; payload: any }
): AppState => {
  let idx: number;
  let id: number;
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.payload.state };
    case 'setActive':
      return { ...state, active: action.payload.value };
    case 'setSearchText':
      return { ...state, searchText: action.payload.text };
    case 'setElevated':
      return { ...state, isElevated: action.payload.value };
    case 'setProfiles':
      return { ...state, profiles: action.payload.profiles };
    case 'setSystemHosts':
      return { ...state, systemHosts: action.payload.file };
    case 'setSettings':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload.settings },
      };
    case 'resetSettings':
      return { ...state, settings: initialSettings };
    case 'setSourceConfig':
      id = action.payload.config.id;
      if (id === -1) {
        id = getUniqueID(state.sourcesConfig);
      }
      idx = state.sourcesConfig.sources.findIndex((sc) => sc.id === id);
      if (idx === -1) {
        state.sourcesConfig.sources.push(action.payload.config);
      } else {
        state.sourcesConfig.sources[idx] = action.payload.config;
      }
      window.files.saveSourcesConfig({ sources: state.sourcesConfig.sources });
      return {
        ...state,
        sourcesConfig: { sources: state.sourcesConfig.sources },
      };

    case 'rmSource':
      idx = state.sourcesConfig.sources.findIndex(
        (sc) => sc.id === action.payload.id
      );
      if (idx !== -1) {
        const fileIdx = state.sources.files.findIndex(
          (f) => f.path === state.sourcesConfig.sources[idx].location
        );
        const rmSource = state.sourcesConfig.sources.splice(idx, 1);
        window.files.deleteSources(rmSource[0].location);
        window.files.saveSourcesConfig(state.sourcesConfig);
        if (fileIdx !== -1) {
          state.sources.files.splice(fileIdx, 1);
        }
      }
      return {
        ...state,
        sourcesConfig: {
          sources: [...state.sourcesConfig.sources],
        },
        sources: {
          files: state.sources.files,
        },
      };
    // case 'addSource':
    //   state.sourcesConfig.sources.push(action.payload.config);
    //   return {
    //     ...state,
    //     sources: { files: state.sources.files },
    //   };

    case 'setHostsFile':
      idx = state.sources.files.findIndex(
        (f) => f.path === action.payload.file.path
      );
      if (idx === -1) {
        state.sources.files.push(action.payload.file);
      } else {
        state.sources.files[idx] = action.payload.file;
      }
      window.files.saveSources({ files: [action.payload.file] });
      return { ...state, sources: { files: state.sources.files } };
    case 'setHostsLine':
      idx = state.sources.files.findIndex(
        (f) => f.path === action.payload.file.path
      );
      // state.sources.files[idx].lines.push(action.payload.line);
      state.sources.files[idx].lines[action.payload.idx] = action.payload.line;
      state.sources.files[idx].lines = [...state.sources.files[idx].lines];
      state.sources.files[idx] = { ...state.sources.files[idx] };
      window.files.saveSources({ files: [state.sources.files[idx]] });
      return {
        ...state,
        sources: {
          files: state.sources.files,
        },
      };
    case 'rmHostsLine':
      idx = state.sources.files.findIndex(
        (f) => f.path === action.payload.file.path
      );
      state.sources.files[idx].lines.splice(action.payload.idx, 1);
      state.sources.files[idx] = { ...state.sources.files[idx] };
      window.files.saveSources({ files: [state.sources.files[idx]] });
      return {
        ...state,
        sources: {
          files: state.sources.files,
        },
      };
    case 'addHostsLine':
      idx = state.sources.files.findIndex(
        (f) => f.path === action.payload.file.path
      );
      state.sources.files[idx].lines.push(action.payload.line);
      window.files.saveSources({ files: [state.sources.files[idx]] });
      return {
        ...state,
        sources: { files: state.sources.files },
      };

    default:
      return state;
  }
};

export default combineReducers({
  app: appReducer,
});

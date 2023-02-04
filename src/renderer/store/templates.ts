import { SourceConfig } from '../../shared/types';

export const sourceTemplates: Partial<SourceConfig>[] = [
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
    url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts',
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

export default sourceTemplates;

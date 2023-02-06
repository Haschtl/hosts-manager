# ![AdAway logo](assets/icon.png) hosts_manager

[![Build Status](https://github.com/haschtl/hosts-manager/actions/workflows/publish.yml/badge.svg)](https://github.com/haschtl/hosts-manager/actions/workflows/publish.yml)
[![GitHub Downloads](https://img.shields.io/github/downloads/haschtl/hosts-manager/total?logo=github)](https://github.com/haschtl/hosts-manager/releases)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/haschtl?logo=github)](https://github.com/sponsors/haschtl)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](/LICENSE.md)

`hosts_manager` can manage your system's hosts file. This is used primarily for Ad-blocking purpose. You can include online-sources or custom files. `hosts_manager` includes a list of common Ad-Blocking files.

## Availability

`hosts_manager` was initially created for Windows, but could also be built for Linux/Mac with minimal changes.

## Features

- Edit hosts-file
- Create multiple hosts-profiles for quick change
- Automatically optimize hosts-profiles (e.g. remove duplicates)
- Supports comments on every line
- Compatible with PowerToys Hosts-Editor
- Test DNS-queries
- View and edit firewall rules
- Drag-n-drop host files

## Screenshots

![Hosts](img/hosts.png)
![Sources](img/sources.png)
![Settings](img/settings.png)
![Firewall](img/firewall.png)
![DNS](img/dns.png)

## Related projects

- [AdAway](https://adaway.org): hosts-based AdBlocker for Android (root)

## Included hosts-files

- [AdAway](https://adaway.org/hosts.txt)
- [Pete Lowe blocklist hosts](https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext)
- [StevenBlack's hosts](https://github.com/StevenBlack/hosts)
- [Ultimate Hosts Blacklist](https://github.com/Ultimate-Hosts-Blacklist/Ultimate.Hosts.Blacklist)
- [lightswitch05's hosts](https://github.com/lightswitch05/hosts)
- [ADios](https://github.com/AlexRabbit/ADios)

## Todo

- bug mit callback

- IsLoading bei toggle,save,remove

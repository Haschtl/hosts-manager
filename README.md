# Todo

- umbenennen HostsManager

# How does it work?

AdAway works by modifying the system hosts file.

## OnLoad

1. Read config and sources file
2. Read hosts file and find new entries, add them to block/default.hosts
3. Download online sources and compare with existing ones

## OnSave

1. Merge AdAway hosts files
2. Create backup of original hosts file
3. Save new hosts file

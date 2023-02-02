Todo:

- replace hosts
- Download sources
- edit hosts-files, config
- always save to file

- Load differences in system-hosts
- Merge hosts-files
- Toggle enable/disable
- File handling: Initial-Backup, Disable-Backup, sources verwalten
- TrayIcon+GlobalHotkey actions start/stop

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

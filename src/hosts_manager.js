"use strict";
exports.__esModule = true;
exports.sortHosts = exports.remove_duplicates = exports.parse_hosts_file = exports.formatLine = exports.parseLine = exports.hosts_category_to_string = exports.formatHosts = void 0;
var xmldom_1 = require("xmldom");
var annotation_start = '##AdAway# ';
function formatHosts(hosts, ignoreWhitelist) {
    if (ignoreWhitelist === void 0) { ignoreWhitelist = false; }
    var text = '';
    var whitelist = [];
    if (ignoreWhitelist === false) {
        hosts.categories.forEach(function (c) {
            if (c.format === 'allow' && c.enabled) {
                c.content.forEach(function (l) {
                    if (l.enabled && l.domain) {
                        whitelist.push(l.domain);
                    }
                });
            }
        });
    }
    hosts.categories.forEach(function (c) {
        if (c.enabled || ignoreWhitelist) {
            text += hosts_category_to_string(c, whitelist) + '\n';
        }
    });
    return text;
}
exports.formatHosts = formatHosts;
function hosts_category_to_string(category, whitelist) {
    var text = "".concat(annotation_start, " <group");
    if (category.label !== undefined) {
        text += " label=\"".concat(category.label, "\"");
    }
    if (category.location !== undefined) {
        text += " location=\"".concat(category.location, "\"");
    }
    if (category.enabled !== undefined) {
        text += " enabled=\"".concat(category.enabled, "\"");
    }
    if (category.format !== undefined) {
        text += " format=\"".concat(category.format, "\"");
    }
    if (category.applyRedirects !== undefined) {
        text += " applyRedirects=\"".concat(category.applyRedirects, "\"");
    }
    if (category.type !== undefined) {
        text += " type=\"".concat(category.type, "\"");
    }
    text += '>\n';
    category.content.forEach(function (l) {
        var l2 = formatLine(l, whitelist);
        if (l2 !== undefined) {
            text += l2 + '\n';
        }
    });
    text += "".concat(annotation_start, " </group>");
    return text;
}
exports.hosts_category_to_string = hosts_category_to_string;
function parseLine(line, enabled) {
    if (enabled === void 0) { enabled = true; }
    if (line.trim().startsWith('#')) {
        if (enabled === true) {
            return parseLine(line.replace('#', ''), false);
        }
        else {
            return { comment: line, enabled: enabled };
        }
    }
    else {
        var split = line.split(' ');
        if (split.length >= 2 && split.length <= 3 && split[0].includes('.')) {
            var host = split[0];
            var domain = split[1];
            var comment = void 0;
            if (split.length === 3 && split[2].startsWith('#')) {
                comment = split.slice(2).join(' ').replace('#', '');
            }
            return { host: host, domain: domain, comment: comment, enabled: enabled };
        }
        else {
            return { comment: line.trim().replace('#', ''), enabled: enabled };
        }
    }
}
exports.parseLine = parseLine;
function formatLine(line, whitelist) {
    if (line.domain === undefined && line.host === undefined) {
        if (line.comment) {
            return '# ' + line.comment;
        }
        else {
            return undefined;
        }
    }
    else {
        if (line.domain === undefined || whitelist.indexOf(line.domain) >= 0) {
            return undefined;
        }
        var text = line.host + ' ' + line.domain;
        if (line.comment) {
            text += ' # ' + line.comment;
        }
        if (line.enabled === false) {
            text = '# ' + text;
        }
        return text;
    }
}
exports.formatLine = formatLine;
function parse_hosts_file(file) {
    var hosts = { categories: [] };
    var unknown_category = {
        label: 'Unknown',
        content: [],
        location: undefined,
        enabled: true,
        type: 'file',
        applyRedirects: true,
        format: 'block'
    };
    var current_category;
    var parser = new xmldom_1.DOMParser();
    file.split('\n').forEach(function (line, idx) {
        var is_annotation = false;
        if (line.trim() !== '') {
            if (line.startsWith(annotation_start)) {
                // Annotation for AdAway
                if (line.includes('</group>')) {
                    if (current_category !== undefined) {
                        hosts.categories.push(current_category);
                        current_category = undefined;
                        is_annotation = true;
                    }
                }
                else {
                    var tree = parser.parseFromString(line.replace(annotation_start, '').trim() + '</group>', 'text/xml');
                    try {
                        if (tree.childNodes[0].nodeName === 'group') {
                            var attributes = 
                            //@ts-ignore
                            tree.childNodes[0].attributes;
                            var label_1 = undefined;
                            var location_1;
                            var enabled_1 = true;
                            var format_1 = 'block';
                            var type_1 = 'file';
                            var applyRedirects_1 = true;
                            Object.values(attributes).forEach(function (a) {
                                switch (a.name) {
                                    case 'label':
                                        label_1 = a.value;
                                        break;
                                    case 'location':
                                        location_1 = a.value;
                                        break;
                                    case 'enabled':
                                        enabled_1 = Boolean(a.value);
                                        break;
                                    case 'format':
                                        format_1 = a.value;
                                        break;
                                    case 'type':
                                        type_1 = a.value;
                                        break;
                                    case 'applyRedirects':
                                        applyRedirects_1 = Boolean(a.value);
                                        break;
                                }
                            });
                            if (label_1 !== undefined) {
                                is_annotation = true;
                                if (current_category === undefined) {
                                    current_category = {
                                        label: label_1,
                                        content: [],
                                        location: location_1,
                                        enabled: enabled_1,
                                        format: format_1,
                                        applyRedirects: applyRedirects_1,
                                        type: type_1
                                    };
                                }
                            }
                        }
                    }
                    catch (e) {
                        console.log('Error parsing line ' + (idx + 1), e);
                    }
                }
            }
            if (!is_annotation) {
                var hostsLine = parseLine(line);
                if (current_category !== undefined) {
                    current_category.content.push(hostsLine);
                    if (current_category.enabled !== undefined) {
                        if (line.startsWith('#')) {
                            if (idx !== 0 && current_category.enabled === true) {
                                current_category.enabled = undefined;
                            }
                            else {
                                current_category.enabled = false;
                            }
                        }
                        else if (current_category.enabled === false) {
                            current_category.enabled = undefined;
                        }
                    }
                }
                else {
                    unknown_category.content.push(hostsLine);
                }
            }
        }
    });
    if (unknown_category.content.length > 0) {
        hosts.categories.push(unknown_category);
    }
    return hosts;
}
exports.parse_hosts_file = parse_hosts_file;
function remove_duplicates(hosts) {
    var entries = [];
    hosts.categories.forEach(function (c) {
        c.content.forEach(function (l) {
            if (entries.includes(l)) {
                console.log('Found duplicate: ' + l);
            }
            else {
                entries.push(l);
            }
        });
    });
    return hosts;
}
exports.remove_duplicates = remove_duplicates;
var sortHosts = function (hosts) {
    var blocked = [];
    var allowed = [];
    var redirected = [];
    hosts.categories.forEach(function (v) {
        if (v.enabled) {
            v.content.forEach(function (l) {
                if (l.enabled) {
                    if (l.host !== undefined) {
                        if (['127.0.0.1', '0.0.0.0'].includes(l.host)) {
                            if (v.format === 'allow') {
                                allowed.push(l);
                            }
                            else {
                                blocked.push(l);
                            }
                        }
                        else {
                            redirected.push(l);
                        }
                    }
                }
            });
        }
    });
    return { blocked: blocked, allowed: allowed, redirected: redirected };
};
exports.sortHosts = sortHosts;

# Focus Space · Simple Web Blocker

A small Chrome extension for setting healthier boundaries around distracting websites. Built with vanilla JavaScript, HTML, and CSS, Focus Space turns a simple site blocker into a compact digital wellbeing dashboard.

## Features

- **Block list:** block individual domains and their subdomains all day.
- **Schedules:** choose days and hours, including overnight windows.
- **Daily limits:** set a per-site allowance that resets at local midnight.
- **Categories:** toggle curated lists for social media, video, gaming, and news. These lists are examples, not comprehensive filters.
- **Insights:** see approximate active browsing time for today and the last seven days. Data is kept locally and history can be cleared.
- **Focus screen:** a calm reminder when a blocked site is opened.

## Install locally

1. [Download the latest project ZIP](https://github.com/AdysonReales/Simple-Web-Blocker/archive/refs/heads/main.zip), extract it, or clone this repository.
2. Open `chrome://extensions` in Chrome or a Chromium-based browser.
3. Enable **Developer mode**, choose **Load unpacked**, and select the repository folder containing `manifest.json`.
4. Pin the extension, open its popup, and add a domain such as `example.com`.

The ZIP contains the extension source; it is not an automatically installed Chrome Web Store package.

The extension requests access to tabs and websites to identify the active site and redirect blocked pages. Settings and usage history stay in the browser's local extension storage; no analytics server is used. Browsing time is sampled once per minute while a normal browser window is focused, so it is approximate and can miss short visits. History older than 30 days is removed when tracking runs.

The previous version stored site passwords in browser storage. On first opening the popup, this version attempts to import those rules from sync storage if the extension retains the same ID. Imported rules keep their original removal password for compatibility; these passwords are not a security boundary. New rules do not require passwords.

## Project structure

```text
manifest.json             Extension permissions and entry points
src/background/index.js   Blocking, schedules, and usage tracking
src/popup/                Popup interface and interactions
src/blocked/              Focus screen shown for blocked sites
src/styles/main.css       Shared visual styles
```

## Notes and limitations

This is a personal productivity tool, not a tamper-proof filter. Users can change rules, disable the extension, use another browser, or browse in private mode unless they enable the extension there. Schedules use the computer's local time. Category lists cover only the domains listed in the popup. The extension does not currently provide a full browsing history report or automatic category discovery.

## Built with

JavaScript · HTML · CSS · Chrome Extensions Manifest V3

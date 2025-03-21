---
id: 1271
title: 'Control Your Windows VPN Connections from VS Code'
date: '2025-02-12'
description: 'I built a VS Code extension to toggle VPN connections because clicking is too much work'
layout: post
guid: 'https://marcusfelling.com/?p=1271'
permalink: /blog/2025/vpn-toggle-vscode-extension
thumbnail-img: /content/uploads/2025/02/icon.png
nav-short: true
tags: [VS Code Extensions, Windows]
---

Ever get annoyed having to click through Windows settings just to toggle your VPN connection? Yeah, me too. That's why I built a VS Code extension to handle it.

## Why I Built This

The more I can do without touching my mouse, the happier I am. Switching VPN connections was one of those small but frequent tasks that bugged me - too many clicks just to turn a VPN on or off. Since I'm often already in VS Code when a VPN connection is required, why not control it from there?

## What It Does

The [VPN Toggle extension](https://marketplace.visualstudio.com/items?itemName=MFelling.vpn-toggle) lets you:
- Toggle any Windows VPN connection on/off with commands
- Works with any VPN connection set up in Windows

![demo](https://github.com/user-attachments/assets/e699a3af-c323-4fec-9ac8-1b67fcf4dae1){: .img-fluid }

## How to Use It

1. Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=MFelling.vpn-toggle)
2. Press `Ctrl+Shift+P` and type "VPN" to see the available commands:
    - VPN: `Select and Connect` - Shows a list of available VPN connections to choose from
    - VPN: `Connect to Last Used` - Connects to the most recently used VPN
    - VPN: `Disconnect Current` - Disconnects the current VPN connection

## Under the Hood

If you're curious about how it works, the extension uses PowerShell commands to interact with Windows VPN connections. All the code is [open source on GitHub](https://github.com/MarcusFelling/vpn-toggle) if you want to take a peek or contribute.

## Feedback Please!

Let me know what you think! Feel free to [open an issue](https://github.com/MarcusFelling/vpn-toggle/issues) if you have any suggestions or run into problems.

---
id: 1264
title: 'Removing Sensitive Data from Git History with BFG and VS Code'
date: '2024-04-23T14:06:19+00:00'
layout: post
guid: 'https://marcusfelling.com/?p=1264'
permalink: /blog/2024/removing-sensitive-data-from-git-history-with-bfg-and-vs-code/
thumbnail-img: /content/uploads/2024/04/icon.png
nav-short: true
tags: [VS Code Extensions, BFG, Git]
---

**TL; DR:** I created a VS Code extension that makes it easier to remove credentials from Git History.

I was recently notified that an old API key was discovered in one of the repos I own. Even if you remove the sensitive data in a new commit, it can still be found in the Git history.

To remove the API key, I decided to use the [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) for cleansing bad data out of your Git repository history. However, I found myself fumbling around with the BFG CLI and spending way too much time trying to remove the key from the Git history.

That’s when I realized there had to be a better way. As a frequent user of Visual Studio Code, I thought, “Why not create a VS Code extension that simplifies this process?”.

## Introducing the BFG VS Code Extension

The [BFG VS Code Extension](https://marketplace.visualstudio.com/items?itemName=MFelling.bfg-vscode) is a wrapper for the BFG Repo-Cleaner that makes it easy to remove credentials from your Git history. It guides you through the process step by step using the Command Palette, so you don’t have to remember complex CLI commands.

Here is how it works:

1. Clones a fresh copy of your repo using the –mirror flag.
2. Installs BFG: This step downloads the BFG jar file from the official repository and saves it in the workspace folder.
3. Enter credential to remove: This step prompts the user to enter the credential to remove, writes this credential to a file in the workspace folder, and uses the ```--replace-text``` option of BFG Repo-Cleaner to replace this credential with ```***REMOVED***``` in the repository’s history.
4. Remove credentials: This step runs the BFG Repo-Cleaner with the ```--replace-text``` option to replace the specified credential with ```***REMOVED***``` in the repository’s history.
5. Clean your repository: This step runs the ```git reflog expire --expire=now --all && git gc --prune=now --aggressive``` command to clean the repository.
6. Push the changes: This step runs the ```git push --force``` command to push the changes to the remote repository

You can find the BFG VS Code Extension on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=MFelling.bfg-vscode) and the source code on [GitHub](https://github.com/MarcusFelling/bfg-vscode). If you have any questions or feedback, feel free to open an issue on GitHub.

The best way to prevent sensitive data from being exposed in your Git history is to never commit it in the first place. Always use environment variables or configuration files that are ignored by Git to store sensitive data. But, if you do accidentally commit sensitive data, the BFG VS Code Extension is here to help you clean it up!
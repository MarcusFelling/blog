---
name: "gitlink-cleanup"
description: "Diagnose and fix accidental gitlink or broken submodule entries committed without valid .gitmodules metadata"
---

## Use When

- CI reports `No url found for submodule path ... in .gitmodules`
- `git submodule status` fails for a path that should be temporary or local-only
- A directory shows up as a nested Git repo and the main repo tracks it as mode `160000`

## Checklist

1. Confirm the path is a gitlink:
   - `git ls-files -s <path>`
   - `git ls-tree HEAD <path>`
2. Check whether `.gitmodules` exists and has a matching entry.
3. Inspect local-only metadata:
   - `git config --file .git/config --get-regexp "^submodule\."`
   - `Test-Path <path>/.git`
4. Determine whether the path is intentionally tracked content or temporary workspace state.
5. Search tracked workflows and scripts for recreation paths:
   - checkout configuration
   - explicit `git submodule` commands
   - references to the temp path

## Fix Strategy

- If the gitlink is accidental tracked state:
  - remove it from the index with `git rm --cached -f <path>`
  - add an ignore rule for the temp parent directory if appropriate
- If the failure is only in local metadata and the repo tree is clean:
  - do not edit tracked files
  - report exact cleanup commands for `.git/config`, `.git/modules`, and the temp directory

## Validation

- `git submodule status` completes without the mapping error
- `git ls-files -s <path>` returns no gitlink entry after the fix
- ignore rules cover the temp path if it should remain local-only
- tracked CI/workflow files do not recreate the state
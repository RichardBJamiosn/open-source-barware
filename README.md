# Open Source Barware

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Website](https://img.shields.io/badge/website-opensourcebarware.com-black)](https://opensourcebarware.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/RichardBJamison/open-source-barware?style=social)](https://github.com/RichardBJamison/open-source-barware/stargazers)

> Free, open-source bar inventory tools — built by bartenders for the trade.

Open Source Barware is a free, open-source bar inventory project for hospitality teams. **The local program is shipping: v1.5.0, released 2026-07-10.** It counts and maps a bar, tracks variance, and reconciles purchases and POS exports — running on the operator's own machine, with no account and no cloud service required.

The repository contains the local program (`program/`), the public Next.js site, the browser-based inventory sandbox, and downloadable spreadsheet/prompt assets.

- **Download:** https://opensourcebarware.com/download (~243 KB, macOS + Windows)
- **Release notes:** https://opensourcebarware.com/changelog · [Releases](https://github.com/RichardBJamison/open-source-barware/releases)
- **License:** GPLv3

> **OSB is free forever.** If it saved you a barback shift, [buy the project a beer ☕](https://ko-fi.com/W2J022HCH2). Every bit funds more tools for hospitality teams.

## What is included

- `app/` and `components/` - the public Next.js App Router site.
- `lib/` - shared site and inventory-state helpers.
- `public/downloads/` - user-facing spreadsheet/prompt downloads plus GPL compliance files.
- `program/` - local Flask/Chrome program scaffold for the customer-side inventory app.
- `bar-app/` - legacy local inventory implementation.

## Development

```bash
npm install
npm run dev
```

Build and lint:

```bash
npm run lint
npm run build
```

## Download Compliance

Website downloads are distributed under the GNU General Public License version 3 or later. The downloadable package must include:

- `LICENSE.txt` - the GPLv3 license text.
- `README.md` - package contents and modification notice.
- `NOTICE.md` - copyright and warranty notice.
- `SOURCE-OFFER.md` - where to get the corresponding source.

Regenerate the public download package and source archive with:

```bash
npm run package:compliance
```

`npm run build` runs that packaging step automatically before the static export.

That command creates:

- `public/downloads/open-source-barware-download-package.zip`
- `public/downloads/open-source-barware-source.zip`

The source archive is built from tracked and non-ignored working-tree files and excludes generated archives, local environment files, runtime state, build output, `node_modules`, and private configuration.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes and launch history.

## License

Copyright (C) 2026 Open Source Barware contributors.

Open Source Barware is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

Open Source Barware is distributed without warranty. See `LICENSE` for the full license text.

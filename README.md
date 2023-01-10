# Compare snapshot tool (side-by-side testing tool)

## Overview

This testing tool allows you to compare two URLs easily and quickly using a CSV file. The tool will iterate on each link and provide a side-by-side snapshot of the two pages for comparison where you can set the test status. Finally, you can download the results for further review or use.

This tool is developed to be an internal tool for Automatticians. Others who find it useful may fork it and adapt it to work it for
their organization, following the GPL 2.0 license.

## Development

### Quick Start

Dependencies: `git` and `yarn`.

1. Clone the repository: `git clone [https or ssh link to repo]`
2. In the repository root, install dependencies: `yarn`
3. Start the application in development mode: `yarn start`

### Helpful Commands

- `yarn start`: Run the app locally in development mode.
- `yarn build`: Bundle the app for A8c production deployment. Bundles the application into the `dist` folder.
- `yarn test`: Run tests in watch mode (automatically retests on changes).

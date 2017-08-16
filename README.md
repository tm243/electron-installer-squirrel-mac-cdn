# electron-installer-squirrel-mac-cdn

> Create releases.json files for your Squirrel.Mac electron apps

## Installation

```
# For use in npm scripts
npm i electron-installer-squirrel-mac-cdn --save-dev

# For use from cli
npm i electron-installer-squirrel-mac-cdn -g
```

## Usage

```
Usage: electron-installer-squirrel-mac-cdn --json-file RELEASES.json --app-zip MyApp.zip --version 0.1.4 --remote-path https://localhost/

Create and update the RELEASES.json file for your Squirrel.Mac Electron app

Options:
  --json-file=<path>        Path to the JSON file containing your releases information
  --app-zip=<path>          Path to a zip file containing your application
  --version=<maj.min.pat>   The version of your application
  --remote-path=<url>       URL for remote update server, must have a trailing slash
  --update                  Update an existing release instead of making a new one
```

### API

```javascript
var createReleases = require('electron-installer-squirrel-mac-cdn')
createReleases(opts)
```
#### createReleases(opts)

##### opts
**Required**

`zipPath` - *String*
The `.zip` file containing your application file

`jsonPath` - *String*
The path to the JSON file containing your releases information

`version` - *String*
The semver compatible version string to assign the given zip file

`remotePath` - *String*
The URL for your update server where these files will be served from, must include a trailing slash

`update` - *Boolean* - Default: `false`
Whether to update an existing release instead of making a new one

## License

MIT

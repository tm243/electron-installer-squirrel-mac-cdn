const fs = require('fs');
const path = require('path');

const d = require('debug')('electron-installer-squirrel-mac-cdn');

function writeEmptyFile(path) {
  const emptyContent = {
    currentRelease: '',
    releases: []
  }

  fs.writeFileSync(path, JSON.stringify(emptyContent, null, 4));
}

function ensureFileExists (path) {
  if (!fs.existsSync(path)) {
    writeEmptyFile(path);
  }
}

module.exports = function(options) {
  const remotePath = options.remotePath;
  const zipPath = options.zipPath;
  const version = options.version;
  const update = options.update;
  const jsonPath = options.jsonPath;
  const notes = options.notes;

  if (!remotePath) {
    throw new Error('remotePath is a required option');
  }
  if (!zipPath) {
    throw new Error('zipPath is a required option');
  }
  if (!version) {
    throw new Error('version is a required option');
  }
  if (!jsonPath) {
    throw new Error('jsonPath is a required option');
  }

  const zipName = path.basename(zipPath);

  ensureFileExists(jsonPath);

  var data = fs.readFileSync(jsonPath, 'utf8');

  if(!data) {
    writeEmptyFile(jsonPath);
  }

  var fileContent = JSON.parse(data);

  //! skip if version exists
  if(!update) {
    for(i = 0; i < fileContent.releases.length; i++) {
      if(fileContent.releases[i].version === version) {
        d('skipping:', fileContent.releases[i].version);
        return;
      }
    }

    const pubDate = new Date().toISOString();

    // add release
    var newRelease = {
      "version" : version,
      "updateTo" : {
        "pub_date" : pubDate,
        "notes" : notes,
        "name" : version,
        "url" : `${remotePath}${zipName}`,
        "version" : version
      }
    }
    fileContent.releases.push(newRelease);
  } else {
    // replace
    for(i = 0; i < fileContent.releases.length; i++) {
      if(fileContent.releases[i].version === version) {
        if(remotePath && zipPath)
        fileContent.releases[i].updateTo.url = `${remotePath}${zipName}`;
        d(`${version} updated.`);
      }
    }
  }

  fileContent.currentRelease = version;

  fs.writeFileSync(jsonPath, JSON.stringify(fileContent, null, 4))

  d(`The file was written to ${jsonPath}!`);
}

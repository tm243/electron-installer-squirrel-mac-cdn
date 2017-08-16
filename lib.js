var fs = require('fs');

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

module.exports = {
writeFile: function(config) {
  ensureFileExists(config.path);

  var data = fs.readFileSync(config.path, 'utf8');

  if(!data) {
    writeEmptyFile(config.path);
  }

  var fileContent = JSON.parse(data);

  //! skip if version exists
  if(!config.update) {
    for(i = 0; i < fileContent.releases.length; i++) {
      if(fileContent.releases[i].version === config.version) {
        console.log("skip "+fileContent.releases[i].version);
        return;
      }
    }

    const pubDate = new Date().toISOString();

    // add release
    var newRelease = {
      "version" : config.version,
      "updateTo" : {
        "pub_date" : config.pubDate,
        "notes" : "",
        "name" : config.version,
        "url" : config.remotePath+config.file,
        "version" : config.version
      }
    }
    fileContent.releases.push(newRelease);
  } else {
    // replace
    for(i = 0; i < fileContent.releases.length; i++) {
      if(fileContent.releases[i].version === config.version) {
        if(config.remotePath && config.file)
        fileContent.releases[i].updateTo.url = config.remotePath+config.file;
        console.log(`${config.version} updated.`);
      }
    }
  }

  fileContent.currentRelease = config.version;

  fs.writeFileSync(config.path, JSON.stringify(fileContent, null, 4))

  console.log(`The file was written to ${config.path}!`);
}
}
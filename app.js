var program = require('commander');
fs = require('fs');

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

//! main
module.exports = {

  main: function() {

    program.update = undefined;

    program
    .option('-m, --meta-file [meta-name]', 'file to be released')
    .option('-f, --file [file]', 'file to be released')
    .option('-v, --version [version]', 'version of release')
    .option('-r, --remote-path [path]', 'remote path')
    .option('-r, --update [update]', 'update an entry')
    .parse(process.argv);

    const remotePath = program.remotePath;
    const file = program.file;
    const version = program.version;
    const update = program.update;
    const path = program.metaFile;

    ensureFileExists(path);

    var data = fs.readFileSync(path, 'utf8');

    if(!data) {
      writeEmptyFile(path);
    }

    var fileContent = JSON.parse(data);

    //! skip if version exists
    if(!update) {
      for(i = 0; i < fileContent.releases.length; i++) {
        if(fileContent.releases[i].version === version) {
          console.log("skip "+fileContent.releases[i].version);
          return;
        }
      }

      const pubDate = new Date().toISOString();

      // add release
      var newRelease = {
        "version" : version,
        "updateTo" : {
          "pub_date" : pubDate,
          "notes" : "",
          "name" : version,
          "url" : program.remotePath+program.file,
          "version" : version
        }
      }
      fileContent.releases.push(newRelease);
    } else {
      // replace
      for(i = 0; i < fileContent.releases.length; i++) {
        if(fileContent.releases[i].version === version) {
          if(program.remotePath && program.file)
          fileContent.releases[i].updateTo.url = program.remotePath+program.file;
          console.log(`${version} updated.`);
        }
      }
    }

    fileContent.currentRelease = version;

    fs.writeFileSync(path, JSON.stringify(fileContent, null, 4))

    console.log(`The file was written to ${path}!`);
  }

}


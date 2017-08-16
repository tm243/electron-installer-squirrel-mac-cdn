const fs = require('fs');
var assert = require('assert');
var app = require('./app.js');

let origArgv = undefined;

function addCliArguments(arguments) {
  var res = arguments.split(" ");

  //! restore original args if needed
  if(!origArgv) {
    origArgv = process.argv.slice();
  } else {
    process.argv = origArgv.slice();
  }

  for(i = 0; i < res.length; i++) {
    process.argv.push(res[i]);
  }
}

describe('SquirrelApp', function() {

  it('create RELEASES file if it doesnt exist', function() {
    fs.unlink('RELEASES.test.json');

    addCliArguments("-m RELEASES.test.json --file foo.zip --version 0.1.1 --remote-path https://localhost/");
    app.main();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.releases[0].version, '0.1.1');
  });

  it('add a new release', function()
  {
    addCliArguments("-m RELEASES.test.json --file foo.zip --version 0.1.4 --remote-path https://localhost/");
    app.main();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.currentRelease, '0.1.4');
    assert.equal(fileContent.releases[1].version, '0.1.4');
    assert.equal(fileContent.releases[1].updateTo.url, 'https://localhost/foo.zip');
  });

  it('update an existing release', function()
  {
    addCliArguments("-m RELEASES.test.json --file bar.zip --version 0.1.4 --remote-path https://localhost/ --update");
    app.main();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.releases[1].version, '0.1.4');
    assert.equal(fileContent.releases[1].updateTo.url, 'https://localhost/bar.zip');
  });

  it('add another release', function()
  {
    addCliArguments("-m RELEASES.test.json --file foo2.zip --version 0.1.5 --remote-path https://localhost/");
    app.main();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.currentRelease, '0.1.5');
    assert.equal(fileContent.releases[2].version, '0.1.5');
    assert.equal(fileContent.releases[2].updateTo.url, 'https://localhost/foo2.zip');
  });

  it('and another release', function()
  {
    addCliArguments("-m RELEASES.test.json --file foo3.zip --version 0.1.6 --remote-path https://localhost/");
    app.main();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.currentRelease, '0.1.6');
    assert.equal(fileContent.releases[3].version, '0.1.6');
    assert.equal(fileContent.releases[3].updateTo.url, 'https://localhost/foo3.zip');
  });

});

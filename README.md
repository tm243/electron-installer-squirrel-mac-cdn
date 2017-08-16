
cli app for Squirrel.Mac to maintain RELEASES.json files for cdn mode

build:
npm i
npm test

usage:
node main -m RELEASES.json --file foo.zip --version 0.1.6 --remote-path https://localhost/
node main -m RELEASES.json --file bar.zip --version 0.1.6 --remote-path https://localhost/ --update



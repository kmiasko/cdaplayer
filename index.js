#!/usr/bin/env node

const child_process = require('child_process');
const program = require('commander');
const CDA = require('./src/cda');
let player = 'vlc ';

program
  .version('0.0.1')
  .usage('[options] <url>')
  .arguments('<url>')
  .option('-p, --player [player]', 'Video player command [ default vlc ]', 'vlc ')
  .parse(process.argv);

if (!program.args.length) {
  program.help();
  process.exit(1);
}

if (program.player) {
  player = `${program.player} `;
}

CDA.download(program.args[0])
  .then((data) => {
    if (data) {
      const command = `${player} ${data}`;
      child_process.exec(command, (error) => {
        if (error) {
          throw new Error(error);
        }
      });
    } else {
      throw new Error('Can\'t get video url');
    }
  });

import { exec as asyncExec } from 'child_process';
import * as fs from 'fs';
import * as util from 'util';
import * as Logger from '../utils/logger';

const exec = util.promisify(asyncExec);

export async function convertFileToOpus(filePath: string) {
  await exec(`ffmpeg -i "${filePath}" -c:a libopus "${filePath}.opus"`);
  return fs.createReadStream(filePath);
}

export async function deleteFiles(filePath: string) {
  fs.unlink(filePath, err => {
    if (err) {
      Logger.error(err);
    }
  });

  fs.unlink(`${filePath}.opus`, err => {
    if (err) {
      Logger.error(err);
    }
  });
}

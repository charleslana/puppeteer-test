import fs from 'fs';
import logger from './logger';
import { format } from 'date-fns';
import { getMessage } from './translate';

export async function downloadImages(imageSources: string[]): Promise<void> {
  const folderPath = createFolder();
  logger.info(getMessage('start.download'));
  let counter = 0;
  for (const src of imageSources) {
    try {
      const fileName = src.substring(src.lastIndexOf('/') + 1);
      const filePath = `${folderPath}/${fileName}`;
      await downloadImage(src, filePath);
      counter++;
      logger.info(
        `${getMessage('image.downloaded', { fileName })} ${counter}/${imageSources.length}`
      );
    } catch (error) {
      logger.error(`${getMessage('fatal.error.download')} ${src}: ${error}`);
    }
  }
}

async function downloadImage(src: string, filePath: string): Promise<void> {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(
      `${getMessage('failed.download', { src })} ${response.status} ${response.statusText}`
    );
  }
  const buffer = await response.arrayBuffer();
  await writeFile(filePath, Buffer.from(buffer));
}

async function writeFile(filePath: string, data: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function createFolder(): string {
  const now = new Date();
  const folderName = format(now, process.env.DATE_FORMAT as string);
  const folderPath = `${process.env.DOWNLOAD_FOLDER}/${folderName}`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  return folderPath;
}

import fs from 'fs';
import logger from './logger';

export function saveImageUrlsToFile(imageSources: string[]): void {
  try {
    const filePath = process.env.FILE_PATH || '';
    fs.writeFileSync(filePath, '', { flag: 'w' });
    const content = imageSources.join('\n');
    fs.writeFileSync(filePath, content);
    logger.info(`Arquivo salvo com sucesso em: ${filePath}`);
  } catch (error) {
    logger.error('Erro ao salvar o arquivo:', error);
    throw error;
  }
}

export function getTextsFromFile(): string[] {
  try {
    const content = fs.readFileSync(process.env.FILE_PATH || '', 'utf-8');
    const texts = content.split('\n');
    return texts;
  } catch (error) {
    logger.error('Erro ao ler o arquivo:', error);
    throw error;
  }
}

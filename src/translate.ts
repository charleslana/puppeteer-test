type Language = 'pt' | 'en';

interface Messages {
  [key: string]: {
    en: string;
    pt: string;
  };
}

const messages: Messages = {
  'start.info': {
    en: 'Starting information collection, wait...',
    pt: 'Iniciando a coleta de informações, aguarde...',
  },
  'error.navigate': {
    en: 'Error when browsing:',
    pt: 'Erro ao navegar:',
  },
  'error.first.banner': {
    en: 'Error closing the first banner:',
    pt: 'Erro ao fechar o primeiro banner:',
  },
  'error.second.banner': {
    en: 'Error closing the second banner:',
    pt: 'Erro ao fechar o segundo banner:',
  },
  'error.validate.first.image': {
    en: 'Error validating the first image:',
    pt: 'Erro ao validar a primeira imagem:',
  },
  'image.scroll': {
    en: 'All images have been scrolled through',
    pt: 'Todas imagens foram percorridas',
  },
  'total.length.image': {
    en: 'Total images collected:',
    pt: 'Total de imagens coletadas:',
  },
  'start.download': {
    en: 'Starting download',
    pt: 'Iniciando download',
  },
  'image.downloaded': {
    en: 'Image ${fileName} downloaded successfully!',
    pt: 'Imagem ${fileName} baixada com sucesso!',
  },
  'failed.download': {
    en: 'Failed to download image ${src}. Response status:',
    pt: 'Falha ao baixar a imagem ${src}. Status do response:',
  },
  'fatal.error.download': {
    en: 'Error downloading image',
    pt: 'Erro ao baixar a imagem',
  },
  'finish.download': {
    en: 'Download finished',
    pt: 'Download finalizado',
  },
};

export function getMessage(key: string, variables?: Record<string, string>): string {
  const language = (process.env.LG as Language) || 'en';
  if (!(key in messages)) {
    return `Key not found message '${key}'.`;
  }
  let message = messages[key][language];
  if (variables) {
    Object.keys(variables).forEach(variable => {
      const regex = new RegExp(`\\$\\{${variable}\\}`, 'g');
      message = message.replace(regex, variables[variable]);
    });
  }
  return message || `Translation not available for '${language}'.`;
}

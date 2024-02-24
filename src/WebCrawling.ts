import dotenv from 'dotenv';
import logger from './logger';
import puppeteer, { Browser, Page } from 'puppeteer';
import { Core } from './Core';
import { Custom } from './Custom';
import { downloadImages } from './download';
import { getMessage } from './translate';
import { getTextsFromFile, saveImageUrlsToFile } from './save';
import {
  closeOutsideBanner,
  firstCloseButton,
  firstImageButton,
  getCustomerImage,
  nextButton,
} from './page';

export class WebCrawling {
  constructor() {
    dotenv.config();
    this.init();
  }

  private page: Page | null = null;
  private browser: Browser | null = null;
  private core: Core | null = null;
  private custom: Custom | null = null;
  private imageSources: string[] = [];

  private async init(): Promise<void> {
    this.browser = await puppeteer.launch({
      executablePath: process.env.EXEC,
      headless: process.env.HEADLESS === 'true',
      defaultViewport: null,
      args: ['--no-sandbox'],
    });
    this.page = await this.browser.newPage();
    const getPages = await this.browser.pages();
    await getPages[0].close();
    this.page.setDefaultTimeout(Number(process.env.TIMEOUT));
    await this.start();
  }

  private async start(): Promise<void> {
    if (!this.page) return;
    this.core = new Core(this.page);
    this.custom = new Custom(this.page);
    logger.info(getMessage('start.info'));
    await this.tryNavigate();
    await this.tryCloseBanner();
    await this.core.sleep(1000);
    await this.tryClickFirstImageButton();
    await this.scrollImages();
    await this.getAllImages();
    saveImageUrlsToFile(this.imageSources);
    await this.browser?.close();
    await downloadImages(getTextsFromFile());
    logger.info(getMessage('finish.download'));
  }

  private async getAllImages(): Promise<void> {
    const imageElements = await this.core?.findElements(getCustomerImage);
    for (const image of imageElements!) {
      const src = await this.custom?.getImageSrc(image);
      this.imageSources.push(src!);
    }
    logger.info(`${getMessage('total.length.image')} ${this.imageSources.length}`);
  }

  private async scrollImages(): Promise<void> {
    let isDisabled = false;
    while (!isDisabled) {
      const button = await this.core?.waitForVisible(nextButton);
      isDisabled = await this.custom!.isElementDisabled(button!);
      if (isDisabled) {
        logger.info(getMessage('image.scroll'));
        break;
      }
      await this.core?.click(button);
      await this.core?.sleep(2000);
    }
    await this.core?.sleep(2000);
  }

  private async tryClickFirstImageButton(): Promise<void> {
    try {
      await this.core?.waitForClick(firstImageButton);
      await this.core?.waitForRequest(process.env.API_URL || '');
      await this.core?.waitForVisible(nextButton);
      await this.core?.waitForVisible(getCustomerImage);
    } catch (error) {
      throw new Error(`${getMessage('error.validate.first.image')} ${error}`);
    }
  }

  private async tryCloseBanner(): Promise<void> {
    await this.tryCloseFirstBanner();
    await this.tryCloseSecondBanner();
  }

  private async tryCloseFirstBanner(): Promise<void> {
    try {
      await this.core?.waitForClick(firstCloseButton);
      await this.core?.waitForHidden(firstCloseButton);
    } catch (error) {
      throw new Error(`${getMessage('error.first.banner')} ${error}`);
    }
  }

  private async tryCloseSecondBanner(): Promise<void> {
    try {
      await this.core?.waitForClick(closeOutsideBanner);
    } catch (error) {
      throw new Error(`${getMessage('error.second.banner')} ${error}`);
    }
  }

  private async tryNavigate(): Promise<void> {
    try {
      await this.core?.navigate(process.env.URL || '');
    } catch (error) {
      throw new Error(`${getMessage('error.navigate')} ${error}`);
    }
  }
}

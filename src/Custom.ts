import { ElementHandle, Page } from 'puppeteer';
import { nextButtonDisabled } from './page';

export class Custom {
  constructor(page: Page) {
    this.page = page;
  }

  private page: Page;

  public async isElementDisabled(button: ElementHandle<Element> | null): Promise<boolean> {
    return await this.page.evaluate(
      (btn: Element | null, btnClosed) => btn!.classList.contains(btnClosed),
      button,
      nextButtonDisabled
    );
  }

  public async getImageSrc(image: ElementHandle<Element>): Promise<string> {
    let src = await this.page.evaluate((img: Element) => img.getAttribute('src'), image);
    src = src!.replace(/^\/\//, 'https://');
    return src || '';
  }
}

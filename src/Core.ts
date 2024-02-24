import { ElementHandle, Page } from 'puppeteer';

export class CoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CoreError';
  }
}

export class Core {
  constructor(page: Page) {
    this.page = page;
  }

  private page: Page;

  public async navigate(url: string): Promise<void> {
    try {
      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
      });
    } catch (error) {
      throw new CoreError(`Erro ao navegar para ${url}: ${error}`);
    }
  }

  public async waitForVisible(selector: string): Promise<ElementHandle<Element> | null> {
    try {
      return await this.page.waitForSelector(selector, { visible: true });
    } catch (error) {
      throw new CoreError(`Erro ao aguardar elemento visível com seletor ${selector}: ${error}`);
    }
  }

  public async waitForNotVisible(selector: string): Promise<ElementHandle<Element> | null> {
    try {
      return await this.page.waitForSelector(selector, { visible: false });
    } catch (error) {
      throw new CoreError(
        `Erro ao aguardar elemento não visível com seletor ${selector}: ${error}`
      );
    }
  }

  public async waitForClick(selector: string): Promise<void> {
    try {
      await this.waitForVisible(selector);
      await this.page.click(selector);
    } catch (error) {
      throw new CoreError(
        `Erro ao aguardar e clicar no elemento com seletor ${selector}: ${error}`
      );
    }
  }

  public async waitForHidden(selector: string): Promise<ElementHandle<Element> | null> {
    try {
      return await this.page.waitForSelector(selector, { hidden: true });
    } catch (error) {
      throw new CoreError(`Erro ao aguardar elemento oculto com seletor ${selector}: ${error}`);
    }
  }

  public async sleep(ms: number): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, ms));
    } catch (error) {
      throw new CoreError(`Erro ao aguardar ${ms} milissegundos: ${error}`);
    }
  }

  public async waitForRequest(url: string): Promise<boolean | undefined> {
    try {
      const finalRequest = await this.page.waitForRequest(request => request.url().includes(url));
      return finalRequest.response()?.ok();
    } catch (error) {
      throw new CoreError(`Erro ao aguardar requisição URL: ${url}, ${error}`);
    }
  }

  public async click(element: ElementHandle<Element> | null | undefined): Promise<void> {
    try {
      await element?.click();
    } catch (error) {
      throw new CoreError(`Erro ao clicar no elemento: ${error}`);
    }
  }

  public async findElements(selector: string): Promise<ElementHandle<Element>[]> {
    try {
      return await this.page.$$(selector);
    } catch (error) {
      throw new CoreError(`Erro ao encontrar elementos com seletor ${selector}: ${error}`);
    }
  }
}

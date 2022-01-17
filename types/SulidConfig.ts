import { UserConfig } from 'vite';
import { Options } from 'vite-plugin-solid';

interface SulidConfig extends UserConfig {
  sulid?: OnlySulidConfig
}

export interface OnlySulidConfig {
  /**
   * define where sulid will look for pages
   * @default ./src/pages
   */
  pagesSrc?: string
  /**
   * port on which the server sulid is listening
   * @default 3000
   */
  port?: number
  /**
   * config pass to vite-plugin-solid
   */
  solidPlugin?: Options

  build?: {
    /**
     * dicrectory where output will be write
     * @default /dist
     */
    output?: string
    /**
     * port on which the production server is listening
     * @default 3000
     */
    port?: number
  }
}

export default SulidConfig;

/**
 * Define configuration options.
 */

export interface ConfigModuleOptions {
  /**
   * Name of the file containing env config.
   * @default .env
   * @example .env.development
   */
  fileName: string;

  /**
   * @default config
   * @example config
   * Name of the folder containing env files.
   */
  dir: string;

  /**
   * Decide wether to obtain config from use process.env or a file.
   * @default false
   */
  useProcess: boolean;
}

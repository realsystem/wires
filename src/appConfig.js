import { safeSupportUrl } from './utils/supportUrl.js';

/** Application-level settings. */
export const APP_CONFIG = {
  /**
   * Where the Support button points. Set at build time with the SUPPORT_URL
   * environment variable (in CI: the SUPPORT_URL repository variable or secret);
   * when it is empty or invalid, a disabled placeholder is shown. The URL is
   * never kept in the source.
   */
  supportUrl: safeSupportUrl(process.env.SUPPORT_URL),
};

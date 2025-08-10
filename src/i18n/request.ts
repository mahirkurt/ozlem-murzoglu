import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Default to Turkish
  const locale = 'tr';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
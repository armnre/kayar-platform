import { createContext, useContext } from 'react';

/**
 * Path prefix for shared pages (campaigns, rewards) that render both on the public site ('')
 * and inside the web app ('/app'), so links never jump out of the app to the public pages.
 */
export const BaseContext = createContext('');
export const useBase = () => useContext(BaseContext);

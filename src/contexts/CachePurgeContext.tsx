import axios from 'axios';
import { ReactNode, createContext, useEffect } from 'react';
import PackageVersion from '../../package.json';

const initialAppVersion = PackageVersion.version;
interface CachePurgeContextType {
  currentVersion: string;
}

export const CachePurgeContext = createContext<CachePurgeContextType>({
  currentVersion: initialAppVersion
});

export const CachePurgeProvider = ({ children }: { children: ReactNode }) => {
  let cachedVersion = localStorage.getItem('cachedVersion');
  useEffect(() => {
    cachedVersion = localStorage.getItem('cachedVersion');
    if (!cachedVersion) {
      localStorage.setItem('cachedVersion', initialAppVersion);
    }
  }, []);

  const fetchNewestAppVersion = async () => {
    const url = '/meta.json';
    const config = {
      params: {
        timestamp: Date.now()
      },
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    };
    try {
      const getAppInformation = await axios.get(url, config);
      const appInformationData = getAppInformation.data;
      console.log('Checking version', appInformationData.version, cachedVersion);
      if (cachedVersion && appInformationData.version && appInformationData.version !== cachedVersion) {
        localStorage.setItem('cachedVersion', appInformationData.version);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };

  useEffect(() => {
    const setIntervalImmediately = (func: any, interval: number) => {
      func();
      return setInterval(func, interval);
    };
    (async () => {
      setIntervalImmediately(fetchNewestAppVersion, 20000);
    })();
  }, []);

  return (
    <CachePurgeContext.Provider
      value={{
        currentVersion: cachedVersion || initialAppVersion
      }}
    >
      {children}
    </CachePurgeContext.Provider>
  );
};

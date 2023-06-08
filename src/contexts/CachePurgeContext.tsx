import React, { ReactNode, createContext, useEffect, useState } from 'react';
import axios from 'axios';
import PackageVersion from '../../package.json';
const appVersion = PackageVersion.version;
interface CachePurgeContextType {
  currentVersion: string;
}

export const CachePurgeContext = createContext<CachePurgeContextType>({
  currentVersion: appVersion
});

export const CachePurgeProvider = ({ children }: { children: ReactNode }) => {
  let cachedVersion = localStorage.getItem('cachedVersion');
  useEffect(() => {
    // check if there is cachedVersion in localstorage
    cachedVersion = localStorage.getItem('cachedVersion');
    if (!cachedVersion) {
      localStorage.setItem('cachedVersion', appVersion);
    }
  }, []);

  const fethcVersion = async () => {
    const url = '/meta.json';
    // it will make sure no cache is used
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

    const response = await axios.get(url, config);
    const data = response.data;
    console.log('Checking version', data.version, cachedVersion);
    if (cachedVersion && data.version !== cachedVersion) {
      localStorage.setItem('cachedVersion', data.version);
      window.location.reload();
    }
  };
// we check for possible cache purgin every 20 seconds

  useEffect(() => {
    fethcVersion();
    setInterval(() => {
      fethcVersion();
    }, 20 * 1000);
  }, []);

  return (
    <CachePurgeContext.Provider
      value={{
        currentVersion: cachedVersion || appVersion
      }}
    >
      {children}
    </CachePurgeContext.Provider>
  );
};

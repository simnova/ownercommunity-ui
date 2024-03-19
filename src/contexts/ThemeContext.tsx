import { Button, theme } from 'antd';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { useMaintenanceMessage } from '../components/shared/maintenance-message';
import ModalPopUp from './components/ModalPopUp';

interface ThemeTokens {
  textColor: string;
  backgroundColor: string;
}

interface ThemeContextType {
  currentTokens: {
    token: typeof theme.defaultSeed;
    hardCodedTokens: ThemeTokens;
    type: string;
  };
  setTheme: (tokens: any, types: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  currentTokens: {
    token: theme.defaultSeed,
    hardCodedTokens: {
      textColor: '#000000',
      backgroundColor: '#ffffff'
    },
    type: 'light'
  },
  setTheme: () => {}
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { isImpending, isMaintenance, maintainanceMessage, maintainanceMessageImpending } = useMaintenanceMessage();
  const [currentTheme, setCurrentTheme] = useState<ThemeContextType['currentTokens']>({
    token: theme.defaultSeed,
    hardCodedTokens: {
      textColor: '#000000',
      backgroundColor: '#ffffff'
    },
    type: 'light'
  });
  const [isContentHidden, setIsContentHidden] = useState(false);
  const toggleContentVisibility = () => setIsContentHidden((prevState) => !prevState);
  const applyTheme = (tokens: any, type: string) => {
    let newTheme: any;
    if (type === 'light' || type === 'dark') {
      newTheme = {
        token: tokens,
        hardCodedTokens: {
          textColor: type === 'light' ? '#000000' : '#ffffff',
          backgroundColor: type === 'light' ? '#ffffff' : '#000000'
        },
        type: type
      };
    } else if (type === 'custom') {
      newTheme = {
        token: { ...currentTheme.token },
        hardCodedTokens: {
          textColor: tokens?.colorTextBase,
          backgroundColor: tokens?.colorBgBase
        },
        type: 'custom'
      };
    }
    setCurrentTheme(newTheme);
    localStorage.setItem('themeProp', JSON.stringify(newTheme));
  };

  const loadThemeFromLocalStorage = () => {
    const storedTheme = JSON.parse(localStorage.getItem('themeProp')!);
    if (storedTheme) {
      applyTheme(storedTheme.hardCodedTokens, storedTheme.type);
    } else {
      applyTheme(theme.defaultSeed, 'light');
    }
  };

  const handleKeyboardShortcut = (event: KeyboardEvent) => {
    if (event.metaKey && event.shiftKey && event.key === 'k') {
      toggleContentVisibility();
    }
  };

  useEffect(() => {
    loadThemeFromLocalStorage();
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcut);
    };
  }, []);

  const toggleDarkLightTheme = () => {
    if (currentTheme.type === 'custom' || currentTheme.type === 'light') {
      applyTheme(theme.darkAlgorithm(theme.defaultSeed), 'dark');
    } else if (currentTheme.type === 'dark') {
      applyTheme(theme.defaultSeed, 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTokens: currentTheme, setTheme: applyTheme }}>
      <div data-testid="theme-type">{currentTheme.type}</div>
      {isMaintenance ? (
        <div className="h-screen flex justify-center items-center text-center px-8">
          <div dangerouslySetInnerHTML={{ __html: maintainanceMessage as string }}></div>
        </div>
      ) : (
        <div>
          <div className={isContentHidden ? 'hidden' : 'text-center'}>
            {isImpending && (
              <div className="w-screen bg-red-500 text-left px-8 py-4">
                <div dangerouslySetInnerHTML={{ __html: maintainanceMessageImpending as string }}></div>
              </div>
            )}
            <div className="py-2 flex gap-4 justify-center">
              <Button type="primary"  onClick={toggleDarkLightTheme} data-testid='dark-and-light-switcher'>
                Toggle Dark/Light
              </Button>
              <ModalPopUp />
            </div>
            <p>
              Hit <strong>Cmd+Shift+K</strong> to hide
            </p>
          </div>
          {children}
        </div>
      )}
    </ThemeContext.Provider>
  );
};

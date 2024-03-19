import { ThemeContext, ThemeProvider } from './ThemeContext';
import { useMaintenanceMessage } from '../components/shared/maintenance-message';
import { render, fireEvent, getByText, act } from '@testing-library/react';
import { theme } from 'antd';


describe('Given the component', () => {
  describe('When first rendered', () => {
    it('Then I expect it to load with default light theme without crashing', () => {
      const ChildComponent = () => <div>Child Component</div>;
      render(
        <ThemeProvider>
          <ChildComponent />
        </ThemeProvider>
      );
      expect(localStorage.getItem('themeProp')).toContain('"type":"light"');
    });
  });
});


describe('Given user interaction', () => {
  describe('when shortcut CMD SHIFT K is pressed', () => {
    it('then I expect content visibility is toggled', () => {
      const ChildComponent = () => <div>Child Component</div>;

      const { getByText } = render(
        <ThemeProvider>
          <ChildComponent />
        </ThemeProvider>
      );

      fireEvent.keyDown(window, { key: 'k', metaKey: true, shiftKey: true });
      expect(getByText('Child Component')).not.toBeVisible();

      fireEvent.keyDown(window, { key: 'k', metaKey: true, shiftKey: true });
      expect(getByText('Child Component')).toBeVisible();
    });
  });
  describe('when dark/light button is toggled', () => {
    it('then i expect the theme toggled between dark and light', () => {
      const ChildComponent = () => <div>Child Component</div>;
      const { getByText } = render(
        <ThemeProvider>
          <ChildComponent />
        </ThemeProvider>
      );
      fireEvent.click(getByText('Toggle Dark/Light'));
      expect(localStorage.getItem('themeProp')).toContain('"type":"dark"');
      fireEvent.click(getByText('Toggle Dark/Light'));
      expect(localStorage.getItem('themeProp')).toContain('"type":"light"');
    });
  });
  describe('when I apply a custom theme', () => {
    it('then i expect the theme to be applied', () => {
      const { getByText, getByDisplayValue } = render(
              <ThemeProvider>
                <div></div>
              </ThemeProvider>
            );
        
            const setCustomThemeButton = getByText('Set Custom Theme');
            fireEvent.click(setCustomThemeButton);
            fireEvent.click(getByDisplayValue(/#ffffff/i));
            expect(localStorage.getItem('themeProp')).toContain('"type":"custom"');
    });
  });
});

describe('Given maintenance mdoe', () => {
  describe('When in maintenance mode', () => {
    it('Then I expect the maintenance message to be rendered', () => {
      expect(true).toBe(false);
    });
  });
  describe('When in impending maintenance mode', () => {
    it('then i expect the impending maintenance message to be rendered', () => {
      expect(true).toBe(false);
    });
  });
});

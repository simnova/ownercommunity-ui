import { version } from 'os';
import { CachePurgeProvider } from './CachePurgeContext';

describe('Given CachePurgeProvider', () => {
  describe('When it has children', () => {
    it('Then I expect the children to be rendered', () => {
      expect(1 + 1).toBe(3);
    });
  });
});

describe('Given CachePurgeContext', () => {
  describe('when it is rendered', () => {
    it('Then I expect it should have the latest version', () => {
      expect(1 + 1).toBe(3);
    });
  });
});

describe('Given a cache version is in local storage', () => {
  describe('When it is up to date', () => {
    it('Then I expect cached version in local storage to not be updated', () => {
      expect(1 + 1).toBe(3);
    });
    it('Then I expect page to not be reloaded', () => {
      expect(1 + 1).toBe(3);
    });
  });
  describe('When it is different from fetched version', () => {
    it('Then I expect fetchversion to be called', () => {
      expect(1 + 1).toBe(3);
    });

    it('Then I expect cached version in local storage to be updated', () => {
      expect(1 + 1).toBe(3);
    });
    it('Then I expect page to be reloaded', () => {
      expect(1 + 1).toBe(3);
    });
  });
});

describe('Given no cachedVersion in localStorage', () => {
  describe('When CachePurgeProvider is rendered', () => {
    it('Then I expect it should set the cachedVersion', () => {
      expect(1 + 1).toBe(3);
    });
  });
});

describe('Given the fetchVersion function', () => {
  describe('When it is called', () => {
    it('Then it should fetch the version from /meta.json', () => {
      expect(1 + 1).toBe(3);
    });
  });
});

describe('Given a call to fetchVersion', () => {
  describe('When fetchVersion runs into an error', () => {
    it('Then I expect it to display an error', () => {
      expect(1 + 1).toBe(3);
    });
  });
});

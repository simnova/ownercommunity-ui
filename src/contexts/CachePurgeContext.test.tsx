import { CachePurgeProvider, CachePurgeContext } from './CachePurgeContext';
import { render, waitFor, renderHook } from '@testing-library/react';
import { useContext } from 'react';
import PackageVersion from '../../package.json';
import axios from 'axios';

const currentAppVersion = PackageVersion.version;
const versionComponents = currentAppVersion.split('.');
versionComponents[2] = (parseInt(versionComponents[2]) - 1).toString();

const outDatedVersion = versionComponents.join('.');

vi.mock('axios');

describe('CachePurgeContext', () => {
  it('renders without crashing', () => {
    render(<CachePurgeProvider />);
  });
});

describe('Given CachePurgeProvider', () => {
  describe('When it has children', () => {
    it('Then I expect the children to be rendered', () => {
      const { getByText } = render(<CachePurgeProvider>Test Child</CachePurgeProvider>);
      expect(getByText('Test Child')).toBeInTheDocument;
    });
  });
});

describe('Given CachePurgeContext', () => {
  describe('When it is rendered', () => {
    it('Then I expect it should have the latest version', () => {
      const { result: gatheredVersion } = renderHook(() => useContext(CachePurgeContext), {
        wrapper: CachePurgeProvider
      });
      console.log(gatheredVersion.current.currentVersion, currentAppVersion);
      expect(gatheredVersion.current.currentVersion).toBe(currentAppVersion);
    });
  });
});

describe('Given a cache version is in local storage', () => {
  describe('When it is up to date', () => {
    beforeAll(() => {
      delete window.location;
      window.location = { reload: vi.fn() };
    });
    afterAll(() => {
      window.location = location;
    });

    it('Then I expect page to not be reloaded', async () => {
      window.location.reload = vi.fn();
      axios.get.mockResolvedValue({ data: { version: currentAppVersion } });
      Storage.prototype.getItem = vi.fn(() => currentAppVersion);
      const { result } = renderHook(() => useContext(CachePurgeContext), {
        wrapper: CachePurgeProvider
      });

      expect(window.location.reload).not.toHaveBeenCalled();
    });
  });
  describe('When it is different from fetched version', () => {
    beforeAll(() => {
      delete window.location;
      window.location = { reload: vi.fn() };
    });
    afterAll(() => {
      window.location = location;
    });
    it('Then I expect fetchVersion to be called', async () => {
      axios.get.mockResolvedValue({ data: { version: currentAppVersion } });
      Storage.prototype.getItem = vi.fn(() => outDatedVersion);
      const { result } = renderHook(() => useContext(CachePurgeContext), {
        wrapper: CachePurgeProvider
      });

      await waitFor(() =>
        expect(axios.get).toHaveBeenCalledWith(
          '/meta.json',
          expect.objectContaining({
            headers: expect.objectContaining({
              'Cache-Control': 'no-cache',
              Expires: '0',
              Pragma: 'no-cache'
            }),
            params: expect.objectContaining({
              timestamp: expect.any(Number)
            })
          })
        )
      );
    });

    it('Then I expect cached version in local storage to be updated', async () => {
      axios.get.mockResolvedValue({ data: { version: currentAppVersion } });
      Storage.prototype.getItem = vi.fn(() => outDatedVersion);
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const { result } = renderHook(() => useContext(CachePurgeContext), {
        wrapper: CachePurgeProvider
      });
      await waitFor(() => expect(setItemSpy).toHaveBeenCalledWith('cachedVersion', currentAppVersion));
    });

    it('Then I expect page to be reloaded', async () => {
      window.location.reload = vi.fn();

      axios.get.mockResolvedValue({ data: { version: currentAppVersion } });
      Storage.prototype.getItem = vi.fn(() => outDatedVersion);
      const { result } = renderHook(() => useContext(CachePurgeContext), {
        wrapper: CachePurgeProvider
      });

      await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
    });
  });
});

describe('Given no cachedVersion in localStorage', () => {
  describe('When CachePurgeProvider is rendered', () => {
    beforeAll(() => {
      delete window.location;
      window.location = { reload: vi.fn() };
    });
    afterAll(() => {
      window.location = location;
    });
    it('Then I expect it should set the cachedVersion', async () => {
      axios.get.mockResolvedValue({ data: { version: currentAppVersion } });
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const { result } = renderHook(() => useContext(CachePurgeContext), {
        wrapper: CachePurgeProvider
      });
      await waitFor(() => expect(setItemSpy).toHaveBeenCalledWith('cachedVersion', currentAppVersion));
    });
    it('Then I expect it should reload the page', async () => {
      window.location.reload = vi.fn();
      axios.get.mockResolvedValue({ data: { version: currentAppVersion } });
      Storage.prototype.getItem = vi.fn(() => outDatedVersion);
      const { result } = renderHook(() => useContext(CachePurgeContext), {
        wrapper: CachePurgeProvider
      });

      await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
    });
  });

  describe('Given the fetchVersion function', () => {
    describe('When fetchVersion runs into an error', () => {
      it('Then I expect it to display an error', async () => {
        axios.get.mockRejectedValue(new Error('Error fetching version'));
        console.error = vi.fn();
        Storage.prototype.getItem = vi.fn(() => null);

        const { result } = renderHook(() => useContext(CachePurgeContext), {
          wrapper: CachePurgeProvider
        });
        await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error fetching version:', expect.any(Error)));
      });
    });
  });
});

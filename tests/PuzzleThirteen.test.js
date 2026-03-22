import './mocks/matchMedia.mock';
import React from 'react';
import { act, render, screen } from '@testing-library/react-native';
import { Platform, View } from 'react-native';

const mockAddListener = jest.fn();
const mockSetUpdateInterval = jest.fn();
const mockIsAvailableAsync = jest.fn();
const mockRequestPermission = jest.fn();
const mockTakePictureAsync = jest.fn();

jest.mock('expo-sensors', () => ({
  LightSensor: {
    addListener: (...args) => mockAddListener(...args),
    setUpdateInterval: (...args) => mockSetUpdateInterval(...args),
    isAvailableAsync: (...args) => mockIsAvailableAsync(...args),
  },
}));

jest.mock('expo-camera', () => {
  const ReactLocal = require('react');
  return {
    CameraView: ReactLocal.forwardRef((props, ref) => {
      ReactLocal.useImperativeHandle(ref, () => ({
        takePictureAsync: (...args) => mockTakePictureAsync(...args),
      }));

      ReactLocal.useEffect(() => {
        if (typeof props.onCameraReady === 'function') {
          props.onCameraReady();
        }
      }, [props.onCameraReady]);

      return <View testID="camera-view" />;
    }),
    useCameraPermissions: jest.fn(() => [
      {
        granted: true,
        canAskAgain: true,
      },
      mockRequestPermission,
    ]),
  };
});

import { useCameraPermissions } from 'expo-camera';
import PuzzleThirteen from '../components/PuzzleThirteen';

describe('<PuzzleThirteen />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('shows unavailable message on android when light sensor is not supported', async () => {
    jest.spyOn(Platform, 'OS', 'get').mockReturnValue('android');
    mockIsAvailableAsync.mockResolvedValue(false);

    render(<PuzzleThirteen />);

    expect(await screen.findByText('Ambient light sensor is unavailable on this device.')).toBeTruthy();
  });

  it('solves on iOS after lens is covered for at least 10 seconds then uncovered', async () => {
    const dateNowSpy = jest.spyOn(Date, 'now');
    let now = 0;

    dateNowSpy.mockImplementation(() => now);
    jest.spyOn(Platform, 'OS', 'get').mockReturnValue('ios');
    useCameraPermissions.mockReturnValue([
      {
        granted: true,
        canAskAgain: true,
      },
      mockRequestPermission,
    ]);

    mockTakePictureAsync
      .mockResolvedValueOnce({ base64: 'a'.repeat(500) })
      .mockResolvedValueOnce({ base64: 'a'.repeat(500) })
      .mockResolvedValueOnce({ base64: 'a'.repeat(7000) });

    render(<PuzzleThirteen />);

    expect(await screen.findByText('Target window: 10.0s to 20.0s')).toBeTruthy();

    await act(async () => {
      now = 0;
      jest.advanceTimersByTime(850);
      await Promise.resolve();
    });

    await act(async () => {
      now = 11000;
      jest.advanceTimersByTime(850);
      await Promise.resolve();
    });

    expect(await screen.findByText('Ready: uncover now')).toBeTruthy();

    await act(async () => {
      now = 11500;
      jest.advanceTimersByTime(850);
      await Promise.resolve();
    });

    expect(await screen.findByText('Puzzle Solved')).toBeTruthy();
  });
});

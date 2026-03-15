import './mocks/matchMedia.mock';
import React from 'react';
import { act, render, screen } from '@testing-library/react-native';
import { AppState, Platform } from 'react-native';

const mockAddListener = jest.fn();
const mockSetUpdateInterval = jest.fn();
const mockIsAvailableAsync = jest.fn();

jest.mock('expo-sensors', () => ({
  LightSensor: {
    addListener: (...args) => mockAddListener(...args),
    setUpdateInterval: (...args) => mockSetUpdateInterval(...args),
    isAvailableAsync: (...args) => mockIsAvailableAsync(...args),
  },
}));

import PuzzleThirteen from '../components/PuzzleThirteen';

describe('<PuzzleThirteen />', () => {
  let appStateHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    jest.spyOn(AppState, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'change') {
        appStateHandler = handler;
      }

      return {
        remove: jest.fn(),
      };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    appStateHandler = undefined;
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

  it('solves on iOS after screen is off for 10-20 seconds and returns active', async () => {
    const dateNowSpy = jest.spyOn(Date, 'now');
    jest.spyOn(Platform, 'OS', 'get').mockReturnValue('ios');

    render(<PuzzleThirteen />);

    expect(await screen.findByText('Target window: 10.0s to 20.0s')).toBeTruthy();

    await act(async () => {
      dateNowSpy.mockReturnValueOnce(0);
      appStateHandler('inactive');
    });

    await act(async () => {
      dateNowSpy.mockReturnValueOnce(12000);
      appStateHandler('active');
    });

    expect(await screen.findByText('Puzzle Solved')).toBeTruthy();
  });
});


import './mocks/matchMedia.mock';
import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react-native';

jest.mock('expo-brightness', () => ({
  getBrightnessAsync: jest.fn(),
}));

import PuzzleSevenAndEight from '../components/PuzzleSevenAndEight';
import * as Brightness from 'expo-brightness';

describe('<PuzzleSevenAndEight />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    //jest.useRealTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('tracks both brightness directions and solves after seeing low and high brightness', async () => {
    jest.useFakeTimers('modern');
    Brightness.getBrightnessAsync
      .mockResolvedValueOnce(0.9)
      .mockResolvedValueOnce(0.0)
      .mockResolvedValue(1.0);

    render(<PuzzleSevenAndEight />);

    expect(await screen.findByText('good luck!')).toBeTruthy();
    expect(screen.getByText('7: brightness down')).toBeTruthy();
    expect(screen.getByText('8: brightness up')).toBeTruthy();

    await waitFor(() => expect(Brightness.getBrightnessAsync).toHaveBeenCalled());

    await act(async () => {
      jest.advanceTimersByTime(800);
    });

    expect(await screen.findByText('7: brightness down ✅')).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(800);
    });

    expect(await screen.findByText('8: brightness up ✅')).toBeTruthy();
    expect(await screen.findByText('Great work!')).toBeTruthy();
  });

  it('stops polling on unmount', async () => {
    jest.useFakeTimers('modern');
    Brightness.getBrightnessAsync.mockResolvedValue(0.5);

    const view = render(<PuzzleSevenAndEight />);

    await waitFor(() => expect(Brightness.getBrightnessAsync).toHaveBeenCalled());
    const callsBeforeUnmount = Brightness.getBrightnessAsync.mock.calls.length;

    await act(async () => {
      view.unmount();
    });

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    // Flush all pending microtasks (promises)
    await act(async () => {
      for (let i = 0; i < 10; i++) {
        await Promise.resolve();
      }
    });

    expect(Brightness.getBrightnessAsync.mock.calls.length).toBe(callsBeforeUnmount);
  });
});

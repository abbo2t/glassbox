import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import PuzzleOne from '../components/PuzzleOne';
import { Appearance } from 'react-native';

jest.mock('Appearance', () => ({
    getColorScheme: jest.fn(),
    addChangeListener: jest.fn()
}));

describe('<PuzzleOne />', () => {
    it('has 1 child', async () => {
        //Appearance.getColorScheme.mockReturnValueOnce('dark');
        render(<PuzzleOne />);
        const button = await screen.findByText('good luck!');
    });
});

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import PuzzleOne from '../components/PuzzleOne';

describe('<PuzzleOne />', () => {
    it('has 1 child', async () => {
        render(<PuzzleOne />);
        const button = await screen.findByText('good luck!');
    });
});

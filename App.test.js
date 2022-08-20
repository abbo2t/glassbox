import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';

import App from './App';

describe('<App />', () => {
    it('has 1 child', async () => {
        render(<App />);
        const button = await screen.findByText('good luck!');
    });
});

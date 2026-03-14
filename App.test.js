import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({ children }) => children,
}));

jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: () => {
        const React = require('react');
        return {
            Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
            Screen: ({ name, component: Component }) => {
                if (name !== 'Home') {
                    return null;
                }
                return React.createElement(Component, {
                    navigation: { navigate: jest.fn() },
                    route: { params: {} },
                });
            },
        };
    },
}));

import App from './App';

describe('<App />', () => {
    it('has 1 child', async () => {
        render(<App />);
        const button = await screen.findByText('Go to first puzzle');
    });
});

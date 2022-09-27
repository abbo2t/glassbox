import "./mocks/matchMedia.mock"; // Must be imported before the tested file
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import PuzzleOne from "../components/PuzzleOne";
import {
  Appearance,
  NativeEventEmitter,
  NativeModules,
  NativeModule,
  AppearancePreferences,
  NativeSyntheticEvent,
  EventEmitter,
  //RCTNativeAppEventEmitter,
  RCTNativeAppEventEmitter,
  NativeAppEventEmitter,
  NativeAppearance,
} from "react-native";



//const EventEmitter = require('EventEmitter');
//const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

/**
 * Mock the NativeEventEmitter as a normal JS EventEmitter.
 */
// export class NativeEventEmitter extends EventEmitter {
//   constructor() {
//     super(RCTNativeAppEventEmitter.sharedSubscriber);
//   }
// }

// NativeModules.Appearance = {
//   addChangeListener: jest.fn(),
//   //removeChangeListener: jest.fn(),
//   getColorScheme: jest.fn(),
//   useAppearance: jest.fn()
// };

jest.mock(
  '../node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter'
);

// jest.mock(
//   "../node_modules/react-native/Libraries/vendor/emitter/EventEmitter"
// );


// jest.mock(
//   "../node_modules/react-native/Libraries/Utilities/Appearance"
// );
jest.spyOn(Appearance, 'getColorScheme');
jest.spyOn(Appearance, 'addChangeListener');
//jest.spyOn(EventEmitter, )

//console.log(EventEmitter);



// const nativeEventEmitter = new NativeEventEmitter({
//   'removeListeners': () => { console.log('removeListeners') },
//   'addListener': () => { console.log('addlistener called') },
// });

// const mockAppearance = (theme) => {
//   const events = {};
//   jest.spyOn(window, 'addEventListener').mockImplementation((event, handle, options) => {
//     events[event] = handle;
//   });
//   const switchAppearance = new window.Event(theme);
//   act(() => {
//     window.dispatchEvent(switchAppearance);
//   });
// };

const nativeEventEmitter = new NativeEventEmitter();

describe("<PuzzleOne />", () => {
  //console.log(Appearance);
  //const nativeEventEmitter = new NativeEventEmitter();
  it('switches to light mode and back to dark mode', async () => {
    let { container } = render(<PuzzleOne />);
    //nativeEventEmitter.emit('appearanceChanged', {"colorScheme": "light"});
    console.log(container);
    fireEvent(container, 'change', {"colorScheme": "dark"});
    const button = await screen.findByText("good luck!");
    //nativeEventEmitter.emit('appearanceChanged', {"colorScheme": "dark"});
    fireEvent(container, 'appearanceChanged', {"colorScheme": "light"});
    
    expect(Appearance.addChangeListener).toHaveBeenCalled();
    //const button2 = await screen.findByText(" almost there! good luck!");
    
    // mockAppearance('light');
    //expect(screen.getByText('good luck!')).toBeInTheDocument();
   /// mockAppearance('dark');
    //expect(screen.getByText(' almost there! good luck!')).toBeInTheDocument();
  });

  /* it("does the right shit.", async () => {
    // jest
    //   .spyOn(window, "matchMedia")
    //   .mockReturnValue({matches: true})
    //   .mockReturnValueOnce({matches: false})
    //   .mockReturnValueOnce({matches: true});
    const { getByTestId } = render(<PuzzleOne />);
    //console.log(window.matchMedia('(prefers-color-scheme: dark)'));
    const button = await screen.findByText("good luck!");
    //fireEvent(Appearance, 'change', {});
    //Appearance.set({'asfd': 'asdf'});

    nativeEventEmitter.emit('change', { 'colorScheme': 'dark' });
    nativeEventEmitter.emit('appearanceChanged', { 'colorScheme': 'light' });

    let btn2 = await screen.findByText(" almost there! good luck!");
  }); */
});

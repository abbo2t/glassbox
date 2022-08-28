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
  RCTNativeAppEventEmitter,
} from "react-native";
//import { EventEmitter } from "fbemitter";

//const EventEmitter = require('EventEmitter');
 //const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
 /**
  * Mock the NativeEventEmitter as a normal JS EventEmitter.
  */
//class NativeEventEmitter extends EventEmitter {
  /*  constructor() {
     //super(RCTDeviceEventEmitterStatic.sharedSubscriber);
   } */
 //}
/*
function getQuery() {
  if (typeof window === "undefined" || !window.matchMedia) return null;
  return window.matchMedia("(prefers-color-scheme: dark)");
}

function isMediaQueryList(query) {
  return (
    query &&
    query.addListener &&
    query.removeListener 
    //&& typeof query.matches === "boolean"
  );
}

const NativeAppearance = {
  get name() {
    return "NativeAppearance";
  },
  get initialPreferences() {
    const query = getQuery();
    if (isMediaQueryList(query)) {
      return { colorScheme: query.matches ? "dark" : "light" };
    }
    return { colorScheme: "no-preference" };
  },
  addListener() {},
  removeListener() {},
  removeListeners() {},
};

const set = (preferences) => {
  let { colorScheme } = preferences;

  // Don't bother emitting if it's the same value
  if (appearancePreferences.colorScheme !== colorScheme) {
    appearancePreferences = { colorScheme };
    eventEmitter.emit("change", preferences);
  }
};

function NativeAppearanceProvider(props) {
  React.useEffect(() => {
    const query = getQuery();

    function listener({ matches }) {
      const colorScheme = matches ? "dark" : "light";
      SyntheticPlatformEmitter.emit("appearanceChanged", {
        colorScheme,
      });
    }

    if (query) query.addListener(listener);

    return () => {
      if (query) {
        query.removeListener(listener);
      }
    };
  }, []);

  return <View style={{ flex: 1 }} {...props} />;
}

// Initialize the user-facing event emitter
//const eventEmitter = new EventEmitter();

// Initialize preferences synchronously
let appearancePreferences = NativeAppearance.initialPreferences;

// Initialize the native event emitter
const nativeEventEmitter = new NativeEventEmitter(NativeAppearance);
nativeEventEmitter.addListener("appearanceChanged", (newAppearance) => {
  //Appearance.set(newAppearance);
}); */

 //const RCTDeviceEventEmitter = require('RCTNativeAppEventEmitter');
 /**
  * Mock the NativeEventEmitter as a normal JS EventEmitter.
  */
/*  class NativeEventEmitter extends EventEmitter {
   constructor() {
     super(RCTNativeAppEventEmitter.sharedSubscriber);
   }
 } */

 //const eventEmitter = new NativeEventEmitter();
 //eventEmitter.emit('SomeEventYouListenTo');

describe("<PuzzleOne />", () => {
  //console.log(screen);
  it("has 1 child", async () => {
   /*  const colorScheme = Appearance.getColorScheme();
    const eventEmitter = new NativeEventEmitter(NativeAppearance);
 */
    jest
      .spyOn(Appearance, "getColorScheme")
      .mockReturnValue("light")
      .mockReturnValueOnce("dark")
      .mockReturnValueOnce("light");
    render(<PuzzleOne />);
    const button = await screen.findByText("good luck!");
    //window.dispatchEvent(new Event('getColorScheme'));
    //const nativeEmitter = new NativeEventEmitter();
    //foo.emit('getColorScheme');
    //NativeEventEmitter.emit('Appearance.change', ['dark']);
    /*eventEmitter.emit("AppearancePreferences.change", { colorScheme: "dark" });
    eventEmitter.emit("Appearance.change", { colorScheme: "dark" });
    eventEmitter.emit("Appearancechange", { colorScheme: "dark" });
    eventEmitter.emit("AppearanceChange", { colorScheme: "dark" });
    eventEmitter.emit("Appearance-Change", { colorScheme: "dark" });
    eventEmitter.emit("Appearance-change", { colorScheme: "dark" });
    eventEmitter.emit("appearanceChanged", { colorScheme: "dark" });
    eventEmitter.emit("AppearanceListener", { colorScheme: "dark" });
    eventEmitter.emit("Appearance", { colorScheme: "dark" });
    eventEmitter.emit("AppearancePreferences", { colorScheme: "dark" });
    eventEmitter.emit("AppearancePreference", { colorScheme: "dark" });
    eventEmitter.emit("Appearance/change", { colorScheme: "dark" });
    eventEmitter.emit("ColorScheme", { colorScheme: "dark" });
    eventEmitter.emit("colorScheme", { colorScheme: "dark" });
    eventEmitter.emit("MediaQueryListEvent.change", { colorScheme: "dark" });
    eventEmitter.emit("MediaQueryListEvent", { colorScheme: "dark" });
    eventEmitter.emit("MediaQueryList", { colorScheme: "dark" });
    eventEmitter.emit("matchMedia", { colorScheme: "dark" });
    eventEmitter.emit("MatchMedia", { colorScheme: "dark" });
    eventEmitter.emit("change", { colorScheme: "dark" });
    eventEmitter.emit("AddChangeListener", { colorScheme: "dark" });*/

   /*fireEvent(screen, "AppearancePreferences.change", { colorScheme: "dark" });
   fireEvent(screen, "Appearance.change", { colorScheme: "dark" });
   fireEvent(screen, "Appearancechange", { colorScheme: "dark" });
   fireEvent(screen, "AppearanceChange", { colorScheme: "dark" });
   fireEvent(screen, "Appearance-Change", { colorScheme: "dark" });
   fireEvent(screen, "Appearance-change", { colorScheme: "dark" });
   fireEvent(screen, "appearanceChanged", { colorScheme: "dark" });
   fireEvent(screen, "AppearanceListener", { colorScheme: "dark" });
   fireEvent(screen, "Appearance", { colorScheme: "dark" });
   fireEvent(screen, "AppearancePreferences", { colorScheme: "dark" });
   fireEvent(screen, "AppearancePreference", { colorScheme: "dark" });
   fireEvent(screen, "Appearance/change", { colorScheme: "dark" });
   fireEvent(screen, "ColorScheme", { colorScheme: "dark" });
   fireEvent(screen, "colorScheme", { colorScheme: "dark" });
   fireEvent(screen, "MediaQueryListEvent.change", { colorScheme: "dark" });
   fireEvent(screen, "MediaQueryListEvent", { colorScheme: "dark" });
   fireEvent(screen, "MediaQueryList", { colorScheme: "dark" });
   fireEvent(screen, "matchMedia", { colorScheme: "dark" });
   fireEvent(screen, "MatchMedia", { colorScheme: "dark" });*/
   fireEvent(screen.container, "change", { colorScheme: "dark" });
   //fireEvent(screen, "AddChangeListener", { colorScheme: "dark" });

    //appearancePreferences = NativeAppearance;
    //eventEmitter.emit("change", appearancePreferences);

    //window.document.dispatchEvent(new CustomEvent('getColorScheme'));

    const button2 = await screen.findByText("almost there!");
  });
});

import { writable } from 'svelte/store';

export const config = {
  "headlineAvailable": true,
  "subheadlineAvailable": true,
  "tooltipAvailable": true,
  "scaleBarAvailable": true,
  "legendAvailable": true,
  "textSourceAvailable": true,
  "textNoteAvailable": true,
  "textDataAccessAvailable": true,
  "legend1Color": "#cad1d9",
  "legend2Color": "red",
  "legend3Color": "blue",
  "legend4Color": "green"
  // "colorScheme": "multiple" // multiple or single
}

export const APP_HEIGHT = writable(undefined);
export const MAP_WIDTH = writable(undefined);
export const CENTER_ON = writable("europe");

export const csvData = writable(undefined);
export const dataReady = writable(false);
export const selectedLanguage = writable({ value: 'en', label: 'English' });

export const MOUSE = writable(undefined);
MOUSE.set({ 
  x: 0, 
  y: 0,
  tooltip: {}
});
// Chart.js ve react-chartjs-2 bileşenlerini jest ortamında mock'la
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
  Line: () => <div data-testid="mock-line-chart" />,
  Pie: () => <div data-testid="mock-pie-chart" />,
  Doughnut: () => <div data-testid="mock-doughnut-chart" />,
  Radar: () => <div data-testid="mock-radar-chart" />,
  PolarArea: () => <div data-testid="mock-polararea-chart" />,
  Bubble: () => <div data-testid="mock-bubble-chart" />,
  Scatter: () => <div data-testid="mock-scatter-chart" />,
  defaults: {},
  Chart: () => <div data-testid="mock-generic-chart" />,
}));
// Jest ortamı için TextEncoder ve TextDecoder ekle
const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Chart.js ve jsdom için canvas mock'u
try {
  const { createCanvas } = require('canvas');
  global.HTMLCanvasElement.prototype.getContext = function getContext(contextType) {
    // Sadece 2d context için gerçek canvas döndür
    if (contextType === '2d') {
      return createCanvas(1, 1).getContext('2d');
    }
    // Diğer contextler için null
    return null;
  };
} catch (e) {
  // canvas paketi yoksa sessizce geç
}

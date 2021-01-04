import {Grid} from './grid.js';

top.grid = new Grid({
  elGrid: document.getElementById('grid'),
  elOut: document.getElementById('out'),
  elLink: document.getElementById('link'),
  nRow: 16,
  nCol: 16
});

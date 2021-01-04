class Grid {
  constructor(opt) {
    this.opt = opt;

    this.init();
  }

  init() {
    const grid = this;
    if (grid._init) {
      return;
    }
    grid.elGrid = grid.opt.elGrid;
    grid.elOut = grid.opt.elOut;
    grid.elLink = grid.opt.elLink;
    grid._init = true;
    grid._size = grid.opt.nRow * grid.opt.nCol;
    grid._data = new Uint8Array(grid._size);
    grid.loop((x, y) => {
      const elCheck = grid.el('input', {
        type: 'checkbox',
        dataset: {
          x: x,
          y: y
        },
        className: 'cell'
      });
      grid.elGrid.appendChild(elCheck);
      if (x === grid.opt.nCol - 1) {
        grid.elGrid.appendChild(this.el('br'));
      }
    });
    grid.elGrid.addEventListener('click', grid.updateUtf.bind(grid));
  }

  el(tag, opt) {
    opt = Object.assign({}, opt);
    const el = document.createElement(tag);
    for (let o in opt) {
      const v = opt[o];
      if (v instanceof Object) {
        Object.assign(el[o], v);
      } else {
        el[o] = v;
      }
    }
    return el;
  }

  loop(cb) {
    let i = 0;
    for (let y = 0; y < this.opt.nRow; y++) {
      for (let x = 0; x < this.opt.nCol; x++) {
        cb(x, y, i++);
      }
    }
  }

  updateUtf(e) {
    const grid = this;
    const valid = e.target.classList.contains('cell');
    if (!valid) {
      return;
    }

    const p = e.target.dataset.x * 1 + e.target.dataset.y * grid.opt.nCol;

    const v = e.target.checked * 1;
    grid._data[p] = v;
    const col = [];
    const row = [];
    grid.loop((x, y) => {
      const p = x + y * grid.opt.nCol;
      row.push(grid._data[p]);
      if (x === grid.opt.nCol - 1) {
        if (!grid.opt.mirror) {
          row.reverse();
        }
        col.push(grid.toChar(row.join('')));
        row.length = 0;
      }
    });
    const str = col.join('');
    grid.elLink.href = grid.toTixyUrl(str);
    grid.elOut.innerText = str;
  }

  toChar(row) {
    const int = parseInt(row, 2);
    if (!int) {
      return '';
    }
    const char = String.fromCharCode(int);
    return char;
  }
  toTixyUrl(char) {
    const code = `"${char}".charCodeAt(y)&1<<x`;
    const url = new URL('https://tixy.land/');
    url.searchParams.set('code', code);
    return url;
  }
}

export {Grid};

const _ = require('lodash');

const SIZE = 3;
const MAX_ZEROS = 2;
const dx = [-1, 0, 1, 0];
const dy = [0, 1, 0, -1];

const index = (i, j) => {
  return i * SIZE + j;
};

const howManyZeros = a => {
  return _.filter(a, elem => elem == 0).length;
};

const gen = (difficult, moves = 0) => {
  let a = _.fill(Array(SIZE * SIZE), difficult);
  let i = _.random(0, 2);
  let j = _.random(0, 2);
  while (moves > 0 || howManyZeros(a) < MAX_ZEROS) {
    while (true) {
      const k = _.random(0, 3);
      i += dx[k];
      j += dy[k];
      if (!(i < 0 || j < 0 || i >= SIZE || j >= SIZE || a[index(i, j)] == 0)) {
        break;
      }
    }
    a[index(i, j)]--;
    moves--;
  }
  return { board: _.chunk(a, SIZE), difficult, start: { i, j } };
};

// console.log(gen(3));
// {
//   board: [[2, 2, 2], [3, 3, 3], [0, 0, 3]],
//   difficult: 3,
//   start: { i: 2, j: 1 },
// }

// console.log(howManyZeros([0, 3, 4, 5]));

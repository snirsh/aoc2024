import run from "aocrunner";
import chalk from "chalk";

const lineRegex = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

const MAP_WIDTH = 101;
const MAP_HEIGHT = 103;

const parseInput = (rawInput) => rawInput.split('\n').map(line => {
  const match = line.match(lineRegex);
  return {
    x: parseInt(match[1], 10),
    y: parseInt(match[2], 10),
    vx: parseInt(match[3], 10),
    vy: parseInt(match[4], 10),
  };
});

const mod = (a, b) => ((a % b) + b) % b;

function stepRobots(robots, width = MAP_WIDTH, height = MAP_HEIGHT, steps=1) {
  robots.forEach(r => {
    r.x = mod(r.x + r.vx * steps, width);
    r.y = mod(r.y + r.vy * steps, height);
  })
}

function countQuadrants(robots, width = MAP_WIDTH, height = MAP_HEIGHT) {
  const wHalf = Math.floor(width / 2);
  const hHalf = Math.floor(height / 2);

  let ret = 1;
  const xStarts = [0, wHalf + 1];
  const yStarts = [0, hHalf + 1];

  for (const startX of xStarts) {
    for (const startY of yStarts) {
      let count = 0;
      for (const r of robots) {
        if (r.x >= startX && r.x < startX + wHalf &&
          r.y >= startY && r.y < startY + hHalf) {
          count++;
        }
      }
      ret *= count;
    }
  }

  return ret;
}

const visualize = (robots, positions, width = MAP_WIDTH, height = MAP_HEIGHT) => {
  const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => '.'));
  for (const r of robots) {
    grid[r.y][r.x] = '#';
  }

  for (const r of robots) {
    const neighbors = [[r.x + 1, r.y], [r.x - 1, r.y], [r.x, r.y + 1], [r.x, r.y - 1], [r.x + 1, r.y + 1], [r.x - 1, r.y - 1], [r.x + 1, r.y - 1], [r.x - 1, r.y + 1]];
    let neighbor_count = 0
    for (const [nx, ny] of neighbors) {
      if (positions.has(`${nx},${ny}`)) {
        neighbor_count++
      }
    }
    if (neighbor_count > 1) {
      grid[r.y][r.x] = 'O';
    }
  }

  const colors = {
    '#': chalk.red,
    '.': chalk.gray,
    'O': chalk.greenBright,
  }

  return grid.map(row => row.map(cell => colors[cell](cell)).join('')).join('\n');
}

function part1(rawInput) {
  const robots = parseInput(rawInput);
  const width = robots.length === 12 ? 11 : MAP_WIDTH;
  const height = robots.length === 12 ? 7 : MAP_HEIGHT;
  stepRobots(robots, width, height, 100);

  return countQuadrants(robots, width, height);
}

function part2(rawInput) {
  const robots = parseInput(rawInput);
  let stepCount = 0;

  while (true) {
    stepCount++;
    stepRobots(robots);

    const positions = new Set();
    for (const r of robots) {
      positions.add(`${r.x},${r.y}`);
    }

    if (positions.size === robots.length) {
      // console.log(`Found solution after ${stepCount} steps`)
      // console.log(visualize(robots, positions));
      return stepCount;
    }
  }
}

run({
  part1: {
    tests: [
      {
        input: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
        expected: 12,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {},
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});

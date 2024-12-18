import run from "aocrunner"

const parseInput = (rawInput) => {
  return rawInput.split('\n').map(line => {
    const [x, y] = line.split(',').map(Number);
    return {x, y};
  });
}

const canReachTarget = (corrupted, target) => {
  const queue = [{x: 0, y: 0, steps: 0}];
  const visited = new Set(['0,0']);
  
  while (queue.length > 0) {
    const {x, y, steps} = queue.shift();
    
    if (x === target.x && y === target.y) {
      return steps
    }

    for (const [dx, dy] of [[0,1], [1,0], [0,-1], [-1,0]]) {
      const newX = x + dx;
      const newY = y + dy;
      const key = `${newX},${newY}`;

      if (newX < 0 || newX > 70 || newY < 0 || newY > 70) continue;
      if (corrupted.has(key) || visited.has(key)) continue;

      visited.add(key);
      queue.push({x: newX, y: newY, steps: steps + 1});
    }
  }

  return false
}

const checkPathWithPoints = (points, endIndex) => {
  const corrupted = new Set();
  points.slice(0, endIndex).forEach(({x, y}) => {
    corrupted.add(`${x},${y}`);
  });

  return canReachTarget(corrupted, {x: 70, y: 70});
}

const part1 = (rawInput) => {
  const corruptedPoints = parseInput(rawInput);
  return checkPathWithPoints(corruptedPoints, 1024);
}

const part2 = (rawInput) => {
  const corruptedPoints = parseInput(rawInput);
  
  for (let i = 0; i < corruptedPoints.length; i++) {
    if (!checkPathWithPoints(corruptedPoints, i + 1)) {
      const {x, y} = corruptedPoints[i];
      return `${x},${y}`;
    }
  }
}

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

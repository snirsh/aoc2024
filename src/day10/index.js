import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput.split("\n").map((row) => row.split("").map(Number))

const COORDS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

const findAllTrailHeads = (matrix) => {
  const trailHeads = []
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === 0) {
        trailHeads.push([i, j])
      }
    }
  }
  return trailHeads
}

const getValidNeighbors = (matrix, currentCord) => {
  const coordVal = matrix[currentCord[0]][currentCord[1]]
  return COORDS.map(([x, y]) => [
    currentCord[0] + x,
    currentCord[1] + y,
  ]).filter(
    ([x, y]) =>
      x < matrix.length &&
      x >= 0 &&
      y < matrix[0].length &&
      y >= 0 &&
      matrix[x][y] === coordVal + 1,
  )
}

const findTrail = (matrix, start) => {
  const queue = [start]
  const visited = new Set()
  let score = 0
  while (queue.length > 0) {
    const nextQueue = []
    for (const cord of queue) {
      const key = cord.join(",")
      if (visited.has(key)) {
        continue
      }
      visited.add(key)
      const neighbors = getValidNeighbors(matrix, cord)
      if (neighbors.length === 0) {
        if (matrix[cord[0]][cord[1]] === 9) {
          score++
        }
        continue
      }
      nextQueue.push(...neighbors)
    }
    queue.splice(0, queue.length, ...nextQueue)
  }
  return score
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const trailHeads = findAllTrailHeads(input)

  return trailHeads.reduce(
    (acc, trailHead) => acc + findTrail(input, trailHead),
    0,
  )
}

const part2 = (rawInput) => {
  const matrix = parseInput(rawInput)
  const rows = matrix.length
  const cols = matrix[0].length

  const dp = Array.from({ length: rows }, () => Array(cols).fill(-1))

  const dfs = (x, y) => {
    if (dp[x][y] !== -1) {
      return dp[x][y]
    }
    if (matrix[x][y] === 9) {
      dp[x][y] = 1
      return 1
    }

    return getValidNeighbors(matrix, [x, y]).reduce(
      (acc, [dx, dy]) => acc + dfs(dx, dy),
      0,
    )
  }

  return findAllTrailHeads(matrix).reduce((acc, [x, y]) => acc + dfs(x, y), 0)
}

run({
  part1: {
    tests: [
      {
        input: `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`,
        expected: 2,
      },
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 36,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....`,
        expected: 3,
      },
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 81,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

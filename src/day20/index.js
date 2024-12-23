import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput.split("\n").map((line) => line.split(""))

const findStartAndEnd = (grid) => {
  let start = { x: 0, y: 0 }
  let end = { x: 0, y: 0 }

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "S") start = { x, y }
      if (grid[y][x] === "E") end = { x, y }
    }
  }

  return { start, end }
}

const getValidNeighbors = (grid, x, y, visited) => {
  const neighbors = [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]

  return neighbors.filter(([nx, ny]) => {
    if (nx < 0 || nx >= grid[0].length || ny < 0 || ny >= grid.length)
      return false
    if (grid[ny][nx] === "#" || visited.has(`${nx},${ny}`)) return false
    return true
  })
}

const findShortestPath = (grid, start, end) => {
  const visited = new Set()
  const queue = [start]
  const path = []

  while (queue.length > 0) {
    const pos = queue.shift()
    path.push(pos)

    if (pos.x === end.x && pos.y === end.y) break

    visited.add(`${pos.x},${pos.y}`)

    const neighbors = getValidNeighbors(grid, pos.x, pos.y, visited)
    if (neighbors.length > 0) {
      queue.push({ x: neighbors[0][0], y: neighbors[0][1] })
    }
  }

  return path
}

const countSkips = (path, minSaved = 100, maxDistance = 2) => {
  let skips = 0
  const savedFrequency = {}

  for (let i = 0; i < path.length - 1; i++) {
    for (let j = i + 1; j < path.length; j++) {
      const first = path[i]
      const second = path[j]
      const distance = j - i

      const manhattanDist =
        Math.abs(first.x - second.x) + Math.abs(first.y - second.y)

      if (manhattanDist <= maxDistance) {
        const timesSaved = distance - manhattanDist

        if (timesSaved >= minSaved) {
          skips++
          savedFrequency[timesSaved] = (savedFrequency[timesSaved] || 0) + 1
        }
      }
    }
  }

  return skips
}

const part1 = (rawInput) => {
  const grid = parseInput(rawInput)
  const { start, end } = findStartAndEnd(grid)
  const path = findShortestPath(grid, start, end)
  return countSkips(path, 100, 2)
}

const part2 = (rawInput) => {
  const grid = parseInput(rawInput)
  const { start, end } = findStartAndEnd(grid)
  const path = findShortestPath(grid, start, end)
  return countSkips(path, 100, 20)
}

run({
  part1: {
    tests: [
      {
        input: `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`,
        expected: 0,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // Add tests here
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

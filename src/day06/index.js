import run from "aocrunner"
import { visualizeRun } from "./visualizerUtil.js"

const parseInput = (rawInput) => rawInput.split("\n")

const DIRECTIONS = ["U", "R", "D", "L"]
const DIR_TO_COORD = {
  "U": [-1, 0],
  "R": [0, 1],
  "D": [1, 0],
  "L": [0, -1],
}

function turnRight(dir) {
  const idx = DIRECTIONS.indexOf(dir)
  return DIRECTIONS[(idx + 1) % DIRECTIONS.length]
}

function outOfBounds(grid, [r, c]) {
  return r < 0 || r >= grid.length || c < 0 || c >= grid[0].length
}

function findGuardStart(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "^") {
        return [i, j]
      }
    }
  }
  return null
}

function simulate(grid, startPos, startDir, obstruction, visualize = true) {
  let dir = startDir
  let pos = startPos.slice()

  const visitedStates = new Set()
  visitedStates.add(`${pos[0]},${pos[1]},${dir}`)

  const path = visualize ? [] : null

  while (true) {
    const [dr, dc] = DIR_TO_COORD[dir]
    const nextPos = [pos[0] + dr, pos[1] + dc]

    if (outOfBounds(grid, nextPos)) {
      return false
    }

    if (grid[nextPos[0]][nextPos[1]] === "#") {
      dir = turnRight(dir)
    } else {
      if (visualize) {
        path.push({ r: nextPos[0], c: nextPos[1], dir })
      }
      pos = nextPos
      const stateKey = `${pos[0]},${pos[1]},${dir}`
      if (visitedStates.has(stateKey)) {
        visualize? console.log(visualizeRun(grid, path, obstruction), '\n') : null
        return true
      }
      visitedStates.add(stateKey)
    }
  }
}

const part1 = (rawInput, visualize = false) => {
  const input = parseInput(rawInput)
  const grid = input.map(row => row.split(''))

  const startPos = findGuardStart(grid)
  let startDir = "U"

  const visitedPositions = new Set()
  visitedPositions.add(`${startPos[0]},${startPos[1]}`)

  let dir = startDir
  let pos = startPos.slice()

  const path = visualize ? [] : null

  while (true) {
    const [dr, dc] = DIR_TO_COORD[dir]
    const nextPos = [pos[0] + dr, pos[1] + dc]

    if (outOfBounds(grid, nextPos)) {
      visualize ? path.push({ r: nextPos[0], c: nextPos[1], dir }) : null
      break
    }

    if (grid[nextPos[0]][nextPos[1]] === "#") {
      dir = turnRight(dir)
    } else {
      if (visualize) {
        path.push({ r: nextPos[0], c: nextPos[1], dir })
      }
      pos = nextPos
      visitedPositions.add(`${pos[0]},${pos[1]}`)
    }
  }

  if (visualize) {
    console.log(visualizeRun(grid, path), '\n')
  }

  return visitedPositions.size
}

const part2 = (rawInput, visualize = false) => {
  const input = parseInput(rawInput)
  const grid = input.map(row => row.split(''))

  const startPos = findGuardStart(grid)
  const startDir = "U"

  const candidates = []
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === '.' && !(r === startPos[0] && c === startPos[1])) {
        candidates.push([r, c])
      }
    }
  }

  let loopCount = 0

  for (const cand of candidates) {
    const [cr, cc] = cand
    const original = grid[cr][cc]
    grid[cr][cc] = '#'

    const isLoop = simulate(grid, startPos, startDir, [cr, cc], visualize)

    if (isLoop) {
      loopCount++
    }

    grid[cr][cc] = original
  }

  return loopCount
}

run({
  part1: {
    tests: [{
      input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`, expected: 41,
    }], solution: part1,
  },
  part2: {
    tests: [{
      input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`, expected: 6,
    }], solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})

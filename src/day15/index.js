import run from "aocrunner"

function getStartPos(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "@") {
        return { x, y }
      }
    }
  }
}

const parseInput = (rawInput) => {
  const [map, movements] = rawInput.split("\n\n")
  const grid = map.split("\n").map((line) => line.split(""))
  const moves = movements.replace(/\n/g, "").split("")

  return { grid, moves }
}

const calculateGPS = ({ x, y }) => {
  return 100 * y + x
}

const dirToVector = (dir) => {
  switch (dir) {
    case "^":
      return { x: 0, y: -1 }
    case "v":
      return { x: 0, y: 1 }
    case "<":
      return { x: -1, y: 0 }
    case ">":
      return { x: 1, y: 0 }
  }
}

const simulateMovementP1 = (grid, position, direction, part = 1) => {
  const dirVector = dirToVector(direction)
  const newPosition = {
    x: position.x + dirVector.x,
    y: position.y + dirVector.y,
  }

  const inBounds = (x, y) =>
    y >= 0 && y < grid.length && x >= 0 && x < grid[0].length

  if (
    !inBounds(newPosition.x, newPosition.y) ||
    grid[newPosition.y][newPosition.x] === "#"
  ) {
    return position
  }

  if (grid[newPosition.y][newPosition.x] === "O") {
    const dx = dirVector.x,
      dy = dirVector.y
    let checkX = newPosition.x,
      checkY = newPosition.y
    const boxChain = []

    while (inBounds(checkX, checkY) && grid[checkY][checkX] === "O") {
      boxChain.push({ x: checkX, y: checkY })
      checkX += dx
      checkY += dy
    }

    if (
      !inBounds(checkX, checkY) ||
      grid[checkY][checkX] === "#" ||
      grid[checkY][checkX] === "O"
    ) {
      return position
    }

    for (let i = boxChain.length - 1; i >= 0; i--) {
      const { x: bx, y: by } = boxChain[i]
      grid[by][bx] = "."
      grid[by + dy][bx + dx] = "O"
    }

    grid[position.y][position.x] = "."
    grid[newPosition.y][newPosition.x] = "@"
    return newPosition
  }

  grid[position.y][position.x] = "."
  grid[newPosition.y][newPosition.x] = "@"
  return newPosition
}

const getAllBoxPositions = (grid) => {
  const boxPositions = []
  for (let x = 0; x < grid[0].length; x++) {
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] === "O" || grid[y][x] === "[") {
        boxPositions.push({ x, y })
      }
    }
  }
  return boxPositions
}

const visualize = (grid) => {
  console.log(grid.map((row) => row.join("")).join("\n"))
}

const part1 = (rawInput) => {
  const { grid, moves } = parseInput(rawInput)
  let position = getStartPos(grid)
  for (const move of moves) {
    position = simulateMovementP1(grid, position, move)
  }

  return getAllBoxPositions(grid)
    .map(calculateGPS)
    .reduce((acc, val) => acc + val, 0)
}

const fixMap = (grid) => {
  /**
   * If the tile is #, the new map contains ## instead.
   * If the tile is O, the new map contains [] instead.
   * If the tile is ., the new map contains .. instead.
   * If the tile is @, the new map contains @. instead.
   */
  const newGrid = []
  for (let y = 0; y < grid.length; y++) {
    const newRow = []
    for (let x = 0; x < grid[0].length; x++) {
      switch (grid[y][x]) {
        case "#":
          newRow.push("#", "#")
          break
        case "O":
          newRow.push("[", "]")
          break
        case ".":
          newRow.push(".", ".")
          break
        case "@":
          newRow.push("@", ".")
          break
      }
    }
    newGrid.push(newRow)
  }
  return newGrid
}

const tryMove = (grid, moveQueue, y, x, dy, dx) => {
  if (grid[y + dy][x + dx] === "#") return false
  if (
    dy === 0 &&
    (grid[y + dy][x + dx] === "[" || grid[y + dy][x + dx] === "]")
  ) {
    if (!tryMove(grid, moveQueue, y + dy, x + dx, dy, dx)) return false
  } else if (grid[y + dy][x + dx] === "[") {
    if (!tryMove(grid, moveQueue, y + dy, x + dx, dy, dx)) return false
    if (!tryMove(grid, moveQueue, y + dy, x + 1, dy, dx)) return false
  } else if (grid[y + dy][x + dx] === "]") {
    if (!tryMove(grid, moveQueue, y + dy, x + dx, dy, dx)) return false
    if (!tryMove(grid, moveQueue, y + dy, x - 1, dy, dx)) return false
  }
  moveQueue[[y + dy, x + dx]] = grid[y][x]
  if (!moveQueue[[y, x]]) moveQueue[[y, x]] = "."
  return true
}

function simulateMovementP2(grid, position, move) {
  const { x, y } = position
  const { x: dx, y: dy } = dirToVector(move)

  const newPosition = { x: x + dx, y: y + dy }

  if (grid[newPosition.y][newPosition.x] === "#") {
    return position
  }
  if (grid[newPosition.y][newPosition.x] === ".") {
    grid[y][x] = "."
    grid[newPosition.y][newPosition.x] = "@"
    return newPosition
  }
  let moveQueue = {}
  const shouldMove = tryMove(grid, moveQueue, y, x, dy, dx)
  if (!shouldMove) return position
  for (const [pos, tile] of Object.entries(moveQueue)) {
    const [y, x] = pos.split(",").map(Number)
    grid[y][x] = tile
  }
  if (grid[newPosition.y][newPosition.x] === ".") {
    grid[y][x] = "."
    grid[newPosition.y][newPosition.x] = "@"
  }
  return newPosition
}

const part2 = (rawInput) => {
  const { grid: oldGrid, moves } = parseInput(rawInput)
  const grid = fixMap(oldGrid)

  let position = getStartPos(grid)
  for (const move of moves) {
    position = simulateMovementP2(grid, position, move)
  }
  return getAllBoxPositions(grid)
    .map(calculateGPS)
    .reduce((acc, val) => acc + val, 0)
}

run({
  part1: {
    tests: [
      {
        input: `
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`,
        expected: 2028,
      },
      {
        input: `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
        expected: 10092,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`,
        expected: 618,
      },
      {
        input: `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
        expected: 9021,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

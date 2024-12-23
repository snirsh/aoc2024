import run from "aocrunner"

const parseInput = (rawInput) => rawInput

const XMAS_STR = "XMAS"

const getAllNeighbors = (matrix, start) => {
  const neighborCords = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
  ]
  const N = matrix.length
  const M = matrix[0].length
  const validNeighbors = neighborCords.map(([x, y]) => {
    const coords = []
    for (let i = 0; i < 4; i++) {
      const curr_xs = start[0] + x * i
      if (curr_xs < 0 || curr_xs >= N) {
        return null
      }
      const curr_ys = start[1] + y * i
      if (curr_ys < 0 || curr_ys >= M) {
        return null
      }
      coords.push([curr_xs, curr_ys])
    }
    return coords
  })
  return validNeighbors.filter((coords) => coords !== null)
}

const getDiagonalNeighbors = (matrix, start) => {
  const neighborCords = [
    [
      [-1, -1],
      [1, 1],
    ],
    [
      [1, -1],
      [-1, 1],
    ],
  ]
  const N = matrix.length
  const M = matrix[0].length
  const validNeighbors = neighborCords.map(([beg, end]) => {
    if (
      beg[0] + start[0] < 0 ||
      beg[0] + start[0] >= N ||
      beg[1] + start[1] < 0 ||
      beg[1] + start[1] >= M
    ) {
      return null
    }
    if (
      end[0] + start[0] < 0 ||
      end[0] + start[0] >= N ||
      end[1] + start[1] < 0 ||
      end[1] + start[1] >= M
    ) {
      return null
    }
    return [
      [start[0] + beg[0], start[1] + beg[1]],
      start,
      [start[0] + end[0], start[1] + end[1]],
    ]
  })
  return validNeighbors.filter((coords) => coords !== null)
}

function findXMAS(input, neighbors) {
  const resolveNeighbors = neighbors
    .map((coords) => {
      return coords.map(([x, y]) => input[x][y]).join("")
    })
    .filter((str) => str.includes(XMAS_STR))
  return resolveNeighbors.length
}

function findMas(input, neighbors) {
  const resolveNeighbors = neighbors.map((coords) => {
    return coords.map(([x, y]) => input[x][y]).join("")
  })
  return resolveNeighbors.filter((str) => str === "SAM" || str === "MAS")
    .length === 2
    ? 1
    : 0
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((row) => row.split(""))
  let result = 0
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === "X") {
        const neighbors = getAllNeighbors(input, [i, j])
        result += findXMAS(input, neighbors)
      }
    }
  }

  return result
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
    .split("\n")
    .map((row) => row.split(""))
  let result = 0
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === "A") {
        // console.log('Found A in ', i, j)
        const neighbors = getDiagonalNeighbors(input, [i, j], 2)
        result += findMas(input, neighbors)
      }
    }
  }

  return result
}

run({
  part1: {
    tests: [
      {
        input: `..X...
.SAMX.
.A..A.
XMAS.S
.X....`,
        expected: 4,
      },
      {
        input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 18,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `X.Y
.A.
N.Y`,
        expected: 0,
      },
      {
        input: `.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`,
        expected: 9,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split('\n').map(row => row.split(''))

const getDotsInLine = (r1, c1, r2, c2, dist) => {
  const dr = r2 - r1
  const dc = c2 - c1
  const dots = []
  for (let i = 1; i < dist; i++) {
    dots.push({ r: r1 + dr * i / dist, c: c1 + dc * i / dist })
  }
  return dots
}

const calculateAntinodes = (coords) => {
  const antinodes = []

  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const { r: r1, c: c1 } = coords[i]
      const { r: r2, c: c2 } = coords[j]

      const dr = r2 - r1
      const dc = c2 - c1

      const antinode1 = { r: r1 - dr, c: c1 - dc }
      const antinode2 = { r: r2 + dr, c: c2 + dc }

      antinodes.push(antinode1, antinode2)
    }
  }

  return antinodes
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const antennas = {}

  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[r].length; c++) {
      const cell = input[r][c]
      if (cell !== '.') {
        antennas[cell] ??= []
        antennas[cell].push({ r, c })
      }
    }
  }
  const antiNodes = Object.values(antennas).map(calculateAntinodes).flat().filter(({ r, c }) => r >= 0 && c >= 0 && r < input.length && c < input[0].length).sort((a, b) => a.r - b.r || a.c - b.c)

  return new Set(antiNodes.map(({ r, c }) => `${r},${c}`)).size
}

function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const rows = input.length
  const cols = input[0].length

  const antennas = {}
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = input[r][c]
      if (cell !== '.') {
        antennas[cell] ??= []
        antennas[cell].push({ r, c })
      }
    }
  }

  const antinodesSet = new Set()

  for (const freq in antennas) {
    const coords = antennas[freq]
    if (coords.length < 2) continue

    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const { r: r1, c: c1 } = coords[i]
        const { r: r2, c: c2 } = coords[j]

        const dr = r2 - r1
        const dc = c2 - c1
        const g = gcd(dr, dc)
        const drStep = dr / g
        const dcStep = dc / g

        let rr = r1
        let cc = c1
        while (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
          antinodesSet.add(`${rr},${cc}`)
          rr += drStep
          cc += dcStep
        }

        rr = r1
        cc = c1
        while (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
          antinodesSet.add(`${rr},${cc}`)
          rr -= drStep
          cc -= dcStep
        }
      }
    }
  }

  return antinodesSet.size
}

run({
  part1: {
    tests: [
      {
        input: `..........
..........
..........
....a.....
..........
.....a....
..........
..........
..........
..........`,
        expected: 2,
      },
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 14,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `T....#....
...T......
.T....#...
.........#
..#.......
..........
...#......
..........
....#.....
..........`,
        expected: 6,
      },
      {
        input: `..........
..........
..........
....a.....
..........
.....a....
..........
..........
..........
..........`,
        expected: 34
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
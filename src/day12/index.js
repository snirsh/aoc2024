import run from "aocrunner"

const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]

const parseInput = rawInput => {
  const grid = new Map()
  rawInput.split("\n").forEach((line, y) => {
    [...line].forEach((char, x) => {
      if (/[A-Z]/.test(char)) grid.set(`${x},${y}`, char)
    })
  })
  return grid
}

const floodFill = (grid, start) => {
  const region = new Set([start])
  const queue = [start]
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  const symbol = grid.get(start)
  while (queue.length) {
    const [x, y] = queue.pop().split(",").map(Number)
    for (const [dx, dy] of dirs) {
      const nextPos = `${x + dx},${y + dy}`
      if (grid.has(nextPos) && !region.has(nextPos) && grid.get(nextPos) === symbol) {
        region.add(nextPos)
        queue.push(nextPos)
      }
    }
  }
  return region
}

const getPerimeter = region => {
  const edges = new Set()
  for (const pos of region) {
    const [x, y] = pos.split(",").map(Number)
    for (const [dx, dy] of dirs) {
      const nextPos = `${x + dx},${y + dy}`
      if (!region.has(nextPos)) edges.add(JSON.stringify([nextPos, dx, dy]))
    }
  }
  return edges
}

const getSidesCount = region => {
  const edges = getPerimeter(region)
  let sideCount = 0
  while (edges.size) {
    const edge = [...edges][0]
    const [pos, dx, dy] = JSON.parse(edge)
    edges.delete(edge)
    sideCount++
    const [px, py] = pos.split(",").map(Number)
    let nx = px - dy, ny = py + dx, key = JSON.stringify([`${nx},${ny}`, dx, dy])
    while (edges.has(key)) {
      edges.delete(key)
      nx = nx - dy
      ny = ny + dx
      key = JSON.stringify([`${nx},${ny}`, dx, dy])
    }
    nx = px + dy
    ny = py - dx
    key = JSON.stringify([`${nx},${ny}`, dx, dy])
    while (edges.has(key)) {
      edges.delete(key)
      nx = nx + dy
      ny = ny - dx
      key = JSON.stringify([`${nx},${ny}`, dx, dy])
    }
  }
  return sideCount
}

const solve = (rawInput, part) => {
  const grid = parseInput(rawInput)
  const uncovered = new Set(grid.keys())
  const regions = []
  while (uncovered.size) {
    const start = uncovered.values().next().value
    const region = floodFill(grid, start)
    for (const p of region) uncovered.delete(p)
    regions.push(region)
  }
  let total = 0
  for (const region of regions) total += region.size * (part === 1 ? getPerimeter(region).size : getSidesCount(region))
  return total
}

const part1 = (rawInput) => {
  return solve(rawInput, 1)
}

const part2 = (rawInput) => {
  return solve(rawInput, 2)
}

run({
  part1: {
    tests: [
      {
        input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1930,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1206,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
  trimTestInputs: true,
})

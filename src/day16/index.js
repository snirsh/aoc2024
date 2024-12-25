import run from "aocrunner"

const DIRECTION_CHANGE_COST = 1000
const DIRECTIONS = [
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
]

const parseInput = (rawInput) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""))

const findPos = (grid, char) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === char) return { x, y }
    }
  }
  return null
}

const isWalkable = (grid, x, y) => {
  return (
    x >= 0 &&
    x < grid[0].length &&
    y >= 0 &&
    y < grid.length &&
    grid[y][x] !== "#"
  )
}

const createStateKey = (x, y, d) => `${x},${y},${d}`

const runDijkstra = (grid, start, end) => {
  const visited = new Map()
  const pq = []

  for (let d = 0; d < DIRECTIONS.length; d++) {
    const key = createStateKey(start.x, start.y, d)
    visited.set(key, 0)
    pq.push({ x: start.x, y: start.y, d, cost: 0 })
  }

  const processState = () => {
    pq.sort((a, b) => a.cost - b.cost)
    return pq.shift()
  }

  while (pq.length > 0) {
    const { x, y, d, cost } = processState()
    const currentKey = createStateKey(x, y, d)
    if (visited.get(currentKey) < cost) continue

    const nx = x + DIRECTIONS[d].dy
    const ny = y + DIRECTIONS[d].dx
    if (isWalkable(grid, nx, ny)) {
      const newCost = cost + 1
      const nextKey = createStateKey(nx, ny, d)
      const prevCost = visited.get(nextKey)
      if (prevCost === undefined || newCost < prevCost) {
        visited.set(nextKey, newCost)
        pq.push({ x: nx, y: ny, d, cost: newCost })
      }
    }

    for (const nd of [(d + 1) % 4, (d + 3) % 4]) {
      const turnCost = cost + DIRECTION_CHANGE_COST
      const turnKey = createStateKey(x, y, nd)
      const prevTurnCost = visited.get(turnKey)
      if (prevTurnCost === undefined || turnCost < prevTurnCost) {
        visited.set(turnKey, turnCost)
        pq.push({ x, y, d: nd, cost: turnCost })
      }
    }
  }

  let minEndCost = Infinity
  for (let d = 0; d < DIRECTIONS.length; d++) {
    const endCost = visited.get(createStateKey(end.x, end.y, d))
    if (endCost !== undefined && endCost < minEndCost) {
      minEndCost = endCost
    }
  }

  return { visited, start, end, minEndCost, grid }
}

const findSingleShortestPath = (grid, start, end) => {
  const rows = grid.length
  const cols = grid[0].length

  const dist = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Array(4).fill(Infinity)),
  )

  const prev = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Array(4).fill(null)),
  )

  const pq = []
  for (let i = 0; i < DIRECTIONS.length; i++) {
    dist[start.y][start.x][i] = 0
    pq.push({
      x: start.x,
      y: start.y,
      dirIndex: i,
      cost: 0,
      steps: 0,
      dirChanges: 0,
    })
  }

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost)
    const current = pq.shift()
    const { x, y, dirIndex, cost, steps, dirChanges } = current

    if (cost > dist[y][x][dirIndex]) continue
    if (x === end.x && y === end.y) {
      return reconstructPath(prev, end, dirIndex, start)
    }

    for (let nd = 0; nd < DIRECTIONS.length; nd++) {
      const { dx, dy } = DIRECTIONS[nd]
      const nx = x + dx
      const ny = y + dy
      if (!isWalkable(grid, nx, ny)) continue

      const newDirChanges = nd === dirIndex ? dirChanges : dirChanges + 1
      const newSteps = steps + 1
      const newCost = newSteps + newDirChanges * DIRECTION_CHANGE_COST

      if (newCost < dist[ny][nx][nd]) {
        dist[ny][nx][nd] = newCost
        prev[ny][nx][nd] = { x, y, dirIndex }
        pq.push({
          x: nx,
          y: ny,
          dirIndex: nd,
          cost: newCost,
          steps: newSteps,
          dirChanges: newDirChanges,
        })
      }
    }
  }

  return null
}

const reconstructPath = (prev, end, endDirIndex, start) => {
  const path = []
  let current = { x: end.x, y: end.y }
  let currentDir = endDirIndex

  while (true) {
    path.push({ x: current.x, y: current.y })
    if (current.x === start.x && current.y === start.y) break

    const prevState = prev[current.y][current.x][currentDir]
    if (!prevState) return null

    current = { x: prevState.x, y: prevState.y }
    currentDir = prevState.dirIndex
  }

  return path.reverse()
}

const calculateScore = (path) => {
  if (path.length <= 1) return 0

  const getDirection = (a, b) => {
    const dx = b.x - a.x
    const dy = b.y - a.y
    if (dx === 1) return "R"
    if (dx === -1) return "L"
    if (dy === 1) return "D"
    if (dy === -1) return "U"
    return null
  }

  let dirChanges = 1
  let prevDir = null

  for (let i = 1; i < path.length; i++) {
    const currentDir = getDirection(path[i - 1], path[i])
    if (prevDir && prevDir !== currentDir) dirChanges++
    prevDir = currentDir
  }

  return path.length - 1 + dirChanges * DIRECTION_CHANGE_COST
}

const getAllShortestPathTiles = (visited, grid, start, end, minEndCost) => {
  const queue = []
  const onShortestPath = new Set()

  for (let d = 0; d < DIRECTIONS.length; d++) {
    const endKey = createStateKey(end.x, end.y, d)
    if (visited.get(endKey) === minEndCost) {
      queue.push({ x: end.x, y: end.y, d })
      onShortestPath.add(endKey)
    }
  }

  while (queue.length > 0) {
    const { x, y, d } = queue.shift()
    const currentCost = visited.get(createStateKey(x, y, d))

    const px = x - DIRECTIONS[d].dy
    const py = y - DIRECTIONS[d].dx
    if (isWalkable(grid, px, py)) {
      const prevCost = currentCost - 1
      const prevKey = createStateKey(px, py, d)
      if (
        prevCost >= 0 &&
        visited.get(prevKey) === prevCost &&
        !onShortestPath.has(prevKey)
      ) {
        onShortestPath.add(prevKey)
        queue.push({ x: px, y: py, d })
      }
    }

    const turnCost = currentCost - DIRECTION_CHANGE_COST
    if (turnCost >= 0) {
      for (const pd of [(d + 1) % 4, (d + 3) % 4]) {
        const turnKey = createStateKey(x, y, pd)
        if (visited.get(turnKey) === turnCost && !onShortestPath.has(turnKey)) {
          onShortestPath.add(turnKey)
          queue.push({ x, y, d: pd })
        }
      }
    }
  }

  const tiles = new Set(
    Array.from(onShortestPath).map((s) => {
      const [sx, sy] = s.split(",").map(Number)
      return `${sx},${sy}`
    }),
  )

  return tiles.size
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const start = findPos(input, "S")
  const end = findPos(input, "E")

  const path = findSingleShortestPath(input, start, end)
  return path ? calculateScore(path) : null
}

const part2 = (rawInput) => {
  const grid = parseInput(rawInput)
  const start = findPos(grid, "S")
  const end = findPos(grid, "E")

  const { visited, minEndCost } = runDijkstra(grid, start, end)
  return getAllShortestPathTiles(visited, grid, start, end, minEndCost)
}

run({
  part1: {
    tests: [
      {
        input: `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`,
        expected: 11048,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
        expected: 45,
      },
      {
        input: `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

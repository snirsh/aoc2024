import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split('\n')

const POSITIONS = {
  "7": [0, 0], "8": [0, 1], "9": [0, 2],
  "4": [1, 0], "5": [1, 1], "6": [1, 2],
  "1": [2, 0], "2": [2, 1], "3": [2, 2],
  "0": [3, 1], "A": [3, 2],
  "^": [0, 1], "a": [0, 2],
  "<": [1, 0], "v": [1, 1], ">": [1, 2],
}

const DIRECTIONS = {
  "^": [-1, 0],
  "v": [1, 0],
  "<": [0, -1],
  ">": [0, 1],
}

const permutationsOf = (moves) => {
  if (moves.length <= 1) return [moves]

  const results = []
  const used = new Set()

  for (let i = 0; i < moves.length; i++) {
    if (used.has(moves[i])) continue
    used.add(moves[i])

    const rest = [...moves.slice(0, i), ...moves.slice(i + 1)]
    for (const perm of permutationsOf(rest)) {
      results.push([moves[i], ...perm])
    }
  }
  return results
}

const generateMoves = (start, end) => {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  return [
    ...Array(Math.abs(dx)).fill(dx < 0 ? "^" : "v"),
    ...Array(Math.abs(dy)).fill(dy < 0 ? "<" : ">"),
  ]
}

const sequenceToMoveset = (start, end, avoid) => {
  const moves = generateMoves(start, end)
  const allPerms = permutationsOf(moves)

  const validSequences = allPerms
    .filter(perm => {
      let pos = [...start]
      for (const m of perm) {
        pos[0] += DIRECTIONS[m][0]
        pos[1] += DIRECTIONS[m][1]
        if (pos[0] === avoid[0] && pos[1] === avoid[1]) return false
      }
      return true
    })
    .map(perm => perm.join("") + "a")

  return validSequences.length ? validSequences : ["a"]
}

const memo = new Map()

const minLength = (seq, limit = 2, depth = 0) => {
  if (!seq?.length) return 0

  const memoKey = `${seq}|${depth}|${limit}`
  if (memo.has(memoKey)) return memo.get(memoKey)

  let currentPos = depth === 0 ? POSITIONS["A"] : POSITIONS["a"]
  const avoidPos = depth === 0 ? [3, 0] : [0, 0]
  let totalLength = 0

  for (const char of seq) {
    const nextPos = POSITIONS[char]
    if (!nextPos) continue

    const movesets = sequenceToMoveset(currentPos, nextPos, avoidPos)
    let best = Infinity

    if (depth >= limit) {
      best = Math.min(...movesets.map(ms => ms.length))
    } else {
      for (const ms of movesets) {
        best = Math.min(best, minLength(ms, limit, depth + 1))
      }
    }

    totalLength += best === Infinity ? Math.min(...movesets.map(ms => ms.length)) : best
    currentPos = nextPos
  }

  memo.set(memoKey, totalLength)
  return totalLength
}

const calculateComplexity = (code, depthLimit = 2) => {
  const length = minLength(code, depthLimit)
  const numericPart = +code.replace("A", "")
  return length * numericPart
}

const part1 = (rawInput) => {
  const codes = parseInput(rawInput)
  return codes.reduce((sum, code) => sum + calculateComplexity(code, 2), 0)
}

const part2 = (rawInput) => {
  const codes = parseInput(rawInput)
  return codes.reduce((sum, code) => sum + calculateComplexity(code, 25), 0)
}

run({
  part1: {
    tests: [
      {
        input: `029A
980A
179A
456A
379A`,
        expected: 126384,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

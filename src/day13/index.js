import run from "aocrunner"

const parseInput = (rawInput) => {
  const machines = []
  const lines = rawInput
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")

  let currentMachine = {}

  for (const line of lines) {
    if (line.startsWith("Button A:")) {
      const parts = line.split(", ")
      const ax = parseInt(parts[0].split("+")[1], 10)
      const ay = parseInt(parts[1].split("+")[1], 10)
      currentMachine.buttonA = { x: ax, y: ay }
    } else if (line.startsWith("Button B:")) {
      const parts = line.split(", ")
      const bx = parseInt(parts[0].split("+")[1], 10)
      const by = parseInt(parts[1].split("+")[1], 10)
      currentMachine.buttonB = { x: bx, y: by }
    } else if (line.startsWith("Prize:")) {
      const parts = line.split(", ")
      const px = parseInt(parts[0].split("=")[1], 10)
      const py = parseInt(parts[1].split("=")[1], 10)
      currentMachine.prize = { x: px, y: py }
      machines.push({ ...currentMachine })
      currentMachine = {}
    }
  }

  return machines
}

/**
 * Solves the linear equations to find the number of times to press Button A and Button B.
 * Returns null if no valid solution exists.
 *
 * @param {number} ax - Movement along X-axis for Button A.
 * @param {number} ay - Movement along Y-axis for Button A.
 * @param {number} bx - Movement along X-axis for Button B.
 * @param {number} by - Movement along Y-axis for Button B.
 * @param {number} px - Prize X-coordinate.
 * @param {number} py - Prize Y-coordinate.
 * @returns {Array|null} - An array [A, B] or null if no solution.
 */
const findPresses = (ax, ay, bx, by, px, py) => {
  const determinant = ax * by - ay * bx
  if (determinant === 0) {
    return null
  }

  const a = (px * by - py * bx) / determinant
  const b = (py * ax - px * ay) / determinant

  if (a < 0 || b < 0 || !Number.isInteger(a) || !Number.isInteger(b)) {
    return null
  }

  return [a, b]
}

const part1 = (rawInput) => {
  const machines = parseInput(rawInput)
  let totalTokens = 0

  for (const machine of machines) {
    const { buttonA, buttonB, prize } = machine
    const solution = findPresses(
      buttonA.x,
      buttonA.y,
      buttonB.x,
      buttonB.y,
      prize.x,
      prize.y,
    )

    if (solution) {
      const [A, B] = solution
      totalTokens += A * 3 + B * 1
    }
  }

  return totalTokens
}

const part2 = (rawInput) => {
  const machines = parseInput(rawInput)
  let totalTokens = 0
  const OFFSET = 10_000_000_000_000

  for (const machine of machines) {
    const { buttonA, buttonB, prize } = machine
    const solution = findPresses(
      buttonA.x,
      buttonA.y,
      buttonB.x,
      buttonB.y,
      prize.x + OFFSET,
      prize.y + OFFSET,
    )

    if (solution) {
      const [A, B] = solution
      totalTokens += A * 3 + B * 1
    }
  }

  return totalTokens
}

run({
  part1: {
    tests: [
      {
        input: `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
        `,
        expected: 480,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
        `,
        expected: 875318608908,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

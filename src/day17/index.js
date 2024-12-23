import run from "aocrunner"

const parseInput = (rawInput) => {
  const [rawRegisters, rawProgram] = rawInput.split("\n\n")
  const registers = rawRegisters.split("\n").reduce((acc, line) => {
    const [key, value] = line.split(": ")
    acc[key.split(" ")[1]] = parseInt(value)
    return acc
  }, {})
  const program = rawProgram.split(": ")[1].split(",").map(Number)
  return { registers, program }
}

const executeProgram = (program, initialA = 0, initialB = 0, initialC = 0) => {
  const registers = {
    A: initialA,
    B: initialB,
    C: initialC,
  }
  const output = []
  let ip = 0

  const getComboValue = (operand) => {
    if (operand <= 3) return operand
    if (operand === 4) return registers.A
    if (operand === 5) return registers.B
    if (operand === 6) return registers.C
    return 0
  }

  while (ip < program.length) {
    const opcode = program[ip]
    const operand = program[ip + 1]

    switch (opcode) {
      case 0: // adv
        registers.A = registers.A >> getComboValue(operand)
        break
      case 1: // bxl
        registers.B ^= operand
        break
      case 2: // bst
        registers.B = getComboValue(operand) % 8
        break
      case 3: // jnz
        if (registers.A !== 0) {
          ip = operand
          continue
        }
        break
      case 4: // bxc
        registers.B ^= registers.C
        break
      case 5: // out
        output.push(Number(getComboValue(operand) % 8))
        break
      case 6: // bdv
        registers.B = registers.A >> getComboValue(operand)
        break
      case 7: // cdv
        registers.C = registers.A >> getComboValue(operand)
        break
    }
    ip += 2
  }

  return output.join(",")
}

const part1 = (rawInput) => {
  const { program, registers } = parseInput(rawInput)
  return executeProgram(program, registers.A, registers.B, registers.C)
}

const part2 = (rawInput) => {
  const { program } = parseInput(rawInput)
  const len = program.length
  let minValid = 8 ** (len + 1)

  const check = (depth, score) => {
    if (depth === len) {
      if (score < minValid) minValid = score
      return
    }

    for (let i = 0; i < 8; i++) {
      const nextScore = i + 8 * score
      const result = executeProgram(program, Number(nextScore)) // 1, 3, 4, 5, 6, 7
      if (result.split(",")[0] === program[len - 1 - depth].toString()) {
        console.log("found", result, nextScore)
        check(depth + 1, nextScore)
      }
    }
  }

  check(0, 0)
  return Number(minValid)
}

run({
  part1: {
    tests: [
      {
        input: `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`,
        expected: "4,6,3,5,6,3,5,2,1,0",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`,
        expected: 117440,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

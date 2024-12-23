import run from "aocrunner"

const parseInput = (rawInput) => rawInput
const splitRows = (input) => input.split("\n")

const solveNumbers = (numbers, operation) => {
  if (operation === "+") {
    return numbers.reduce((a, b) => a + b, 0)
  }
  if (operation === "*") {
    return numbers.reduce((a, b) => a * b, 1)
  }
  if (operation === "||") {
    return +numbers.reduce((a, b) => a + b, "")
  }
}

const generateOperatorCombinations = (numOperators, part = 1) => {
  const combinations = []
  const operators = part === 1 ? ["+", "*"] : ["+", "*", "||"]

  function backtrack(current) {
    if (current.length === numOperators) {
      combinations.push([...current])
      return
    }

    for (const op of operators) {
      current.push(op)
      backtrack(current)
      current.pop()
    }
  }

  backtrack([])
  return combinations
}

function evaluateExpression(numbers, operators) {
  let result = numbers[0]
  for (let i = 0; i < operators.length; i++) {
    const op = operators[i]
    const num = numbers[i + 1]
    if (op === "+") {
      result += num
    } else if (op === "*") {
      result *= num
    } else if (op === "||") {
      result = solveNumbers([result, num], op)
    }
  }
  return result
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const equations = splitRows(input).map((row) =>
    row
      .split(":")
      .map((part) => part.trim())
      .map((part) => part.split(" ").map((num) => parseInt(num))),
  )
  let numValid = 0

  for (const [ans, numbers] of equations) {
    const target = ans[0]
    const operatorCombinations = generateOperatorCombinations(
      numbers.length - 1,
    )
    for (const operators of operatorCombinations) {
      if (evaluateExpression(numbers, operators) === target) {
        numValid += target
        break
      }
    }
  }

  return numValid
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const equations = splitRows(input).map((row) =>
    row
      .split(":")
      .map((part) => part.trim())
      .map((part) => part.split(" ").map((num) => parseInt(num))),
  )
  let numValid = 0

  for (const [ans, numbers] of equations) {
    const target = ans[0]
    const operatorCombinations = generateOperatorCombinations(
      numbers.length - 1,
      2,
    )
    for (const operators of operatorCombinations) {
      if (evaluateExpression(numbers, operators) === target) {
        numValid += target
        break
      }
    }
  }

  return numValid
}

run({
  part1: {
    tests: [
      {
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 3749,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      //       {
      //         input: `190: 10 19
      // 3267: 81 40 27
      // 83: 17 5
      // 156: 15 6
      // 7290: 6 8 6 15
      // 161011: 16 10 13
      // 192: 17 8 14
      // 21037: 9 7 18 13
      // 292: 11 6 16 20`,
      //         expected: 11387,
      //       },
      {
        input: `156: 15 6`,
        expected: 156,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

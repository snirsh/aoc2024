import run from "aocrunner"

const parseInput = (rawInput) => rawInput.split(' ')
  .map(Number)
  .reduce((acc, stone) => {
    acc[stone] ??= 0
    acc[stone]++
    return acc
  }, {})

const calculateNewStone = (stone) => {
  const stoneStr = stone.toString()
  if (stone === '0') {
    return [1]
  }
  if (stoneStr.length % 2 === 0) {
    const mid = Math.floor(stoneStr.length / 2)
    const left = parseInt(stoneStr.slice(0, mid))
    const right = parseInt(stoneStr.slice(mid))
    return [left, right]
  } else {
    return [stone * 2024]
  }
}

const processStones = (initialStones, targetBlinks) => {
  let stones = {...initialStones}

  for (let blinks = 1; blinks <= targetBlinks; blinks++) {
    const newStones = {}

    for (const [stone, count] of Object.entries(stones)) {
      const calculated = calculateNewStone(stone)
      for (const newStone of calculated) {
        newStones[newStone] ??= 0
        newStones[newStone] += count
      }
    }

    stones = { ...newStones }
  }

  return Object.values(stones).reduce((acc, count) => acc + count, 0)
}

const part1 = (rawInput) => {
  const stones = parseInput(rawInput)
  return processStones(stones, 25)
}

const part2 = (rawInput) => {
  const stones = parseInput(rawInput)
  return processStones(stones, 75)
}

run({
  part1: {
    tests: [
      // {
      //   input: `0 1 10 99 999`,
      //   expected: 5,
      // }
      {
        input: `125 17`,
        expected: 55312,
      }
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

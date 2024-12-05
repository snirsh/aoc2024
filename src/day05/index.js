import run from "aocrunner"

const parseInput = (rawInput) => rawInput

const part1 = (rawInput) => {
  const [p1, p2] = parseInput(rawInput).split("\n\n").map(group => group.split("\n"))
  const rules = p1.map(r => r.split("|").map(Number))
  const pages = p2.map(page => page.split(",").map(Number))
  const rulesTree = {}
  let res = 0

  for (const [a, b] of rules) {
    if (!rulesTree[a]) {
      rulesTree[a] = []
    }
    rulesTree[a].push(b)
  }
  for (const page of pages) {
    let isValid = true
    for (let i = 0; i < page.length - 1; i++) {
      for (let j = i; j < page.length; j++) {
        if (rulesTree[page[j]]?.includes(page[i])) {
          isValid = false
          break
        }
      }
      if (!isValid) {
        break
      }
    }
    if (isValid) {
      res += page[Math.floor(page.length / 2)]
    }
  }

  return res
}

const part2 = (rawInput) => {
  const [p1, p2] = parseInput(rawInput).split("\n\n").map(group => group.split("\n"))
  const rules = p1.map(r => r.split("|").map(Number))
  const pages = p2.map(page => page.split(",").map(Number))
  const rulesTree = {}
  let res = 0

  for (const [a, b] of rules) {
    if (!rulesTree[a]) {
      rulesTree[a] = []
    }
    rulesTree[a].push(b)
  }
  for (const page of pages) {
    let isValid = true
    for (let i = 0; i < page.length - 1; i++) {
      for (let j = i; j < page.length; j++) {
        if (rulesTree[page[j]]?.includes(page[i])) {
          isValid = false
          break
        }
      }
      if (!isValid) {
        break
      }
    }
    if (!isValid) {
      const newPage = page.sort((a, b) => rulesTree[a]?.includes(b) ? 1 : -1)
      res += newPage[Math.floor(newPage.length / 2)]
    }
  }

  return res
}

run({
  part1: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 143,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 123,
      }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

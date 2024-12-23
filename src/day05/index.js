import run from "aocrunner"

const solve = (input, part = 1) =>
  input
    .split("\n\n")
    .map((p, i) =>
      i
        ? p.split("\n").map((x) => x.split(",").map(Number))
        : p
            .split("\n")
            .map((r) => r.split("|").map(Number))
            .reduce(
              (a, [x, y]) => ({
                ...a,
                [x]: [...(a[x] || []), y],
              }),
              {},
            ),
    ) // create a map of pages and the rules sets which are { number: [numbersThatHaveToBeAfter] ...}
    .reduce((rules, pages) =>
      pages
        .map((page) => [
          page,
          [...page].sort((a, b) => (rules[a]?.includes(b) ? -1 : 1)),
        ]) // sort the pages based on the rules
        .filter(([originalPage, sortedPage]) =>
          part === 1
            ? JSON.stringify(originalPage) === JSON.stringify(sortedPage)
            : JSON.stringify(originalPage) !== JSON.stringify(sortedPage),
        ) // p1 : if the original page is the same as the sorted page, it means that the page is sorted, p2: if the original page is not the same as the sorted page, it means that the page is not sorted
        .map(([originalPage, sortedPage]) =>
          part === 1 ? originalPage : sortedPage,
        ) // p1: return the original page, p2: return the sorted page
        .map((p) => p[Math.floor(p.length / 2)]),
    ) // get the middle number of the page
    .reduce((a, v) => a + v, 0) // sum all the middle numbers of the pages

const part1 = (rawInput) => {
  return solve(rawInput)
}

const part2 = (rawInput) => {
  return solve(rawInput, 2)
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
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

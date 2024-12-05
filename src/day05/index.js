import run from "aocrunner"

const solve = (input, part=1) => input.split('\n\n').map((p,i) => i ? p.split('\n').map(x => x.split(',').map(Number)) : p.split('\n').map(r => r.split('|').map(Number)).reduce((a,[x,y]) => ({...a, [x]: [...(a[x]||[]), y]}), {})).reduce((rules,pages) => pages.map(p => [p, [...p].sort((a,b) => rules[a]?.includes(b) ? -1 : 1)]).filter(([o,s]) => part === 1 ? JSON.stringify(o) === JSON.stringify(s) : JSON.stringify(o) !== JSON.stringify(s)).map(([o,s]) => part === 1 ? o : s).map(p => p[Math.floor(p.length/2)])).reduce((a,v) => a+v, 0)

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
      }],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

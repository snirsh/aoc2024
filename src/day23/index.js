import run from "aocrunner"

const parseInput = (rawInput) =>
  rawInput.split("\n").map((line) => line.split("-"))

const findConnectedNodes = (connections, node) => {
  return connections
    .filter(([a, b]) => a === node || b === node)
    .map(([a, b]) => (a === node ? b : a))
}

const createAdjacencyMap = (connections, nodes) => {
  const adjacencyMap = new Map()
  for (const node of nodes) {
    adjacencyMap.set(node, new Set(findConnectedNodes(connections, node)))
  }
  return adjacencyMap
}

const getNodesByDegree = (nodes, adjacencyMap) =>
  nodes
    .map((node) => ({
      node,
      degree: adjacencyMap.get(node).size,
    }))
    .sort((a, b) => b.degree - a.degree)
    .map(({ node }) => node)

const colorGraph = (nodes, adjacencyMap) => {
  const colors = new Map()
  let maxColor = 0

  for (const node of nodes) {
    const usedColors = new Set()
    for (const neighbor of nodes) {
      if (adjacencyMap.get(node).has(neighbor) && colors.has(neighbor)) {
        usedColors.add(colors.get(neighbor))
      }
    }

    let color = 1
    while (usedColors.has(color)) color++
    colors.set(node, color)
    maxColor = Math.max(maxColor, color)
  }

  return maxColor
}

export const findMaxClique = ({
  adjacencyMap,
  nodesByDegree,
  maxPossibleCliqueSize,
  maxClique = [],
}) => {
  const findClique = (candidates, current) => {
    if (
      maxClique.length === maxPossibleCliqueSize ||
      current.length + candidates.length <= maxClique.length ||
      candidates.length === 0
    ) {
      if (current.length > maxClique.length) {
        maxClique = [...current]
      }
      return
    }

    const possibleCandidates = candidates.filter((node) =>
      current.every((currentNode) => adjacencyMap.get(node).has(currentNode)),
    )

    if (possibleCandidates.length === 0) {
      if (current.length > maxClique.length) {
        maxClique = [...current]
      }
      return
    }

    const maxColor = colorGraph(possibleCandidates, adjacencyMap)
    if (current.length + maxColor <= maxClique.length) {
      return
    }

    const nextNode = possibleCandidates[0]
    const newCandidates = possibleCandidates.filter((n) => n !== nextNode)

    findClique(newCandidates, [...current, nextNode])
    findClique(newCandidates, current)
  }

  findClique(nodesByDegree, [])
  return maxClique
}

const findTriplets = ({ adjacencyMap, nodes }) => {
  const triplets = new Set()

  for (const node1 of nodes) {
    const neighbors = adjacencyMap.get(node1)

    for (const node2 of neighbors) {
      const node2Neighbors = adjacencyMap.get(node2)

      for (const node3 of node2Neighbors) {
        if (node3 !== node1 && adjacencyMap.get(node3).has(node1)) {
          triplets.add([node1, node2, node3].sort().join(","))
        }
      }
    }
  }

  return triplets
}

const part1 = (rawInput) => {
  const connections = parseInput(rawInput)
  const nodes = Array.from(new Set(connections.flat()))
  const adjacencyMap = createAdjacencyMap(connections, nodes)

  const triplets = findTriplets({ adjacencyMap, nodes })

  return Array.from(triplets).filter((triplet) =>
    triplet.split(",").some((node) => node.startsWith("t")),
  ).length
}

const part2 = (rawInput) => {
  const connections = parseInput(rawInput)
  const nodes = Array.from(new Set(connections.flat()))
  const adjacencyMap = createAdjacencyMap(connections, nodes)
  const nodesByDegree = getNodesByDegree(nodes, adjacencyMap)
  const maxPossibleCliqueSize =
    Math.min(...nodes.map((node) => adjacencyMap.get(node).size)) + 1

  const maxClique = findMaxClique({
    adjacencyMap,
    nodesByDegree,
    maxPossibleCliqueSize,
  })

  return maxClique.sort().join(",")
}

run({
  part1: {
    tests: [
      {
        input: `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `ka-co
ta-co
de-co
ta-ka
de-ta
ka-de`,
        expected: "co,de,ka,ta",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})

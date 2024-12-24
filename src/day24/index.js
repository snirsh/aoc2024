import run from "aocrunner"
import fs from "fs"
const parseInput = (rawInput) => {
  const [initialValues, gates] = rawInput.trim().split("\n\n")

  const wires = {}
  initialValues.split("\n").forEach((line) => {
    const [wire, value] = line.split(": ")
    wires[wire] = parseInt(value)
  })

  const connections = gates.split("\n").map((line) => {
    const [operation, output] = line.split(" -> ")
    const parts = operation.split(" ")

    return {
      inputs: [parts[0], parts[2]],
      gate: parts[1],
      output,
    }
  })

  return { wires, connections }
}

const executeGate = (gate, input1, input2) => {
  switch (gate) {
    case "AND":
      return input1 & input2
    case "OR":
      return input1 | input2
    case "XOR":
      return input1 ^ input2
  }
}

const simulateCircuit = (wires, connections) => {
  const wireValues = { ...wires }
  let changed = true
  while (changed) {
    changed = false
    for (const { inputs, gate, output } of connections) {
      if (output in wireValues) continue
      if (inputs.every((input) => input in wireValues)) {
        const result = executeGate(
          gate,
          wireValues[inputs[0]],
          wireValues[inputs[1]],
        )
        wireValues[output] = result
        changed = true
      }
    }
  }

  return wireValues
}

const getBinaryNumber = (wireValues, prefix) => {
  return Object.entries(wireValues)
    .filter(([wire]) => wire.startsWith(prefix))
    .sort()
    .map(([, value]) => value)
    .reverse()
    .join("")
}

const part1 = (rawInput) => {
  const { wires, connections } = parseInput(rawInput)
  const wireValues = simulateCircuit(wires, connections)
  return parseInt(getBinaryNumber(wireValues, "z"), 2)
}

const part2 = (rawInput) => {
  const { connections } = parseInput(rawInput)

  const gates = connections.map(({ inputs, gate, output }) => ({
    a: inputs[0],
    op: gate,
    b: inputs[1],
    output,
  }))

  const wireLines = rawInput.trim().split("\n\n")[0].split("\n")
  const inputBitCount = wireLines.length / 2

  const isDirectXOR = (gate) =>
    gate.op === "XOR" && (gate.a.startsWith("x") || gate.b.startsWith("x"))

  const isIndirectXOR = (gate) =>
    gate.op === "XOR" && !gate.a.startsWith("x") && !gate.b.startsWith("x")

  const writesToZWire = (gate) => gate.output.startsWith("z")

  const isGateType = (type) => (gate) => gate.op === type

  const consumesWire = (wire) => (gate) => gate.a === wire || gate.b === wire

  const producesWire = (wire) => (gate) => gate.output === wire

  const flags = new Set()

  const directXORs = gates.filter(isDirectXOR)
  for (const gate of directXORs) {
    const { a, b, output } = gate

    const referencesFirstBit = a === "x00" || b === "x00"
    if (referencesFirstBit) {
      if (output !== "z00") {
        flags.add(output)
      }
      continue
    } else if (output === "z00") {
      flags.add(output)
    }

    if (writesToZWire(gate)) {
      flags.add(output)
    }
  }

  const indirectXORs = gates.filter(isIndirectXOR)
  for (const gate of indirectXORs) {
    if (!writesToZWire(gate)) {
      flags.add(gate.output)
    }
  }

  const outputGates = gates.filter(writesToZWire)
  for (const gate of outputGates) {
    const { op, output } = gate
    const zLast = `z${String(inputBitCount).padStart(2, "0")}`
    const isFinalZWire = output === zLast

    if (isFinalZWire) {
      if (op !== "OR") {
        flags.add(output)
      }
    } else {
      if (op !== "XOR") {
        flags.add(output)
      }
    }
  }

  const followUp = []
  for (const gate of directXORs) {
    const { output } = gate
    if (output === "z00") continue

    const indirectConsumers = indirectXORs.filter(consumesWire(output))
    if (indirectConsumers.length === 0) {
      followUp.push(gate)
      flags.add(output)
    }
  }

  for (const gate of followUp) {
    const { a } = gate
    const intendedResultWire = `z${a.slice(1)}`
    const matchingXOR = indirectXORs.filter(producesWire(intendedResultWire))[0]

    const possibleWires = [matchingXOR.a, matchingXOR.b]

    const matchingORs = gates
      .filter(isGateType("OR"))
      .filter((g) => possibleWires.includes(g.output))

    const orOutput = matchingORs[0].output
    const correctWire = possibleWires.find((w) => w !== orOutput)
    flags.add(correctWire)
  }

  const flagsArr = [...flags].sort((a, b) => a.localeCompare(b))
  return flagsArr.join(",")
}

run({
  part1: {
    tests: [
      {
        input: `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`,
        expected: 2024,
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

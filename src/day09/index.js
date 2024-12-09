import run from "aocrunner"

const parseInput = (rawInput) => rawInput

function createDisk(input) {
  const disk = []
  let fileId = 0
  for (let i = 0; i < input.length; i++) {
    const length = input[i]
    if (i % 2 === 0) {
      for (let k = 0; k < length; k++) {
        disk.push(fileId)
      }
      fileId++
    } else {
      for (let k = 0; k < length; k++) {
        disk.push(null)
      }
    }
  }
  return { disk, maxId: fileId - 1 }
}

function find(disk, fid) {
  let s = -1
  let l = 0
  for (let i = 0; i < disk.length; i++) {
    if (disk[i] === fid) {
      if (s === -1) s = i
      l++
    } else if (s !== -1) {
      break
    }
  }
  return { s, l }
}

function findFree(disk, size, maxIndex) {
  let count = 0
  let j = 0

  for (let i = 0; i < maxIndex; i++) {
    if (disk[i] !== null) {
      count = 0
      continue
    }
    if (count === 0) j = i
    count++
    if (count === size) return j
  }
  return -1
}

function calculateChecksum(disk) {
  return disk.reduce((sum, fileId, index) => {
    if (fileId !== null) {
      sum += fileId * index
    }
    return sum
  }, 0)
}

const part1 = (rawInput) => {
  const input = parseInput(rawInput)
  const { disk } = createDisk(input)

  let i = 0
  let j = disk.length - 1

  while (disk[j] === null) {
    j--
  }

  const newArr = []
  const totalBlocks = disk.reduce((count, block) => (block !== null ? count + 1 : count), 0)

  while (newArr.length < totalBlocks) {
    if (disk[i] !== null) {
      newArr.push(disk[i])
      i++
      continue
    }
    newArr.push(disk[j])
    i++
    j--
    while (j >= 0 && disk[j] === null) {
      j--
    }
  }

  return calculateChecksum(newArr)
}

const part2 = (rawInput) => {
  const input = parseInput(rawInput)
  const { disk, maxId } = createDisk(input)

  for (let fid = maxId; fid >= 0; fid--) {
    const { s, l } = find(disk, fid)
    if (s === -1) continue

    const j = findFree(disk, l, s)
    if (j !== -1) {
      for (let i = s; i < s + l; i++) {
        disk[i] = null
      }
      for (let i = 0; i < l; i++) {
        disk[j + i] = fid
      }
    }
  }

  return calculateChecksum(disk)
}

run({
  part1: {
    tests: [
      {
        input: `12345`,
        expected: 60,
      },
      {
        input: `2333133121414131402`,
        expected: 1928,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2333133121414131402`,
        expected: 2858,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})

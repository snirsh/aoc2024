function visualizeRun(grid, path, obstruction = null) {
  const visualGrid = grid.map(row => row.slice())

  function getMoveDir(pr, pc, r, c) {
    const dr = r - pr
    const dc = c - pc
    if (dr === -1 && dc === 0) return "U"
    if (dr === 1 && dc === 0) return "D"
    if (dr === 0 && dc === -1) return "L"
    if (dr === 0 && dc === 1) return "R"
    return null
  }

  const movementDirections = []
  for (let i = 0; i < path.length; i++) {
    if (i === 0) {
      movementDirections.push(null)
    } else {
      const { r: pr, c: pc } = path[i - 1]
      const { r, c } = path[i]
      movementDirections.push(getMoveDir(pr, pc, r, c))
    }
  }

  if (obstruction) {
    const [or, oc] = obstruction
    visualGrid[or][oc] = "O"
  }

  const verticalDirs = new Set(["U", "D"])
  const horizontalDirs = new Set(["L", "R"])

  visualGrid[path[0].r][path[0].c] = "^"

  for (let i = 1; i < path.length - 1; i++) {
    const { r, c } = path[i]

    if (visualGrid[r][c] === "#" || visualGrid[r][c] === "O") continue

    const currentDir = movementDirections[i]
    const nextDir = movementDirections[i + 1]
    if (nextDir !== currentDir) {
      visualGrid[r][c] = "+"
    } else {
      if (verticalDirs.has(currentDir)) {
        visualGrid[r][c] = "|"
      } else if (horizontalDirs.has(currentDir)) {
        visualGrid[r][c] = "-"
      } else {
        if (visualGrid[r][c] === "." || visualGrid[r][c] === "^") {
          visualGrid[r][c] = "."
        }
      }
    }
  }

  return visualGrid.map(row => row.join('')).join('\n')
}

export { visualizeRun }

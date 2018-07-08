function composerFactory(...tools) {
    function traceLines(grid, linePos) {
      if (grid.length < linePos) {
        return traceLines([...grid, []], linePos)
      }
      return grid
    }

    function traceColuns(line, colunPos) {
      if (line.length < colunPos) {
        return traceColuns([...line, 0], colunPos)
      }
      return line
    }

    function traceStraigthLine([lineOrigin, colunOrigin], [lineDest, colunDest]) {
      function trace(destination, isDiagonal, array) {
          const lines = array || []
          function traceColun(dest, coluns){
            const line = [
              ...(coluns || []), 
              isDiagonal ? 
                lines.length === (coluns || []).length ? 1 : 0 :
                1
                  ]
  
            if (line.length < dest) {
              return traceColun(dest, line)
            }
            return line
          }
          const grid = [...lines, traceColun(destination[1])]
          return grid.length < destination[0] ?
            trace(destination, isDiagonal, grid) :
            grid
      }
      const relativeDest = [
        lineDest - lineOrigin,
        colunDest - colunOrigin,
      ]
      
      const isDiagonal = relativeDest[0] === relativeDest[1]
      console.log({ isDiagonal, relativeDest })
      return trace(relativeDest, isDiagonal)
    }

    // TODO: rotate shape
    function combine(...pieces) {
      function getRelativePosition(piece) {
        const [{ anchor }, position] = piece
        const [linePos, colunPos] = position
        const [anchorLine, anchorColun] = anchor
        const lineRelative = parseInt(linePos) - parseInt(anchorLine)
        const colunRelative = parseInt(colunPos) - parseInt(anchorColun)
        return [lineRelative, colunRelative]
      }
      function mergeColuns(gridColuns, shapeColuns) {
        if (gridColuns.length > shapeColuns.length){
           return gridColuns.reduce(
          (coluns, gridColun, index) =>  gridColun ? [...coluns, gridColun] :
          shapeColuns[index] ? [...coluns, shapeColuns[index]] : [...coluns, 0],
          [],
        )
        }
        return shapeColuns.reduce(
          (coluns, shapeColun, index) =>  shapeColun ? [...coluns, shapeColun] :
          gridColuns[index] ? [...coluns, gridColuns[index]] : [...coluns, 0],
          [],
        )
      }
      function mergeLine(lineGrid, lineShape, colPos){
        const untouchedColuns = lineGrid.slice(0, colPos)
        const touchedColuns = lineGrid.slice(colPos)
        const lineMerged = [
          ...untouchedColuns,
          ...mergeColuns(touchedColuns, lineShape)
        ]
        return lineMerged
      }
      function merge(grid, shape, [linePos, colunPos], index) {
        const indexLine = index || 0
        const relativeLine = parseInt(linePos) + parseInt(indexLine)
        const lineToMerge = grid[relativeLine] || []
        const beforeLines = grid.slice(0, relativeLine)
  
        const linesAfter = grid.slice(relativeLine + 1)
        const mergedGrid = [
          ...beforeLines,
          mergeLine(traceColuns(lineToMerge, colunPos), shape[indexLine], colunPos),
          ...linesAfter
  
        ]
        if (indexLine < shape.length - 1) {	
            return merge(mergedGrid, shape, [linePos, colunPos], (indexLine + 1))
        }
        return mergedGrid // startTracing colun
      }
      function placePieceOnGrid(grid, piece) {
        const relativePos = getRelativePosition(piece)
        return merge(
          traceLines(grid, relativePos[0]),// line position
          piece[0].shape, // shape
          relativePos,
        )
      }
      return pieces.reduce(placePieceOnGrid, [])
    }

    function collider(...pieces) {
      function getValueFromShape(acc, shape) {
        return shape.reduce(
            (lineAcc, line) => line.reduce((bitAcc, bit) => bitAcc + (bit || 0), lineAcc),
          acc,
        )
      }
      const collidedShape = getValueFromShape(0, combine(...pieces))
      const sumShape = pieces.map(([{shape}]) => shape).reduce(getValueFromShape, 0)
      return collidedShape < sumShape
    }

    function raytrace(complexCoast, { origin, direction, distance }) {
      function parseDiretion(value){
        if (typeof value !== 'number') {
          switch(value) {
            case 'N':
              return 0
            case 'NL':
            case 'NE':
              return 1
            case 'L':
              return 2
            case 'LS':
            case 'SE':
              return 3
            case 'S':
              return 4
            case 'SO':
              return 5
            case 'O':
              return 6
            case 'NO':
            case 'ON':
              return 7
            default:
              throw Error('Invalid Direction')
          }
        }
        return value
      }
      function buildLine([line, colun], parsedDirection, distance, coast) {
        function calcLength(parsedDirection, distance, complexCoast) {
          if (parsedDirection % 2 === 0) {
            return distance
          }
          return (distance / (complexCoast || 1))
        }
        function getDestination([line, colun], parsedDirection, length) {
          function parseLine(line, direction, length) {
            return direction === (6 || 2) ?
              line :
              direction === (1 || 7 || 0) ?
                line - length :
                line + length
          }
          function parseColun(colun, direction, length) {
            return direction === (0 || 4) ?
              colun :
              direction === (5 || 6 || 7) ?
                colun - length :
                colun + length
          }
  
          return [
            parseLine(line, parsedDirection, length),
            parseColun(colun, parsedDirection, length),
          ]
        }
        const length = calcLength(parsedDirection, distance, complexCoast)
        const destination = getDestination([line, colun], parsedDirection, length)
        const shape = traceStraigthLine([line, colun], destination)
        return {
          shape,
          anchor: [0, 0]
        }
      }
      const lineTraced = buildLine(origin, parseDiretion(direction), distance, complexCoast)
      return (...pieces) => collider(...pieces, [lineTraced, origin])
    }

    const composerTools = {
      traceLines,
      traceColuns,
      traceStraigthLine,
      combine,
      collider,
      raytrace
    }

    return tools.reduce((obj, key) => ({
        ...obj,
        [key.alias || key]:composerTools[key.source || key],
    }), {})
}
  
export default composerFactory

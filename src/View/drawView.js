// import { Vec } from '../Vec.js'
import { drawLine, drawTrace, cosineCurve } from '../drawFunctions.js'
import {Vec} from '../Vec.js'
/* eslint-disable space-in-parens, no-use-before-define, no-trailing-spaces, no-multiple-empty-lines, comma-spacing, padded-blocks */


const colours = (i, opacity = 1 ) => {
  const colourArray = [[73, 137, 171], [73, 171, 135], [73, 171, 96], [135, 171, 73], [171, 166, 73], [171, 146, 73]]
  const col = 'rgba(' + colourArray[i][0] + ',' + colourArray[i][1] + ',' + colourArray[i][2] + ',' + opacity + ')'
  return col
}


// function drawForground (c, phasors, pos) {
//   console.log('agquifg')
//   c.fillStyle = 'lightgrey'
//   c.strokeStyle = 'black'
//   drawLine(c, ...pos.componentXY, ...phasors[0])
//   drawLine(c, ...pos.componentXY, ...phasors[1])

// }

// function drawBackground (c , pos) {
//   // c.clearRect(0, 0, c.canvas.width, c.canvas.height)   - for canvas based optimisation
//   c.fillStyle = 'lightgrey'
//   c.strokeStyle = 'black'
//   // Draws the areas on screen 
//   c.strokeRect(0, 0, c.canvas.width, c.canvas.height)
//   // c.strokeRect(0, 0, ...pos.componentXY)
//   // c.strokeRect(pos.componentXY.x, 0, pos.componentXY.dx, pos.componentXY.y)

  
// }

export { drawForground, drawBackground }

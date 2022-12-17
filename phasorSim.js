/* global requestAnimationFrame */
import { Vec } from './Vec.js'
// import { drawLine } from './drawFunctions.js'
// import { drawForground, drawBackground } from './View/drawView.js'

console.log('st  art')
const phasors = [Vec.unitY.scale(100), Vec.unitX.scale(100)]
const hist = []
let trace = false
const baseWavelength = 12
let wavelength = baseWavelength
const canvas = document.querySelector('#screen')
const cx = canvas.getContext('2d')
// let dropdown = document.getElementById('wavelengthSlide')

const settings = {
  animate: { run: true, notPaused: true },
  smallscreen: false
}
const pos = {
  p1: new Vec(150, 150),
  g1: new Vec(300, 150),
  p2: new Vec(150, 350),
  g2: new Vec(300, 350),
  p3: new Vec(150, 600),
  g3: new Vec(300, 600)
  // componentXY: new Vec(200, 200),
  // resultXY: { x: 300, dx: 5 }
}
const controlareas = {
  phasor: [pos.p1.addXY(-100, -100), new Vec(200, 200)],
  wavelength: [pos.g1.addXY(0, -100), new Vec(800, 200)],
  history: [pos.p3.addXY(-145, -145), new Vec(290, 290)]
}

// console.log(0, 200, phasors[1].mag, phasors[0].phase, 400, 20, 'lightgrey')

// const phasorBase = (n = 2) => { return pos.componentXY.scaleXY(1, n) }

// console.log(pos.componentXY)
// console.log(...pos.componentXY)

addEventListeners()
requestAnimationFrame(animateIt)
update()

function drawForground (c, phasors, pos) {
  c.fillStyle = 'lightgrey'
  drawArrow(c, pos.p1, phasors[0], 'red')
  drawArrow(c, pos.p2, phasors[1], 'green')
  drawArrow(c, pos.p3, phasors[1], 'green')
  drawArrow(c, pos.p3.add(phasors[1]), phasors[0], 'red')
  c.strokeStyle = 'black'
  const finalPhasor = phasors[0].add(phasors[1])
  drawArrow(c, pos.p3, finalPhasor)
  drawLine(c, ...pos.p1.add(phasors[0]), 150 - phasors[0].x, 0, 'rgba(255,0,0,0.4)')
  drawLine(c, ...pos.p2.add(phasors[1]), 150 - phasors[1].x, 0, 'rgba(0,155,0,0.4)')
  drawLine(c, ...pos.p3.add(finalPhasor), 150 - finalPhasor.x, 0, 'rgba(0,0,0,0.4)')

  const func1 = transformFunc(Math.sin, phasors[0].mag, 1 / wavelength, phasors[0].phase)
  const func2 = transformFunc(Math.sin, phasors[1].mag, 1 / baseWavelength, phasors[1].phase)

  iteratePath(...pos.g1, 800, 'red', func1)
  iteratePath(...pos.g2, 800, 'green', func2)
  iteratePath(...pos.g3, 800, 'black', (x) => func1(x) + func2(x))

  if (trace) {
    drawHistory(c)
    if (hist.length < 10000) hist.push(finalPhasor)
  }
  // console.log(hist)
}

function drawHistory (c) {
  cx.strokeStyle = 'grey'
  hist.forEach(
    (v, i, a) => drawLine(c, ...a[i].add(pos.p3), ...a[i].subtract(a[Math.max(i - 1, 0)]))
  )
}

function drawBackground (c, pos) {
  c.fillStyle = 'black'
  c.strokeStyle = 'black'
  c.font = "20px Courier Bold";
  c.fillText('Phasor', 50, 45)
  c.strokeRect(0, 0, c.canvas.width, c.canvas.height)
  c.strokeStyle = 'lightblue'
  c.strokeRect(...controlareas.phasor[0], ...controlareas.phasor[1])
  c.fillText('Wavelength +/- Keys', 300, 45)
  c.strokeRect(...controlareas.history[0], ...controlareas.history[1])
  c.fillText('History \'h\' Key', 50, 445)
  c.strokeRect(...controlareas.wavelength[0], ...controlareas.wavelength[1])
}

function dragEvent (t, drag = false) {
  const test = (x, a, b) => x.withinRectange(a, a.add(b))
  if (test(t, ...controlareas.phasor)) {
    phasors[0] = t.subtract(pos.p1)
  } else if (test(t, ...controlareas.wavelength)) {
    wavelength = Math.max((t.x - pos.g1.x) / 10, 2)
  } else if (!drag && test(t, ...controlareas.history)) {
    trace = !trace; hist.length = 0
  }

  update()
}

function transformFunc (func, A = 1, B = 1, C = 0, D = 0) {
  return (x) => A * func(B * x + C) + D
}

function iteratePath (x1, y1, length, color = 'black', func = Math.sin) {
  if (color) { cx.strokeStyle = color }
  cx.beginPath()
  cx.moveTo(x1, y1 + func(0))
  for (var xx = x1; xx <= x1 + length; xx += 1) {
    cx.lineTo(xx, y1 + func(xx - x1))
  }
  cx.stroke()
}

function drawLine (c, x1, y1, dx = 1, dy = 1, color = 'black') {
  c.strokeStyle = color
  c.beginPath()
  c.moveTo(x1, y1)
  c.lineTo(x1 + dx, y1 + dy)
  c.stroke()
  c.fill()
  c.beginPath()
}

function drawArrow (c, start, vec, color = 'black', headSize = 10) {
  const end = start.add(vec)
  drawLine(c, ...start, ...vec, color)
  drawLine(c, ...end, ...vec.rotate(Math.PI * 5 / 4).normalise.scale(headSize), color)
  drawLine(c, ...end, ...vec.rotate(Math.PI * 3 / 4).normalise.scale(headSize), color)
  // drawLine (c, ...end, vec.scale(), vec, color)
  // drawLine (c, start, vec, color)
}

function addEventListeners () {
  let mouseCoords

  document.addEventListener('keypress', (e) => {
    if (e.key === '=') { wavelength++ }
    if (e.key === '-') { wavelength-- }
    if (e.key === 'h') { trace = !trace; hist.length = 0 }
    update(true)
  })

  window.addEventListener('touchstart', ({ touches: [e] }) => { mouseCoords = new Vec(e.pageX, e.pageY); dragEvent(mouseCoords); settings.animate.notPaused = false })
  window.addEventListener('touchend', ({ touches: [e] }) => { mouseCoords = undefined; settings.animate.notPaused = true })
  window.addEventListener('touchmove', (event) => {
    const { touches: [e] } = event
    if (mouseCoords) {
      const b = new Vec(e.pageX, e.pageY)
      dragEvent(b, true)
      mouseCoords = b
      if (settings.smallscreen) event.preventDefault()
    }
  }, { passive: false })

  window.addEventListener('mousedown', e => { mouseCoords = new Vec(e.offsetX, e.offsetY); settings.animate.notPaused = false })
  window.addEventListener('mouseup', e => { mouseCoords = undefined; settings.animate.notPaused = true })
  window.addEventListener('dblclick', e => { settings.animate.run = !settings.animate.run })
  window.addEventListener('click', e => {
    const b = new Vec(e.offsetX, e.offsetY)
    dragEvent(b)
    if (e.detail === 3) { settings.animate.run = false }
  })
  window.addEventListener('mousemove', (e) => {
    if (mouseCoords) {
      const b = new Vec(e.offsetX, e.offsetY)
      dragEvent(b, true)
      mouseCoords = b
    }
  })
}

function update () {
  cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height)
  drawBackground(cx, phasors, pos)
  drawForground(cx, phasors, pos)
}

function animateIt (time, lastTime) {
  if (lastTime != null & settings.animate.run & settings.animate.notPaused) {
    // wave.phase += (time - lastTime) * 0.002
    // const newRay = ray.updatePhase(wave.phase)
    // if (ray.normalisedResultant.phase > newRay.normalisedResultant.phase) {
    //   intensity.addIntensity(ray, undefined, settings.mirror)
    // }
    // phasors.forEach((v, i, a) => { phasors[i] = phasors[i].rotate(-0.01) })
    phasors[0] = phasors[0].rotate(0.02 * baseWavelength / wavelength)
    phasors[1] = phasors[1].rotate(0.02)

    update()
  }

  requestAnimationFrame(newTime => animateIt(newTime, time))
}

// function compactify (small) {
//   if (small) {
//     /* console.log(canvas.style.position); */
//     canvas.height = 600
//     pos.phaseDiagram.y = 500
//     canvas.style.position = 'absolute'
//   } else {
//     pos.phaseDiagram.y = 700
//     canvas.style.position = 'relative'
//     canvas.height = 800
//   }
// }

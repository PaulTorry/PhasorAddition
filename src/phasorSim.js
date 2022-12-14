/* global requestAnimationFrame */

import { Vec } from './Vec.js'
import { Grating, Ray, IntensityPattern } from './Model/OpticsClasses.js'
import { drawForground, drawBackground } from './View/drawView.js'

const canvas = document.querySelector('#screen')
const cx = canvas.getContext('2d')
let dropdown = document.getElementById('wavelengthSlide')

const settings = {
  animate: { run: true, notPaused: true },
  smallscreen: false
}
const pos = {
  componentXY: new Vec(200, 200),
  resultXY: { x: 300, dx: 5 },
}

addEventListeners()
requestAnimationFrame(animateIt)
update()

function addEventListeners () {
  let mouseCoords

  document.addEventListener('keypress', (e) => {
    if (e.key === 'a') 
    if (e.key === 'p') 
    console.log(wave.amplitude)
    update(true)
  })

  function dragEvent (a, b) {
    // console.log(a,b);
    const d = b.subtract(a)
    if (d.x * d.x > 16 * d.y * d.y || a.x < pos.grating.x || a.x > pos.screen.x || a.y > pos.topViewXY.y) {
      wave.phase += (d.x) * 0.5 / wave.length
    } else if (16 * d.x * d.x < d.y * d.y) {
      displacement += d.y
      if (displacement > -1 && settings.mirror) displacement = -1
      if (settings.record) { intensity.addIntensity(ray, undefined, settings.mirror) }
      if (settings.animate.run && !settings.record) { wave.phase = 0 }
    }
    update()
  }
  buttons.record.addEventListener('click', (e) => {
    intensity.recordIntensites()
    update()
  })
  sliders.wave.s.addEventListener('input', (e, v = sliders.wave.s.valueAsNumber) => {
    if (v !== wave.length) {
      sliders.wave.t.textContent = v
      wave.length = v
      intensity.staleintensities()
      update(true)
    }
  })

  window.addEventListener('touchstart', ({ touches: [e] }) => { mouseCoords = new Vec(e.pageX, e.pageY); settings.animate.notPaused = false })
  window.addEventListener('touchend', ({ touches: [e] }) => { mouseCoords = undefined; settings.animate.notPaused = true })
  window.addEventListener('touchmove', (event) => {
    const { touches: [e] } = event
    if (mouseCoords) {
      const b = new Vec(e.pageX, e.pageY)
      dragEvent(mouseCoords, b)
      mouseCoords = b
      if (settings.smallscreen) event.preventDefault()
    }
  }, { passive: false })

  window.addEventListener('mousedown', e => { mouseCoords = new Vec(e.offsetX, e.offsetY); settings.animate.notPaused = false })
  window.addEventListener('mouseup', e => { mouseCoords = undefined; settings.animate.notPaused = true })
  window.addEventListener('dblclick', e => {
    settings.animate.run = !settings.animate.run
    checkboxes.animate.checked = settings.animate.run
  })
  window.addEventListener('click', e => {
    if (e.detail === 3) {
      settings.record = !settings.record
      checkboxes.record.checked = settings.record
      settings.animate.run = false
      checkboxes.animate.checked = false
    }
  })
  window.addEventListener('mousemove', (e) => {
    if (mouseCoords) {
      const b = new Vec(e.offsetX, e.offsetY)
      dragEvent(mouseCoords, b)
      mouseCoords = b
    }
  })
}

function update () {

  cx.clearRect(0, 0, cx.canvas.width, cx.canvas.height)
  drawBackground(cx)
  drawForground(cx)
}

function animateIt (time, lastTime) {
  if (lastTime != null & settings.animate.run & settings.animate.notPaused) {
    wave.phase += (time - lastTime) * 0.002
    // const newRay = ray.updatePhase(wave.phase)
    // if (ray.normalisedResultant.phase > newRay.normalisedResultant.phase) {
    //   intensity.addIntensity(ray, undefined, settings.mirror)
    // }
    // update()
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

import * as THREE from 'three'

export function setupRenderer(canvas) {
  return new THREE.WebGLRenderer({ canvas })
}

export function setupScene() {
  return new THREE.Scene()
}

export function setupCamera(fov = 75, aspect = 2, near = 0.001, far = 5) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.z = 2
  return camera
}

export function setupLight(scene) {
  const [ color, indensity ] = [ 0xFFFFFF, 1 ]
  const light = new THREE.DirectionalLight(color, indensity)
  light.position.set(-1, 2, 4)
  if (scene !== undefined) {
    scene.add(light)
  }
  return light
}

export function setupEnv(canvas) {
  const renderer = setupRenderer(canvas)
  const scene = setupScene()
  const camera = setupCamera()
  const light = setupLight(scene)
  return [ renderer, scene, camera, light ]
}

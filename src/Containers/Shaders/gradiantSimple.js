import {
  beginRender,
  createBuffer,
  createProgramInfo,
  degree45Project,
  getContext,
  initAttrib,
} from '../../GL/glUtils'
import { mat4 } from 'gl-matrix'

const vsSource = `
    attribute vec4 vertexPosition;
    attribute vec4 vertexColor;
    
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    
    varying lowp vec4 vColor;
    
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vertexPosition;
      vColor = vertexColor;
    }
  `

const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `

export default function (canvas) {

  function initBuffers(gl) {
    const args = [ gl.ARRAY_BUFFER, Float32Array, gl.STATIC_DRAW ]
    const positions = [
      1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      -1.0, -1.0,
    ]

    const positionBuffer = createBuffer(gl, positions, ...args)

    const colors = [
      1.0, 1.0, 1.0, 1.0,    // white
      1.0, 0.0, 0.0, 1.0,    // red
      0.0, 1.0, 0.0, 1.0,    // green
      0.0, 0.0, 1.0, 1.0,    // blue
    ]

    const colorBuffer = createBuffer(gl, colors, ...args)

    return { position: positionBuffer, color: colorBuffer, }
  }

  const gl = getContext(canvas)
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource)
  const programInfo = createProgramInfo(
    gl, shaderProgram,
    [ 'vertexPosition', 'vertexColor' ],
    [ 'projectionMatrix', 'modelViewMatrix' ]
  )
  const buffers = initBuffers(gl)
  drawScene(gl, programInfo, buffers)
}


function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
    return null
  }

  return shaderProgram
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function drawScene(gl, programInfo, buffers) {

  beginRender(gl)
  const projectionMatrix = degree45Project(gl)
  const modelViewMatrix = mat4.create()
  mat4.translate(modelViewMatrix, modelViewMatrix, [ -0.0, 0.0, -6.0 ])
  const attrRestArgs = [ gl.FLOAT, false, 0, 0 ]
  initAttrib(gl, buffers.position, gl.ARRAY_BUFFER, programInfo.attribLocations.vertexPosition, 2, ...attrRestArgs)
  initAttrib(gl, buffers.color, gl.ARRAY_BUFFER, programInfo.attribLocations.vertexColor, 4, ...attrRestArgs)

  gl.useProgram(programInfo.program)
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

  const [ offset, vertexCount ] = [ 0, 4 ]
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)

}

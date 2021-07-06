import {
  beginRender,
  createBuffer,
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

  const gl = getContext(canvas)

  const positions = [
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0, -1.0,
  ]
  const colors = [
    1.0, 1.0, 1.0, 1.0,    // white
    1.0, 0.0, 0.0, 1.0,    // red
    0.0, 1.0, 0.0, 1.0,    // green
    0.0, 0.0, 1.0, 1.0,    // blue
  ]
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource)
  gl.useProgram(shaderProgram)

  const attrRestArgs = [ gl.FLOAT, false, 0, 0 ]
  const args = [ gl.ARRAY_BUFFER, Float32Array, gl.STATIC_DRAW ]
  const buffers = [positions, colors].map(obj => createBuffer(gl, obj, ...args))
  const attrNames = ['vertexPosition', 'vertexColor']
  const attrs = attrNames.map(name => gl.getAttribLocation(shaderProgram, name))
  const numbers = [2, 4]
  buffers.map((buffer, index) => initAttrib(gl, buffer, gl.ARRAY_BUFFER, attrs[index], numbers[index], ...attrRestArgs))


  const matrixNames = ['projectionMatrix', 'modelViewMatrix']
  const mats = matrixNames.map(name => gl.getUniformLocation(shaderProgram, name))
  const projectionMat = degree45Project(gl)
  const modelViewMat = mat4.create()
  mat4.translate(modelViewMat, modelViewMat, [-0.0, 0.0, -6.0])
  var squareRotation = 0.0;
  mat4.rotate(modelViewMat, modelViewMat, squareRotation, [0, 0, 1]);
  mats.map((mat, index) => gl.uniformMatrix4fv(mat, false, [projectionMat, modelViewMat][index]))

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  function drawScene(deltaTime) {
    // squareRotation += deltaTime;
    mat4.rotate(modelViewMat, modelViewMat, deltaTime, [0, 0, 1]);
    gl.uniformMatrix4fv(mats[1], false, modelViewMat)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)  // Clear to black, fully opaque
    gl.clearDepth(1.0)                 // Clear everything
    gl.enable(gl.DEPTH_TEST)           // Enable depth testing
    gl.depthFunc(gl.LEQUAL)            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
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

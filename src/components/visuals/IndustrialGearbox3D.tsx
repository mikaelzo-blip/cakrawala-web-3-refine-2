'use client';

import { useEffect, useRef } from 'react';

type Mesh = {
  position: WebGLBuffer;
  normal: WebGLBuffer;
  count: number;
};

type Geometry = {
  positions: number[];
  normals: number[];
};

const TAU = Math.PI * 2;

function mat4Identity() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

function mat4Multiply(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      out[column * 4 + row] =
        a[row] * b[column * 4] +
        a[4 + row] * b[column * 4 + 1] +
        a[8 + row] * b[column * 4 + 2] +
        a[12 + row] * b[column * 4 + 3];
    }
  }
  return out;
}

function mat4Translation(x: number, y: number, z: number) {
  const out = mat4Identity();
  out[12] = x;
  out[13] = y;
  out[14] = z;
  return out;
}

function mat4Scale(x: number, y: number, z: number) {
  return new Float32Array([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
}

function mat4RotationX(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}

function mat4RotationY(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
}

function mat4RotationZ(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

function mat4Perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function compose(
  position: [number, number, number],
  rotation: [number, number, number],
  scale: [number, number, number]
) {
  let matrix = mat4Translation(...position);
  matrix = mat4Multiply(matrix, mat4RotationY(rotation[1]));
  matrix = mat4Multiply(matrix, mat4RotationX(rotation[0]));
  matrix = mat4Multiply(matrix, mat4RotationZ(rotation[2]));
  return mat4Multiply(matrix, mat4Scale(...scale));
}

function createBoxGeometry(): Geometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const faces: Array<{ normal: [number, number, number]; corners: Array<[number, number, number]> }> = [
    { normal: [0, 0, 1], corners: [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]] },
    { normal: [0, 0, -1], corners: [[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]] },
    { normal: [1, 0, 0], corners: [[0.5, -0.5, 0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]] },
    { normal: [-1, 0, 0], corners: [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]] },
    { normal: [0, 1, 0], corners: [[-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5]] },
    { normal: [0, -1, 0], corners: [[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5]] },
  ];

  for (const face of faces) {
    const [a, b, c, d] = face.corners;
    positions.push(...a, ...b, ...c, ...a, ...c, ...d);
    for (let i = 0; i < 6; i += 1) normals.push(...face.normal);
  }
  return { positions, normals };
}

function createCylinderGeometry(segments = 40): Geometry {
  const positions: number[] = [];
  const normals: number[] = [];
  for (let i = 0; i < segments; i += 1) {
    const a0 = (i / segments) * TAU;
    const a1 = ((i + 1) / segments) * TAU;
    const x0 = Math.cos(a0);
    const z0 = Math.sin(a0);
    const x1 = Math.cos(a1);
    const z1 = Math.sin(a1);

    positions.push(x0, -1, z0, x1, -1, z1, x1, 1, z1, x0, -1, z0, x1, 1, z1, x0, 1, z0);
    normals.push(x0, 0, z0, x1, 0, z1, x1, 0, z1, x0, 0, z0, x1, 0, z1, x0, 0, z0);

    positions.push(0, 1, 0, x0, 1, z0, x1, 1, z1);
    normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0);

    positions.push(0, -1, 0, x1, -1, z1, x0, -1, z0);
    normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0);
  }
  return { positions, normals };
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createMesh(gl: WebGLRenderingContext, geometry: Geometry): Mesh | null {
  const position = gl.createBuffer();
  const normal = gl.createBuffer();
  if (!position || !normal) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.positions), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, normal);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.normals), gl.STATIC_DRAW);

  return { position, normal, count: geometry.positions.length / 3 };
}

export function IndustrialGearbox3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, dragging: false, lastX: 0, lastY: 0 });
  const rotationRef = useRef({ x: -0.18, y: -0.6, targetX: -0.18, targetY: -0.6 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      uniform mat4 uProjection;
      uniform mat4 uView;
      uniform mat4 uModel;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vec4 world = uModel * vec4(aPosition, 1.0);
        vWorldPosition = world.xyz;
        vNormal = normalize(mat3(uModel) * aNormal);
        gl_Position = uProjection * uView * world;
      }
    `);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      void main() {
        vec3 n = normalize(vNormal);
        vec3 key = normalize(vec3(-0.7, 1.0, 0.8));
        vec3 rim = normalize(vec3(0.8, 0.35, -0.55));
        float diffuse = max(dot(n, key), 0.0);
        float edge = pow(1.0 - abs(dot(n, normalize(vec3(0.0, 0.0, 1.0)))), 2.0);
        float rimLight = max(dot(n, rim), 0.0) * 0.18;
        vec3 color = uColor * (0.42 + diffuse * 0.62 + rimLight) + edge * vec3(0.09, 0.11, 0.12);
        gl_FragColor = vec4(color, 1.0);
      }
    `);

    if (!vertexShader || !fragmentShader) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const box = createMesh(gl, createBoxGeometry());
    const cylinder = createMesh(gl, createCylinderGeometry());
    if (!box || !cylinder) return;

    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const normalLocation = gl.getAttribLocation(program, 'aNormal');
    const projectionLocation = gl.getUniformLocation(program, 'uProjection');
    const viewLocation = gl.getUniformLocation(program, 'uView');
    const modelLocation = gl.getUniformLocation(program, 'uModel');
    const colorLocation = gl.getUniformLocation(program, 'uColor');
    if (!projectionLocation || !viewLocation || !modelLocation || !colorLocation) return;

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    const bindMesh = (mesh: Mesh) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normal);
      gl.enableVertexAttribArray(normalLocation);
      gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
    };

    const draw = (mesh: Mesh, model: Float32Array, color: [number, number, number]) => {
      bindMesh(mesh);
      gl.uniformMatrix4fv(modelLocation, false, model);
      gl.uniform3fv(colorLocation, color);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
    };

    const darkMetal: [number, number, number] = [0.12, 0.19, 0.23];
    const midMetal: [number, number, number] = [0.25, 0.31, 0.33];
    const steel: [number, number, number] = [0.47, 0.5, 0.49];
    const orange: [number, number, number] = [0.78, 0.24, 0.055];
    const nearBlack: [number, number, number] = [0.06, 0.075, 0.08];

    let animationFrame = 0;
    let visible = true;
    let lastTime = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    const render = (time: number) => {
      animationFrame = requestAnimationFrame(render);
      if (!visible) return;
      resize();

      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const pointer = pointerRef.current;
      const rotation = rotationRef.current;
      if (!pointer.dragging && !reducedMotion) rotation.targetY += delta * 0.12;
      rotation.x += (rotation.targetX - rotation.x) * 0.075;
      rotation.y += (rotation.targetY - rotation.y) * 0.075;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const aspect = canvas.width / canvas.height;
      gl.uniformMatrix4fv(projectionLocation, false, mat4Perspective(Math.PI / 4.2, aspect, 0.1, 100));
      gl.uniformMatrix4fv(viewLocation, false, mat4Translation(0, -0.15, -11.4));

      const root = mat4Multiply(mat4RotationY(rotation.y), mat4RotationX(rotation.x));
      const part = (
        mesh: Mesh,
        position: [number, number, number],
        rotationValue: [number, number, number],
        scale: [number, number, number],
        color: [number, number, number]
      ) => draw(mesh, mat4Multiply(root, compose(position, rotationValue, scale)), color);

      part(box, [0, -2.0, 0], [0, 0, 0], [5.0, 0.35, 3.05], nearBlack);
      part(box, [-0.25, -0.5, 0], [0, 0.03, 0], [3.3, 2.75, 2.25], darkMetal);
      part(box, [-0.25, 1.08, 0], [0, 0.03, 0], [2.45, 0.48, 1.75], midMetal);
      part(box, [-0.25, 1.45, 0], [0, 0.03, 0], [1.4, 0.24, 1.05], orange);

      part(cylinder, [-0.28, -0.45, 1.28], [Math.PI / 2, 0, 0], [1.22, 0.22, 1.22], midMetal);
      part(cylinder, [-0.28, -0.45, 1.55], [Math.PI / 2, 0, 0], [0.73, 0.19, 0.73], nearBlack);
      part(cylinder, [-0.28, -0.45, 1.8], [Math.PI / 2, 0, 0], [0.35, 0.42, 0.35], steel);

      part(cylinder, [2.05, -0.35, 0], [0, 0, Math.PI / 2], [0.62, 0.78, 0.62], steel);
      part(cylinder, [2.9, -0.35, 0], [0, 0, Math.PI / 2], [0.93, 0.72, 0.93], darkMetal);
      part(cylinder, [3.62, -0.35, 0], [0, 0, Math.PI / 2], [0.72, 0.18, 0.72], orange);

      part(cylinder, [-2.0, -0.55, 0], [0, 0, Math.PI / 2], [0.46, 0.55, 0.46], steel);
      part(cylinder, [-2.58, -0.55, 0], [0, 0, Math.PI / 2], [0.32, 0.42, 0.32], orange);

      const boltPositions: Array<[number, number]> = [[-1.05, 0.38], [0.5, 0.38], [-1.05, -1.25], [0.5, -1.25]];
      for (const [x, y] of boltPositions) {
        part(cylinder, [x, y, 1.56], [Math.PI / 2, 0, 0], [0.11, 0.08, 0.11], steel);
      }
    };

    animationFrame = requestAnimationFrame(render);

    const onPointerDown = (event: PointerEvent) => {
      pointerRef.current.dragging = true;
      pointerRef.current.lastX = event.clientX;
      pointerRef.current.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      const pointer = pointerRef.current;
      if (!pointer.dragging) return;
      const dx = event.clientX - pointer.lastX;
      const dy = event.clientY - pointer.lastY;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      rotationRef.current.targetY += dx * 0.008;
      rotationRef.current.targetX = Math.max(-0.7, Math.min(0.45, rotationRef.current.targetX + dy * 0.006));
    };
    const onPointerUp = (event: PointerEvent) => {
      pointerRef.current.dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      gl.deleteBuffer(box.position);
      gl.deleteBuffer(box.normal);
      gl.deleteBuffer(cylinder.position);
      gl.deleteBuffer(cylinder.normal);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="relative h-full min-h-[390px] w-full select-none sm:min-h-[470px] lg:min-h-[590px]">
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(16,42,67,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(16,42,67,0.07)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[68%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#102A43]/15" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[49%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#102A43]/10" />

      <canvas
        ref={canvasRef}
        className="relative z-10 h-full min-h-[390px] w-full cursor-grab touch-none active:cursor-grabbing sm:min-h-[470px] lg:min-h-[590px]"
        aria-label="Model tiga dimensi gearbox dan sistem transmisi industri"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex items-end justify-between border-t border-[#102A43]/20 pt-3 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[#536474] sm:bottom-5">
        <span>Gearbox / transmission system</span>
        <span className="hidden sm:inline">Drag to inspect · WebGL</span>
      </div>
    </div>
  );
}

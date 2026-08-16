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

type IndustrialGearbox3DProps = {
  progress?: number;
  activeStep?: number;
};

type Vec3 = [number, number, number];

const TAU = Math.PI * 2;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(start: number, end: number, value: number) {
  const t = clamp01((value - start) / Math.max(0.0001, end - start));
  return t * t * (3 - 2 * t);
}

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

function compose(position: Vec3, rotation: Vec3, scale: Vec3) {
  let matrix = mat4Translation(...position);
  matrix = mat4Multiply(matrix, mat4RotationY(rotation[1]));
  matrix = mat4Multiply(matrix, mat4RotationX(rotation[0]));
  matrix = mat4Multiply(matrix, mat4RotationZ(rotation[2]));
  return mat4Multiply(matrix, mat4Scale(...scale));
}

function createBoxGeometry(): Geometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const faces: Array<{ normal: Vec3; corners: Vec3[] }> = [
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

function createCylinderGeometry(segments = 36): Geometry {
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

function createRingGeometry(segments = 40, innerRadius = 0.62): Geometry {
  const positions: number[] = [];
  const normals: number[] = [];
  for (let i = 0; i < segments; i += 1) {
    const a0 = (i / segments) * TAU;
    const a1 = ((i + 1) / segments) * TAU;
    const o0: [number, number] = [Math.cos(a0), Math.sin(a0)];
    const o1: [number, number] = [Math.cos(a1), Math.sin(a1)];
    const i0: [number, number] = [o0[0] * innerRadius, o0[1] * innerRadius];
    const i1: [number, number] = [o1[0] * innerRadius, o1[1] * innerRadius];

    positions.push(o0[0], 1, o0[1], o1[0], 1, o1[1], i1[0], 1, i1[1], o0[0], 1, o0[1], i1[0], 1, i1[1], i0[0], 1, i0[1]);
    for (let n = 0; n < 6; n += 1) normals.push(0, 1, 0);

    positions.push(o1[0], -1, o1[1], o0[0], -1, o0[1], i0[0], -1, i0[1], o1[0], -1, o1[1], i0[0], -1, i0[1], i1[0], -1, i1[1]);
    for (let n = 0; n < 6; n += 1) normals.push(0, -1, 0);

    positions.push(o0[0], -1, o0[1], o1[0], -1, o1[1], o1[0], 1, o1[1], o0[0], -1, o0[1], o1[0], 1, o1[1], o0[0], 1, o0[1]);
    for (let n = 0; n < 6; n += 1) normals.push(o0[0], 0, o0[1]);

    positions.push(i1[0], -1, i1[1], i0[0], -1, i0[1], i0[0], 1, i0[1], i1[0], -1, i1[1], i0[0], 1, i0[1], i1[0], 1, i1[1]);
    for (let n = 0; n < 6; n += 1) normals.push(-o0[0], 0, -o0[1]);
  }
  return { positions, normals };
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
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

export function IndustrialGearbox3D({ progress = 0, activeStep = 0 }: IndustrialGearbox3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const activeStepRef = useRef(activeStep);
  const pointerRef = useRef({ dragging: false, lastX: 0, lastY: 0, x: 0, y: 0 });

  progressRef.current = progress;
  activeStepRef.current = activeStep;

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
      void main() {
        vec4 world = uModel * vec4(aPosition, 1.0);
        vNormal = normalize(mat3(uModel) * aNormal);
        gl_Position = uProjection * uView * world;
      }
    `);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform vec3 uColor;
      uniform float uAlpha;
      varying vec3 vNormal;
      void main() {
        vec3 n = normalize(vNormal);
        vec3 key = normalize(vec3(-0.55, 0.9, 0.75));
        vec3 fill = normalize(vec3(0.7, 0.2, -0.55));
        float diffuse = max(dot(n, key), 0.0);
        float secondary = max(dot(n, fill), 0.0) * 0.12;
        float rim = pow(1.0 - abs(n.z), 2.0) * 0.08;
        vec3 color = uColor * (0.43 + diffuse * 0.62 + secondary) + rim;
        gl_FragColor = vec4(color, uAlpha);
      }
    `);

    if (!vertexShader || !fragmentShader) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    const box = createMesh(gl, createBoxGeometry());
    const cylinder = createMesh(gl, createCylinderGeometry());
    const ring = createMesh(gl, createRingGeometry());
    if (!box || !cylinder || !ring) return;

    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const normalLocation = gl.getAttribLocation(program, 'aNormal');
    const projectionLocation = gl.getUniformLocation(program, 'uProjection');
    const viewLocation = gl.getUniformLocation(program, 'uView');
    const modelLocation = gl.getUniformLocation(program, 'uModel');
    const colorLocation = gl.getUniformLocation(program, 'uColor');
    const alphaLocation = gl.getUniformLocation(program, 'uAlpha');
    if (!projectionLocation || !viewLocation || !modelLocation || !colorLocation || !alphaLocation) return;

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const darkMetal: Vec3 = [0.25, 0.28, 0.29];
    const housingMetal: Vec3 = [0.40, 0.43, 0.44];
    const motorMetal: Vec3 = [0.43, 0.46, 0.47];
    const steel: Vec3 = [0.62, 0.65, 0.66];
    const gearSteel: Vec3 = [0.52, 0.55, 0.56];
    const rubber: Vec3 = [0.08, 0.09, 0.10];
    const accent: Vec3 = [0.60, 0.23, 0.075];

    const bindMesh = (mesh: Mesh) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normal);
      gl.enableVertexAttribArray(normalLocation);
      gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
    };

    const draw = (mesh: Mesh, model: Float32Array, color: Vec3, alpha = 1) => {
      bindMesh(mesh);
      gl.uniformMatrix4fv(modelLocation, false, model);
      gl.uniform3fv(colorLocation, color);
      gl.uniform1f(alphaLocation, alpha);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
    };

    let animationFrame = 0;
    let visible = true;
    let currentX = -0.14;
    let currentY = -0.72;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.02 });
    observer.observe(canvas);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    const render = () => {
      animationFrame = requestAnimationFrame(render);
      if (!visible) return;
      resize();

      const rawProgress = clamp01(progressRef.current);
      const visualProgress = reducedMotion ? Math.round(rawProgress * 9) / 9 : rawProgress;
      const step = activeStepRef.current;
      const pointer = pointerRef.current;

      const motorSeparate = smoothstep(0.09, 0.22, visualProgress);
      const housingOpen = smoothstep(0.18, 0.34, visualProgress);
      const internalsOpen = smoothstep(0.28, 0.63, visualProgress);
      const reassemble = smoothstep(0.80, 0.97, visualProgress);
      const explode = internalsOpen * (1 - reassemble);
      const externalOpen = 1 - reassemble;
      const housingAlpha = 1 - housingOpen * externalOpen * 0.72;

      const desiredY = -0.72 + visualProgress * 0.22 + pointer.x;
      const desiredX = -0.16 + Math.sin(visualProgress * Math.PI) * 0.08 + pointer.y;
      currentY += (desiredY - currentY) * (reducedMotion ? 1 : 0.08);
      currentX += (desiredX - currentX) * (reducedMotion ? 1 : 0.08);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const aspect = canvas.width / canvas.height;
      const cameraDistance = aspect < 0.85 ? -12.2 : -10.6;
      gl.uniformMatrix4fv(projectionLocation, false, mat4Perspective(Math.PI / 4.1, aspect, 0.1, 100));
      gl.uniformMatrix4fv(viewLocation, false, mat4Translation(aspect < 0.85 ? -0.15 : 0.35, -0.15, cameraDistance));

      const root = mat4Multiply(mat4RotationY(currentY), mat4RotationX(currentX));
      const part = (mesh: Mesh, position: Vec3, rotation: Vec3, scale: Vec3, color: Vec3, alpha = 1) => {
        draw(mesh, mat4Multiply(root, compose(position, rotation, scale)), color, alpha);
      };
      const tone = (targetStep: number, base: Vec3) => (step === targetStep ? accent : base);

      const motorShift = 1.45 * motorSeparate * externalOpen;
      const coverShift = -1.05 * housingOpen * externalOpen;

      gl.depthMask(true);
      part(cylinder, [0.58 + explode * 0.24, 0, 0.16], [0, 0, Math.PI / 2], [0.13, 0.82, 0.13], tone(2, steel));
      part(cylinder, [-0.02 + explode * 0.12, 0, 0.16], [0, 0, Math.PI / 2], [0.34, 0.11, 0.34], tone(2, gearSteel));

      part(cylinder, [-0.34 - explode * 0.12, 0.30 + explode * 0.22, -0.30], [0, 0, Math.PI / 2], [0.55, 0.12, 0.55], tone(3, gearSteel));
      for (let i = 0; i < 14; i += 1) {
        const a = (i / 14) * TAU;
        part(box, [-0.34 - explode * 0.12, 0.30 + Math.cos(a) * 0.54 + explode * 0.22, -0.30 + Math.sin(a) * 0.54], [a, 0, 0], [0.20, 0.12, 0.09], tone(3, gearSteel));
      }
      part(cylinder, [-0.30 - explode * 0.12, 0.30 + explode * 0.22, -0.30], [0, 0, Math.PI / 2], [0.12, 0.70, 0.12], tone(3, steel));

      part(cylinder, [-0.55 - explode * 0.24, 0.18, -0.18], [0, 0, Math.PI / 2], [0.31, 0.11, 0.31], tone(4, gearSteel));
      part(cylinder, [-0.55, -0.24 - explode * 0.20, -0.18], [0, 0, 0], [0.50, 0.12, 0.50], tone(4, gearSteel));

      part(cylinder, [-0.55, -0.88 - explode * 0.32, -0.18], [0, 0, 0], [0.17, 0.86, 0.17], tone(7, steel));
      part(ring, [-0.55, -0.48 - explode * 0.12, -0.18], [0, 0, 0], [0.39, 0.10, 0.39], tone(5, steel));
      part(ring, [-0.55, 0.20 + explode * 0.10, -0.18], [0, 0, 0], [0.39, 0.10, 0.39], tone(5, steel));
      part(ring, [-0.55, -1.38 - explode * 0.40, -0.18], [0, 0, 0], [0.33, 0.07, 0.33], tone(6, rubber));

      gl.depthMask(housingAlpha > 0.95);
      part(box, [-0.48, 0, -0.08], [0, 0.02, 0], [1.72, 1.46, 1.55], tone(8, housingMetal), housingAlpha);
      part(box, [-0.48, 0, -1.05], [0, 0.02, 0], [2.02, 1.56, 0.36], tone(8, darkMetal), housingAlpha);
      part(box, [-0.48, 0, 0.92], [0, 0.02, 0], [1.18, 1.02, 0.32], tone(8, housingMetal), housingAlpha);
      part(cylinder, [-0.55, -0.88, -0.18], [0, 0, 0], [0.78, 0.20, 0.78], tone(8, darkMetal), housingAlpha);
      part(cylinder, [-0.55, -1.18 + coverShift, -0.18], [0, 0, 0], [0.67, 0.09, 0.67], tone(8, housingMetal), Math.max(0.35, housingAlpha));

      for (let i = 0; i < 4; i += 1) {
        part(box, [-1.36, 0, -0.58 + i * 0.36], [0, 0.02, 0], [0.10, 1.48, 0.08], tone(8, darkMetal), housingAlpha);
      }
      for (const [x, z] of [[-1.05, -1.22], [0.06, -1.22]] as Array<[number, number]>) {
        part(box, [x, -0.55, z], [0, 0, 0], [0.42, 0.34, 0.16], darkMetal, 1);
        part(box, [x, 0.55, z], [0, 0, 0], [0.42, 0.34, 0.16], darkMetal, 1);
      }
      gl.depthMask(true);

      const motorX = 1.78 + motorShift;
      part(cylinder, [0.58 + motorShift * 0.30, 0, 0.13], [0, 0, Math.PI / 2], [0.68, 0.12, 0.68], tone(1, darkMetal));
      part(cylinder, [motorX, 0, 0.13], [0, 0, Math.PI / 2], [0.64, 1.32, 0.64], tone(1, motorMetal));
      for (let i = 0; i < 8; i += 1) {
        part(cylinder, [1.06 + i * 0.22 + motorShift, 0, 0.13], [0, 0, Math.PI / 2], [0.69, 0.035, 0.69], tone(1, motorMetal));
      }
      part(cylinder, [3.05 + motorShift, 0, 0.13], [0, 0, Math.PI / 2], [0.67, 0.22, 0.67], tone(1, darkMetal));
      part(box, [1.75 + motorShift, 0, 0.95], [0, 0, 0], [0.58, 0.62, 0.38], tone(1, darkMetal));
      part(box, [1.75 + motorShift, 0, 1.18], [0, 0, 0], [0.62, 0.66, 0.07], tone(1, steel));

      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * TAU;
        part(cylinder, [-0.55 + Math.cos(a) * 0.57, -1.31 + coverShift, -0.18 + Math.sin(a) * 0.57], [0, 0, 0], [0.055, 0.06, 0.055], steel, 1);
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
      pointer.x = Math.max(-0.45, Math.min(0.45, pointer.x + dx * 0.004));
      pointer.y = Math.max(-0.24, Math.min(0.24, pointer.y + dy * 0.003));
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
      for (const mesh of [box, cylinder, ring]) {
        gl.deleteBuffer(mesh.position);
        gl.deleteBuffer(mesh.normal);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div className="relative h-full min-h-[360px] w-full select-none sm:min-h-[430px] lg:min-h-[560px]">
      <canvas
        ref={canvasRef}
        className="relative z-10 h-full min-h-[360px] w-full cursor-grab touch-none active:cursor-grabbing sm:min-h-[430px] lg:min-h-[560px]"
        aria-label="Visualisasi teknis tiga dimensi gearmotor industri tanpa merek"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex items-center justify-between border-t border-[#102A43]/18 pt-3 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#536474] sm:bottom-4">
        <span>Technical drivetrain visualization</span>
        <span className="hidden sm:inline">Drag gently to inspect</span>
      </div>
    </div>
  );
}

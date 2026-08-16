'use client';

import { useEffect, useRef } from 'react';

type Vec3 = [number, number, number];
type Mesh = { position: WebGLBuffer; normal: WebGLBuffer; count: number };
type Geometry = { positions: number[]; normals: number[] };
type Props = { progress?: number; activeStep?: number };

const TAU = Math.PI * 2;
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function smoothstep(start: number, end: number, value: number) {
  const t = clamp01((value - start) / Math.max(0.0001, end - start));
  return t * t * (3 - 2 * t);
}

function identity() {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

function multiply(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c += 1) {
    for (let r = 0; r < 4; r += 1) {
      out[c * 4 + r] =
        a[r] * b[c * 4] +
        a[4 + r] * b[c * 4 + 1] +
        a[8 + r] * b[c * 4 + 2] +
        a[12 + r] * b[c * 4 + 3];
    }
  }
  return out;
}

function translation(x: number, y: number, z: number) {
  const m = identity();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
}

function scale(x: number, y: number, z: number) {
  return new Float32Array([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
}

function rotationX(a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}

function rotationY(a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
}

function rotationZ(a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function compose(position: Vec3, rotation: Vec3, size: Vec3) {
  let m = translation(...position);
  m = multiply(m, rotationY(rotation[1]));
  m = multiply(m, rotationX(rotation[0]));
  m = multiply(m, rotationZ(rotation[2]));
  return multiply(m, scale(...size));
}

function boxGeometry(): Geometry {
  const p: number[] = [];
  const n: number[] = [];
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
    p.push(...a, ...b, ...c, ...a, ...c, ...d);
    for (let i = 0; i < 6; i += 1) n.push(...face.normal);
  }
  return { positions: p, normals: n };
}

function cylinderGeometry(segments = 36): Geometry {
  const p: number[] = [];
  const n: number[] = [];
  for (let i = 0; i < segments; i += 1) {
    const a0 = (i / segments) * TAU;
    const a1 = ((i + 1) / segments) * TAU;
    const x0 = Math.cos(a0);
    const z0 = Math.sin(a0);
    const x1 = Math.cos(a1);
    const z1 = Math.sin(a1);
    p.push(x0, -1, z0, x1, -1, z1, x1, 1, z1, x0, -1, z0, x1, 1, z1, x0, 1, z0);
    n.push(x0, 0, z0, x1, 0, z1, x1, 0, z1, x0, 0, z0, x1, 0, z1, x0, 0, z0);
    p.push(0, 1, 0, x0, 1, z0, x1, 1, z1);
    n.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
    p.push(0, -1, 0, x1, -1, z1, x0, -1, z0);
    n.push(0, -1, 0, 0, -1, 0, 0, -1, 0);
  }
  return { positions: p, normals: n };
}

function ringGeometry(segments = 36, inner = 0.62): Geometry {
  const p: number[] = [];
  const n: number[] = [];
  for (let i = 0; i < segments; i += 1) {
    const a0 = (i / segments) * TAU;
    const a1 = ((i + 1) / segments) * TAU;
    const o0: [number, number] = [Math.cos(a0), Math.sin(a0)];
    const o1: [number, number] = [Math.cos(a1), Math.sin(a1)];
    const i0: [number, number] = [o0[0] * inner, o0[1] * inner];
    const i1: [number, number] = [o1[0] * inner, o1[1] * inner];
    p.push(o0[0], 1, o0[1], o1[0], 1, o1[1], i1[0], 1, i1[1], o0[0], 1, o0[1], i1[0], 1, i1[1], i0[0], 1, i0[1]);
    for (let k = 0; k < 6; k += 1) n.push(0, 1, 0);
    p.push(o1[0], -1, o1[1], o0[0], -1, o0[1], i0[0], -1, i0[1], o1[0], -1, o1[1], i0[0], -1, i0[1], i1[0], -1, i1[1]);
    for (let k = 0; k < 6; k += 1) n.push(0, -1, 0);
    p.push(o0[0], -1, o0[1], o1[0], -1, o1[1], o1[0], 1, o1[1], o0[0], -1, o0[1], o1[0], 1, o1[1], o0[0], 1, o0[1]);
    for (let k = 0; k < 6; k += 1) n.push(o0[0], 0, o0[1]);
    p.push(i1[0], -1, i1[1], i0[0], -1, i0[1], i0[0], 1, i0[1], i1[0], -1, i1[1], i0[0], 1, i0[1], i1[0], 1, i1[1]);
    for (let k = 0; k < 6; k += 1) n.push(-o0[0], 0, -o0[1]);
  }
  return { positions: p, normals: n };
}

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const value = gl.createShader(type);
  if (!value) return null;
  gl.shaderSource(value, source);
  gl.compileShader(value);
  if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(value));
    gl.deleteShader(value);
    return null;
  }
  return value;
}

function mesh(gl: WebGLRenderingContext, geometry: Geometry): Mesh | null {
  const position = gl.createBuffer();
  const normal = gl.createBuffer();
  if (!position || !normal) return null;
  gl.bindBuffer(gl.ARRAY_BUFFER, position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.positions), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, normal);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.normals), gl.STATIC_DRAW);
  return { position, normal, count: geometry.positions.length / 3 };
}

export function IndustrialGearbox3D({ progress = 0, activeStep = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const stepRef = useRef(activeStep);
  const pointerRef = useRef({ dragging: false, lastX: 0, lastY: 0, x: 0, y: 0 });

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    stepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    if (!gl) return;

    const vertex = shader(gl, gl.VERTEX_SHADER, `
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
    const fragment = shader(gl, gl.FRAGMENT_SHADER, `
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
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const box = mesh(gl, boxGeometry());
    const cylinder = mesh(gl, cylinderGeometry());
    const ring = mesh(gl, ringGeometry());
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
    gl.enable(gl.BLEND);
    gl.cullFace(gl.BACK);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const dark: Vec3 = [0.25, 0.28, 0.29];
    const housing: Vec3 = [0.40, 0.43, 0.44];
    const motor: Vec3 = [0.43, 0.46, 0.47];
    const steel: Vec3 = [0.62, 0.65, 0.66];
    const gear: Vec3 = [0.52, 0.55, 0.56];
    const rubber: Vec3 = [0.08, 0.09, 0.10];
    const accent: Vec3 = [0.60, 0.23, 0.075];

    const bind = (item: Mesh) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, item.position);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, item.normal);
      gl.enableVertexAttribArray(normalLocation);
      gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
    };

    const draw = (item: Mesh, model: Float32Array, color: Vec3, alpha = 1) => {
      bind(item);
      gl.uniformMatrix4fv(modelLocation, false, model);
      gl.uniform3fv(colorLocation, color);
      gl.uniform1f(alphaLocation, alpha);
      gl.drawArrays(gl.TRIANGLES, 0, item.count);
    };

    let frame = 0;
    let visible = true;
    let currentX = -0.15;
    let currentY = -0.72;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.02 });
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
      frame = requestAnimationFrame(render);
      if (!visible) return;
      resize();

      const raw = clamp01(progressRef.current);
      const p = reduced ? Math.round(raw * 9) / 9 : raw;
      const step = stepRef.current;
      const pointer = pointerRef.current;
      const motorSeparate = smoothstep(0.09, 0.22, p);
      const housingOpen = smoothstep(0.18, 0.34, p);
      const internalsOpen = smoothstep(0.28, 0.63, p);
      const reassemble = smoothstep(0.80, 0.97, p);
      const explode = internalsOpen * (1 - reassemble);
      const open = 1 - reassemble;
      const shellAlpha = 1 - housingOpen * open * 0.72;

      const targetY = -0.72 + p * 0.22 + pointer.x;
      const targetX = -0.16 + Math.sin(p * Math.PI) * 0.08 + pointer.y;
      currentY += (targetY - currentY) * (reduced ? 1 : 0.08);
      currentX += (targetX - currentX) * (reduced ? 1 : 0.08);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const aspect = canvas.width / canvas.height;
      gl.uniformMatrix4fv(projectionLocation, false, perspective(Math.PI / 4.1, aspect, 0.1, 100));
      gl.uniformMatrix4fv(viewLocation, false, translation(aspect < 0.85 ? -0.15 : 0.35, -0.15, aspect < 0.85 ? -12.2 : -10.6));

      const root = multiply(rotationY(currentY), rotationX(currentX));
      const part = (item: Mesh, position: Vec3, rotation: Vec3, size: Vec3, color: Vec3, alpha = 1) => {
        draw(item, multiply(root, compose(position, rotation, size)), color, alpha);
      };
      const tone = (target: number, base: Vec3) => step === target ? accent : base;
      const motorShift = 1.45 * motorSeparate * open;
      const coverShift = -1.05 * housingOpen * open;

      gl.depthMask(true);
      part(cylinder, [0.58 + explode * 0.24, 0, 0.16], [0, 0, Math.PI / 2], [0.13, 0.82, 0.13], tone(2, steel));
      part(cylinder, [-0.02 + explode * 0.12, 0, 0.16], [0, 0, Math.PI / 2], [0.34, 0.11, 0.34], tone(2, gear));
      part(cylinder, [-0.34 - explode * 0.12, 0.30 + explode * 0.22, -0.30], [0, 0, Math.PI / 2], [0.55, 0.12, 0.55], tone(3, gear));
      for (let i = 0; i < 14; i += 1) {
        const a = (i / 14) * TAU;
        part(box, [-0.34 - explode * 0.12, 0.30 + Math.cos(a) * 0.54 + explode * 0.22, -0.30 + Math.sin(a) * 0.54], [a, 0, 0], [0.20, 0.12, 0.09], tone(3, gear));
      }
      part(cylinder, [-0.30 - explode * 0.12, 0.30 + explode * 0.22, -0.30], [0, 0, Math.PI / 2], [0.12, 0.70, 0.12], tone(3, steel));
      part(cylinder, [-0.55 - explode * 0.24, 0.18, -0.18], [0, 0, Math.PI / 2], [0.31, 0.11, 0.31], tone(4, gear));
      part(cylinder, [-0.55, -0.24 - explode * 0.20, -0.18], [0, 0, 0], [0.50, 0.12, 0.50], tone(4, gear));
      part(cylinder, [-0.55, -0.88 - explode * 0.32, -0.18], [0, 0, 0], [0.17, 0.86, 0.17], tone(7, steel));
      part(ring, [-0.55, -0.48 - explode * 0.12, -0.18], [0, 0, 0], [0.39, 0.10, 0.39], tone(5, steel));
      part(ring, [-0.55, 0.20 + explode * 0.10, -0.18], [0, 0, 0], [0.39, 0.10, 0.39], tone(5, steel));
      part(ring, [-0.55, -1.38 - explode * 0.40, -0.18], [0, 0, 0], [0.33, 0.07, 0.33], tone(6, rubber));

      gl.depthMask(shellAlpha > 0.95);
      part(box, [-0.48, 0, -0.08], [0, 0.02, 0], [1.72, 1.46, 1.55], tone(8, housing), shellAlpha);
      part(box, [-0.48, 0, -1.05], [0, 0.02, 0], [2.02, 1.56, 0.36], tone(8, dark), shellAlpha);
      part(box, [-0.48, 0, 0.92], [0, 0.02, 0], [1.18, 1.02, 0.32], tone(8, housing), shellAlpha);
      part(cylinder, [-0.55, -0.88, -0.18], [0, 0, 0], [0.78, 0.20, 0.78], tone(8, dark), shellAlpha);
      part(cylinder, [-0.55, -1.18 + coverShift, -0.18], [0, 0, 0], [0.67, 0.09, 0.67], tone(8, housing), Math.max(0.35, shellAlpha));
      for (let i = 0; i < 4; i += 1) {
        part(box, [-1.36, 0, -0.58 + i * 0.36], [0, 0.02, 0], [0.10, 1.48, 0.08], tone(8, dark), shellAlpha);
      }
      gl.depthMask(true);

      const motorX = 1.78 + motorShift;
      part(cylinder, [0.58 + motorShift * 0.30, 0, 0.13], [0, 0, Math.PI / 2], [0.68, 0.12, 0.68], tone(1, dark));
      part(cylinder, [motorX, 0, 0.13], [0, 0, Math.PI / 2], [0.64, 1.32, 0.64], tone(1, motor));
      for (let i = 0; i < 8; i += 1) {
        part(cylinder, [1.06 + i * 0.22 + motorShift, 0, 0.13], [0, 0, Math.PI / 2], [0.69, 0.035, 0.69], tone(1, motor));
      }
      part(cylinder, [3.05 + motorShift, 0, 0.13], [0, 0, Math.PI / 2], [0.67, 0.22, 0.67], tone(1, dark));
      part(box, [1.75 + motorShift, 0, 0.95], [0, 0, 0], [0.58, 0.62, 0.38], tone(1, dark));
      part(box, [1.75 + motorShift, 0, 1.18], [0, 0, 0], [0.62, 0.66, 0.07], tone(1, steel));
    };

    frame = requestAnimationFrame(render);

    const onDown = (event: PointerEvent) => {
      const pointer = pointerRef.current;
      pointer.dragging = true;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      const pointer = pointerRef.current;
      if (!pointer.dragging) return;
      const dx = event.clientX - pointer.lastX;
      const dy = event.clientY - pointer.lastY;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      pointer.x = Math.max(-0.45, Math.min(0.45, pointer.x + dx * 0.004));
      pointer.y = Math.max(-0.24, Math.min(0.24, pointer.y + dy * 0.003));
    };
    const onUp = (event: PointerEvent) => {
      pointerRef.current.dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      for (const item of [box, cylinder, ring]) {
        gl.deleteBuffer(item.position);
        gl.deleteBuffer(item.normal);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
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

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// WebGL1 version of the supplied Warp stripes recipe. The packed uniforms keep
// the shader within WebGL1's guaranteed fragment-vector limit.
const fragmentShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 u_colors[4];
uniform vec4 u_scene, u_shape, u_surface, u_finish, u_transform;
#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_grain u_finish.w
#define u_seed u_transform.x

float hash21(vec2 p) { p = fract(p * vec2(234.34, 435.345)); p += dot(p, p + 34.23); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.0, 9.2); a *= 0.5; } return v; }
vec3 palette(float x) {
  x = clamp(x, 0.0, 1.0) * 3.0;
  float i = floor(x), f = smoothstep(0.0, 1.0, fract(x));
  vec3 a = i < 1.0 ? u_colors[0] : (i < 2.0 ? u_colors[1] : u_colors[2]);
  vec3 b = i < 1.0 ? u_colors[1] : (i < 2.0 ? u_colors[2] : u_colors[3]);
  return mix(a, b, f);
}
vec3 hueRotate(vec3 c, float a) {
  const mat3 y = mat3(0.299,0.596,0.211, 0.587,-0.274,-0.523, 0.114,-0.322,0.312);
  const mat3 r = mat3(1.0,1.0,1.0, 0.956,-0.272,-1.106, 0.621,-0.647,1.703);
  vec3 q = y * c; float co = cos(a), si = sin(a); q = vec3(q.x, q.y * co - q.z * si, q.y * si + q.z * co); return r * q;
}
float grain(vec2 p) { return hash21(p * 0.1031 + vec2(7.1, 3.7)); }
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  p *= u_scale;
  p += u_warp * (vec2(fbm(p * u_detail + u_seed), fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  float field = fbm(p * 1.5 + u_time * 0.15 + u_seed) * u_intensity * 2.0;
  float stripes = 0.5 + 0.5 * sin((p.x * 0.8 + p.y * 0.4 + field) * (3.0 + u_paramA * 20.0) + u_time * 0.5);
  vec3 col = palette(stripes);
  col = (col - 0.5) * u_contrast + 0.5;
  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luma), col, u_saturation);
  col = hueRotate(col, u_hue) + u_brightness;
  float vignette = length(uv - 0.5) * 1.41421356;
  col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vignette);
  col += (grain(gl_FragCoord.xy + u_seed * 17.0) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export function WarpStripesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false });
    if (!canvas || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Unable to create WebGL shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compilation failed");
      return shader;
    };
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_scene");
    const shape = gl.getUniformLocation(program, "u_shape");
    const surface = gl.getUniformLocation(program, "u_surface");
    const finish = gl.getUniformLocation(program, "u_finish");
    const transform = gl.getUniformLocation(program, "u_transform");
    const colors = gl.getUniformLocation(program, "u_colors");
    gl.uniform3fv(colors, new Float32Array([0.051, 0.106, 0.059, 0.243, 0.557, 0.255, 0.780, 0.957, 0.392, 1.0, 0.992, 0.882]));
    gl.uniform4f(shape, 0.62, 0.06, 0.24, 0.48);
    gl.uniform4f(surface, 1.09, 1.33, -0.36, 1.40);
    gl.uniform4f(finish, 4.03, 0.34, 0.0, 0.02);
    gl.uniform4f(transform, 1170.0, 4.01, 0.20, 0.0);

    let frame = 0;
    let start = performance.now();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height); }
    };
    let lastFrame = 0;
    const render = (now: number) => {
      if (now - lastFrame < 33) {
        frame = requestAnimationFrame(render);
        return;
      }
      lastFrame = now;
      resize();
      gl.uniform4f(resolution, canvas.width, canvas.height, (now - start) * -0.0002, 4.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(render);
    };
    const visibility = () => { if (document.hidden) cancelAnimationFrame(frame); else { start = performance.now(); frame = requestAnimationFrame(render); } };
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    frame = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", visibility); gl.deleteProgram(program); gl.deleteBuffer(buffer); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}

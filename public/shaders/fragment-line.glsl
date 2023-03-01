uniform vec3 uColorActive;
uniform float uProgress;
varying vec2 vUv;

void main()
{
  float limit = step(vUv.x, uProgress);

  vec4 colorHide = vec4(0.0, 0.0, 0.0, 0.0);
  vec4 colorActive = vec4(uColorActive, 1.0);
  vec4 colors = mix(colorHide, colorActive, limit);

  gl_FragColor = vec4(uColorActive, 1.0);
}
export const heatMapShader = {
    vertexShader:/* glsl */ `
    uniform float iTime;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position =  projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`,

    fragmentShader: /* glsl */`
     #ifdef GL_ES
    precision highp float;
    #endif
    varying vec2 vUv;
    uniform sampler2D alphaScaleMap;
    uniform sampler2D paletteMap;
    void main() {
      vec4 alphaColor = texture2D(alphaScaleMap, vUv);
      vec4 color = texture2D(paletteMap, vec2(alphaColor.a, 0.0));
      gl_FragColor = vec4(color.r, color.g, color.b, alphaColor.a);
    }
`
}
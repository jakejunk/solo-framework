precision mediump float;

uniform sampler2D u_image;

varying vec4 v_color;
varying vec2 v_texCoord;
 
void main() {
    vec4 color = v_color * texture2D(u_image, v_texCoord);
    gl_FragColor = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a);
}
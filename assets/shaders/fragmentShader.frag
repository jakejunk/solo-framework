precision mediump float;

uniform sampler2D u_image;

varying vec4 v_color;
varying vec2 v_texCoord;
 
void main() {
    gl_FragColor = v_color * texture2D(u_image, v_texCoord);
}
import { ClearOptions } from "/solo/graphics/constants/clearOptions";
import { Color } from "/solo/graphics/color";
import { ContentLoader } from "/solo/content/contentLoader";
import { Game } from "/solo/core/game";
import { GameComponents } from "/solo/core/gameComponents";
import { GameManager } from "/solo/core/gameManager";
import { Gl } from "/solo/graphics/constants/gl";
import { GraphicsContext } from "/solo/graphics/graphicsContext";
import { ScalingAlgorithm } from "/solo/core/scalingAlgorithm";
import { Texture2D } from "/solo/graphics/texture2d";

const vertexShader = 
`attribute vec2 a_position;
attribute vec4 a_color;
attribute vec2 a_texCoord;

varying vec4 v_color;
varying vec2 v_texCoord;
 
void main() {
    gl_Position = vec4(a_position.xy, 0.0, 1.0);
    v_color = a_color;
    v_texCoord = a_texCoord;
    v_texCoord.y = 1.0 - v_texCoord.y;
}`;

const fragmentShader =
`precision mediump float;

uniform sampler2D u_image;

varying vec4 v_color;
varying vec2 v_texCoord;
 
void main() {
    gl_FragColor = v_color * texture2D(u_image, v_texCoord);
}`;

document.addEventListener("DOMContentLoaded", () => {
    const game = GameManager.Create(TextureTest, {
        bufferWidth: 200,
        bufferHeight: 200,
        scalingAlgorithm: ScalingAlgorithm.PIXELATED
    });

    game.start();
});

class TextureTest implements Game
{
    public shouldExit = false;
    
    private readonly loader: ContentLoader;
    private readonly graphics: GraphicsContext;
    private shaderProgram!: WebGLProgram;
    private texture!: Texture2D;

    public constructor(components: GameComponents)
    {
        this.loader = components.loader;
        this.graphics = components.graphicsContext;
        this.graphics.setClearColor(Color.AMETHYST);
    }
    
    public async onLoad(): Promise<void>
    {
        const texturePromise = this.loader.loadTexture2D("/_assets/img/test.png");

        const gl = this.graphics.gl;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        this.shaderProgram = this._createProgram();
        this.texture = await texturePromise;
    }

    private _createProgram(): WebGLProgram
    {
        const gl = this.graphics.gl;
        const program = gl.createProgram()!;

        gl.attachShader(program, TextureTest._CompileShader(gl, vertexShader, Gl.VERTEX_SHADER));
        gl.attachShader(program, TextureTest._CompileShader(gl, fragmentShader, Gl.FRAGMENT_SHADER));
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            throw new Error(`Program failed to link: ${gl.getProgramInfoLog(program)}`);
        }

        return program;
    }

    private static _CompileShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: number): WebGLShader
    {
        const shader = gl.createShader(shaderType)!;
       
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
       
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            throw new Error(`Could not compile shader: ${gl.getShaderInfoLog(shader)}`);
        }
       
        return shader;
    }

    public onUpdate(delta: number): void
    {

    }

    public onDraw(delta: number): void
    {
        this.graphics.clear(ClearOptions.COLOR_BUFFER);

        this._renderTexture(this.graphics.gl);
    }

    /**
     * Naive texture rendering.
     */
    private _renderTexture(gl: WebGLRenderingContext)
    {
        gl.useProgram(this.shaderProgram);

        this.graphics.textureManager.bindTextureToLocation(this.texture, 0);

        const posLocation = gl.getAttribLocation(this.shaderProgram, "a_position");
        const colorLocation = gl.getAttribLocation(this.shaderProgram, "a_color");
        const texCoordLocation = gl.getAttribLocation(this.shaderProgram, "a_texCoord");

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(Gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(Gl.ARRAY_BUFFER, new Float32Array([
            -0.5, -0.5, Color.WHITE.toEncodedFloat(), 0.0, 0.0,
            -0.5, +0.5, Color.WHITE.toEncodedFloat(), 0.0, 1.0,
            +0.5, +0.5, Color.WHITE.toEncodedFloat(), 1.0, 1.0,
            +0.5, -0.5, Color.WHITE.toEncodedFloat(), 1.0, 0.0]), gl.STATIC_DRAW);
        
        gl.enableVertexAttribArray(posLocation);
        gl.vertexAttribPointer(posLocation, 2, Gl.FLOAT, false, 20, 0);
        gl.enableVertexAttribArray(colorLocation);
        gl.vertexAttribPointer(colorLocation, 4, Gl.UNSIGNED_BYTE, true, 20, 8);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, Gl.FLOAT, false, 20, 12);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(Gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(Gl.ELEMENT_ARRAY_BUFFER, new Int16Array([
            0, 1, 2, 2, 3, 0
        ]), Gl.STATIC_DRAW);

        gl.drawElements(Gl.TRIANGLES, 6, Gl.UNSIGNED_SHORT, 0);
    }
}
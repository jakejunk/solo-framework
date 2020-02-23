import { ClearOptions } from "/solo/graphics/constants/clearOptions";
import { Color } from "/solo/graphics/color";
import { ContentLoader } from "/solo/content/contentLoader";
import { Game } from "/solo/core/game";
import { GameComponents } from "/solo/core/gameComponents";
import { GameManager } from "/solo/core/gameManager";
import { Gl } from "/solo/graphics/constants/gl";
import { GraphicsContext } from "/solo/graphics/graphicsContext";
import { ScalingAlgorithm } from "/solo/core/scalingAlgorithm";
import { ShaderProgram } from "/solo/graphics/shaders/shaderProgram";
import { Texture2D } from "/solo/graphics/textures/texture2d";

document.addEventListener("DOMContentLoaded", () => {
    const game = GameManager.Create(ShaderTest, {
        bufferWidth: 200,
        bufferHeight: 200,
        scalingAlgorithm: ScalingAlgorithm.PIXELATED,
        rootDirectory: "/_assets/"
    });

    game.start();
});

class ShaderTest implements Game
{
    public shouldExit = false;
    
    private readonly loader: ContentLoader;
    private readonly graphics: GraphicsContext;
    private shaderProgram!: ShaderProgram;
    private texture!: Texture2D;

    public constructor(components: GameComponents)
    {
        this.loader = components.loader;
        this.graphics = components.graphicsContext;
        this.graphics.setClearColor(Color.AMETHYST);
    }
    
    public async onLoad(): Promise<void>
    {
        const texturePromise = this.loader.loadTexture2D("img/test.png");

        const gl = this.graphics.gl;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const vertexShader = await this.loader.loadText("shaders/vertexShader.vert");
        const fragmentShader = await this.loader.loadText("shaders/fragmentShader.frag");

        this.shaderProgram = ShaderProgram.Create(this.graphics, vertexShader, fragmentShader).unwrap();
        this.texture = await texturePromise;
    }

    public onUpdate(): void { }

    public onDraw(): void
    {
        this.graphics.clear(ClearOptions.COLOR_BUFFER);

        this._renderTexture(this.graphics.gl);
    }

    /**
     * Naive texture rendering.
     */
    private _renderTexture(gl: WebGLRenderingContext)
    {
        this.shaderProgram.bind();

        const posLocation = this.shaderProgram.getAttribLocation("a_position");
        const colorLocation = this.shaderProgram.getAttribLocation("a_color");
        const texCoordLocation = this.shaderProgram.getAttribLocation("a_texCoord");

        this.graphics.textureManager.bindTextureToLocation(this.texture, 0);

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
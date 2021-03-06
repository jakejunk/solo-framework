import { AttributeType } from "/solo/graphics/constants/attributeType";
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
import { VertexAttribute } from "/solo/graphics/vertices/vertexAttribute";
import { VertexBuffer } from "/solo/graphics/vertices/vertexBuffer";

document.addEventListener("DOMContentLoaded", () => {
    const game = GameManager.Create(VertexBufferTest, {
        bufferWidth: 200,
        bufferHeight: 200,
        scalingAlgorithm: ScalingAlgorithm.PIXELATED,
        rootDirectory: "/_assets"
    });

    game.start();
});

class VertexBufferTest implements Game
{
    public shouldExit = false;
    
    private readonly loader: ContentLoader;
    private readonly graphics: GraphicsContext;
    private shaderProgram!: ShaderProgram;
    private vertexBuffer!: VertexBuffer;
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

        this.shaderProgram = this.graphics.shaderManager.createShaderProgram(vertexShader, fragmentShader).unwrap();

        this.vertexBuffer = this.graphics.vertexManager.createVertexBuffer(4,
            new VertexAttribute("a_position", 2, AttributeType.FLOAT, false),
            new VertexAttribute("a_color", 4, AttributeType.UNSIGNED_BYTE, true),
            new VertexAttribute("a_texCoord", 2, AttributeType.FLOAT, false));

        this.vertexBuffer.updateAttributeLocations(this.shaderProgram);

        this._setBufferValues(this.vertexBuffer.buffer);

        this.texture = await texturePromise;
    }

    private _setBufferValues(b: Float32Array)
    {
        b[0] = -0.5;
        b[1] = -0.5;
        b[2] = Color.ALIZARIN.toEncodedFloat();
        b[3] = 0.0;
        b[4] = 0.0;

        b[5] = -0.5;
        b[6] = +0.5;
        b[7] = Color.ALIZARIN.toEncodedFloat();
        b[8] = 0.0;
        b[9] = 1.0;

        b[10] = +0.5;
        b[11] = +0.5;
        b[12] = Color.PETER_RIVER.toEncodedFloat();
        b[13] = 1.0;
        b[14] = 1.0;

        b[15] = +0.5;
        b[16] = -0.5;
        b[17] = Color.PETER_RIVER.toEncodedFloat();
        b[18] = 1.0;
        b[19] = 0.0;
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
        this.graphics.shaderManager.bindShader(this.shaderProgram);
        this.graphics.textureManager.bindTextureToLocation(this.texture, 0);
        this.graphics.vertexManager.flushVertexBuffer(this.vertexBuffer);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(Gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(Gl.ELEMENT_ARRAY_BUFFER, new Int16Array([
            0, 1, 2, 2, 3, 0
        ]), Gl.STATIC_DRAW);

        gl.drawElements(Gl.TRIANGLES, 6, Gl.UNSIGNED_SHORT, 0);
    }
}
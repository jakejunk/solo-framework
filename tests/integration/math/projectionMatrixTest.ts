import { AttributeType } from "/solo/graphics/constants/attributeType";
import { ClearOptions } from "/solo/graphics/constants/clearOptions";
import { Color } from "/solo/graphics/color";
import { ContentLoader } from "/solo/content/contentLoader";
import { Game } from "/solo/core/game";
import { GameComponents } from "/solo/core/gameComponents";
import { GameManager } from "/solo/core/gameManager";
import { Gl } from "/solo/graphics/constants/gl";
import { GraphicsContext } from "/solo/graphics/graphicsContext";
import { Matrix4 } from "/solo/math/matrix44";
import { ScalingAlgorithm } from "/solo/core/scalingAlgorithm";
import { ShaderProgram } from "/solo/graphics/shaders/shaderProgram";
import { Texture2D } from "/solo/graphics/textures/texture2d";
import { UniformLocation } from "/solo/graphics/shaders/shaderManager";
import { VertexAttribute } from "/solo/graphics/vertices/vertexAttribute";
import { VertexBuffer } from "/solo/graphics/vertices/vertexBuffer";

document.addEventListener("DOMContentLoaded", () => {
    const game = GameManager.Create(ProjectionMatrixTest, {
        bufferWidth: 200,
        bufferHeight: 200,
        scalingAlgorithm: ScalingAlgorithm.PIXELATED,
        rootDirectory: "/_assets"
    });

    game.start();
});

class ProjectionMatrixTest implements Game
{
    public shouldExit = false;
    
    private readonly loader: ContentLoader;
    private readonly graphics: GraphicsContext;
    private shaderProgram!: ShaderProgram;
    private vertexBuffer!: VertexBuffer;
    private matrixUniform!: UniformLocation;
    private texture!: Texture2D;
    private projectionMatrix!: Matrix4;

    private x = 0;
    private y = 0;
    private dx = 3.1;
    private dy = 2.2;

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
        gl.pixelStorei(Gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const vertexShader = await this.loader.loadText("shaders/projectedVertexShader.vert");
        const fragmentShader = await this.loader.loadText("shaders/fragmentShader.frag");

        this.shaderProgram = this.graphics.shaderManager.createShaderProgram(vertexShader, fragmentShader).unwrap();
        this.matrixUniform = this.shaderProgram.getUniformLocation("u_pMatrix")!;

        this.vertexBuffer = this.graphics.vertexManager.createVertexBuffer(4,
            new VertexAttribute("a_position", 2, AttributeType.FLOAT, false),
            new VertexAttribute("a_color", 4, AttributeType.UNSIGNED_BYTE, true),
            new VertexAttribute("a_texCoord", 2, AttributeType.FLOAT, false));

        this.vertexBuffer.updateAttributeLocations(this.shaderProgram);

        this.projectionMatrix = Matrix4.CreateOrtho(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

        this.texture = await texturePromise;
    }

    public onUpdate(delta: number): void
    {
        this.x += this.dx * 20 * delta;
        this.y += this.dy * 20 * delta;

        if (this.x < 0 || this.x + this.texture.getWidth() > this.graphics.gl.canvas.width)
        {
            this.dx *= -1;
            this.x += this.dx * 50 * delta;
        }

        if (this.y < 0 || this.y + this.texture.getHeight() > this.graphics.gl.canvas.height)
        {
            this.dy *= -1;
            this.y += this.dy * 50 * delta;
        }

        this._setBufferValues(this.x, this.y, Color.WHITE);
    }

    private _setBufferValues(x: number, y: number, color: Color)
    {
        const v = this.vertexBuffer;
        const c = color.toEncodedFloat();
        const x2 = x + this.texture.getWidth();
        const y2 = y + this.texture.getHeight();

        v[0] = x;
        v[1] = y;
        v[2] = c;
        v[3] = 0.0;
        v[4] = 0.0;

        v[5] = x;
        v[6] = y2;
        v[7] = c;
        v[8] = 0.0;
        v[9] = 1.0;

        v[10] = x2;
        v[11] = y2;
        v[12] = c;
        v[13] = 1.0;
        v[14] = 1.0;

        v[15] = x2;
        v[16] = y;
        v[17] = c;
        v[18] = 1.0;
        v[19] = 0.0;
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
        this.shaderProgram.setUniformMatrix4(this.matrixUniform, this.projectionMatrix);
        
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
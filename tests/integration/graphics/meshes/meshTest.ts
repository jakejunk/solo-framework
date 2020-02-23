import { AttributeType } from "/solo/graphics/constants/attributeType";
import { ClearOptions } from "/solo/graphics/constants/clearOptions";
import { Color } from "/solo/graphics/color";
import { ContentLoader } from "/solo/content/contentLoader";
import { Game } from "/solo/core/game";
import { GameComponents } from "/solo/core/gameComponents";
import { GameManager } from "/solo/core/gameManager";
import { GraphicsContext } from "/solo/graphics/graphicsContext";
import { Mesh } from "/solo/graphics/meshes/mesh";
import { ScalingAlgorithm } from "/solo/core/scalingAlgorithm";
import { ShaderProgram } from "/solo/graphics/shaders/shaderProgram";
import { Texture2D } from "/solo/graphics/textures/texture2d";
import { VertexAttribute } from "/solo/graphics/meshes/vertexAttribute";
import { VertexDefinition } from "/solo/graphics/meshes/vertexDefinition";

document.addEventListener("DOMContentLoaded", () => {
    const game = GameManager.Create(MeshTest, {
        bufferWidth: 200,
        bufferHeight: 200,
        scalingAlgorithm: ScalingAlgorithm.PIXELATED,
        rootDirectory: "/_assets"
    });

    game.start();
});

class MeshTest implements Game
{
    public shouldExit = false;
    
    private readonly loader: ContentLoader;
    private readonly graphics: GraphicsContext;
    private shaderProgram!: ShaderProgram;
    private mesh!: Mesh;
    private texture!: Texture2D;

    public constructor(components: GameComponents)
    {
        this.loader = components.loader;
        this.graphics = components.graphicsContext;
        this.graphics.setClearColor(Color.TURQUOISE);
    }
    
    public async onLoad(): Promise<void>
    {
        const texturePromise = this.loader.loadTexture2D("img/test.png");

        const gl = this.graphics.gl;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const vertexShader = await this.loader.loadText("shaders/vertexShader.vert");
        const fragmentShader = await this.loader.loadText("shaders/invertedFragmentShader.frag");

        this.shaderProgram = ShaderProgram.Create(this.graphics, vertexShader, fragmentShader).unwrap();

        this.mesh = Mesh.Create(this.graphics, {
            vertexDefinition: new VertexDefinition(
                new VertexAttribute("a_position", 2, AttributeType.FLOAT, false),
                new VertexAttribute("a_color", 4, AttributeType.UNSIGNED_BYTE, true),
                new VertexAttribute("a_texCoord", 2, AttributeType.FLOAT, false)),
            numVertices: 4,
            indices: new Uint16Array([
                0, 1, 2, 2, 3, 0
            ]),
            shaderProgram: this.shaderProgram
        });

        this._setBufferValues(this.mesh.vertices);

        this.mesh.flushVertices();

        this.texture = await texturePromise;
    }

    private _setBufferValues(b: Float32Array)
    {
        b[0] = -0.5;
        b[1] = -0.5;
        b[2] = Color.ORANGE.toEncodedFloat();
        b[3] = 0.0;
        b[4] = 0.0;

        b[5] = -0.5;
        b[6] = +0.5;
        b[7] = Color.ORANGE.toEncodedFloat();
        b[8] = 0.0;
        b[9] = 1.0;

        b[10] = +0.5;
        b[11] = +0.5;
        b[12] = Color.ORANGE.toEncodedFloat();
        b[13] = 1.0;
        b[14] = 1.0;

        b[15] = +0.5;
        b[16] = -0.5;
        b[17] = Color.ORANGE.toEncodedFloat();
        b[18] = 1.0;
        b[19] = 0.0;
    }

    public onUpdate(): void { }

    public onDraw(): void
    {
        this.graphics.clear(ClearOptions.COLOR_BUFFER);

        this._renderTexture();
    }

    private _renderTexture()
    {
        const g = this.graphics;

        g.textureManager.bindTextureToLocation(this.texture, 0);

        this.mesh.render();
    }
}
import { Game } from "/solo/core/game";
import { GameComponents } from "/solo/core/gameComponents";
import { GameManager } from "/solo/core/gameManager";
import { GameTimer } from "/solo/core/gameTimer";
import { GraphicsContext } from "/solo/graphics/graphicsContext";
import { Logger } from "/solo/util/logger";
import { ScalingAlgorithm } from "/solo/core/scalingAlgorithm";
import { ShaderProgram } from "/solo/graphics/shaders/shaderProgram";

const vertexShader = 
`void main() {
    gl_Position = vec4(1.0, 1.0, 1.0, 1.0);
}`;

const fragmentShader =
`precision mediump float;
 
void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

document.addEventListener("DOMContentLoaded", () => {
    const game = GameManager.Create(BadShaderTest, {
        bufferWidth: 200,
        bufferHeight: 200,
        scalingAlgorithm: ScalingAlgorithm.PIXELATED
    });

    game.start();
});

class BadShaderTest implements Game
{
    private static readonly _Logger = new Logger(BadShaderTest.name);

    public shouldExit = false;
    
    private readonly timer: GameTimer;
    private readonly graphics: GraphicsContext;

    public constructor(components: GameComponents)
    {
        this.timer = components.timer;
        this.graphics = components.graphicsContext;
    }
    
    public async onLoad(): Promise<void>
    {
        const badVertexShader = vertexShader.substring(0, 5);
        const badProgramResult1 = ShaderProgram.Create(this.graphics, badVertexShader, fragmentShader);

        if (badProgramResult1.isOk())
        {
            throw new Error("This should not happen");
        }
        else
        {
            BadShaderTest._Logger.log("Bad vertex shader failed, as expected");
        }

        const badFragmentShader = fragmentShader.substring(0, 5);
        const badProgramResult2 = ShaderProgram.Create(this.graphics, vertexShader, badFragmentShader);

        if (badProgramResult2.isOk())
        {
            throw new Error("This should not happen");
        }
        else
        {
            BadShaderTest._Logger.log("Bad fragment shader failed, as expected");
        }

        ShaderProgram.Create(this.graphics, vertexShader, fragmentShader).unwrap();
        
        BadShaderTest._Logger.log("🤙");
    }

    public onUpdate(): void
    {
        this.timer.suppressRender();
    }

    public onDraw(delta: number): void { }
}
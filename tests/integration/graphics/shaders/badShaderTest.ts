import { Game } from "/solo/core/game";
import { GameComponents } from "/solo/core/gameComponents";
import { GameManager } from "/solo/core/gameManager";
import { GameTimer } from "/solo/core/gameTimer";
import { Logger } from "/solo/util/logger";
import { ScalingAlgorithm } from "/solo/core/scalingAlgorithm";
import { ShaderManager } from "/solo/graphics/shaderManager";

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
    private readonly shaderManager: ShaderManager;

    public constructor(components: GameComponents)
    {
        this.timer = components.timer;
        this.shaderManager = components.graphicsContext.shaderManager;
    }
    
    public async onLoad(): Promise<void>
    {
        const shaderManager = this.shaderManager;
        const badVertexShader = vertexShader.substring(0, 5);
        const badProgramResult1 = shaderManager.createShaderProgram(badVertexShader, fragmentShader);

        if (badProgramResult1.isOk())
        {
            throw new Error("This should not happen");
        }
        else
        {
            BadShaderTest._Logger.log("Bad vertex shader failed, as expected");
        }

        const badFragmentShader = fragmentShader.substring(0, 5);
        const badProgramResult2 = shaderManager.createShaderProgram(vertexShader, badFragmentShader);

        if (badProgramResult2.isOk())
        {
            throw new Error("This should not happen");
        }
        else
        {
            BadShaderTest._Logger.log("Bad fragment shader failed, as expected");
        }

        shaderManager.createShaderProgram(vertexShader, fragmentShader).unwrap();
        
        BadShaderTest._Logger.log("🤙");
    }

    public onUpdate(delta: number): void
    {
        this.timer.suppressRender();
    }

    public onDraw(delta: number): void
    {
        
    }
}
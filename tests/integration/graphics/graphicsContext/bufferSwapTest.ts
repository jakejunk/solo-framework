import { ClearOptions } from "/solo/graphics/constants/clearOptions";
import { Color } from "/solo/graphics/color";
import { Game } from "/solo/core/game";
import { GameComponents } from "/solo/core/gameComponents";
import { GameManager } from "/solo/core/gameManager";
import { GameTimer } from "/solo/core/gameTimer";
import { GraphicsContext } from "/solo/graphics/graphicsContext";

document.addEventListener("DOMContentLoaded", () => {
    const game = GameManager.Create(BufferSwapTest, {
        bufferWidth: 300,
        bufferHeight: 300
    });

    game.start();
});

let clicked = false;

document.addEventListener("mousedown", () => clicked = true);
document.addEventListener("mouseup", () => clicked = false);

class BufferSwapTest implements Game
{
    public shouldExit = false;

    private currentClearColor: number;
    private readonly timer: GameTimer;
    private readonly graphics: GraphicsContext;
    private readonly clearColors: Color[];

    public constructor(components: GameComponents)
    {
        this.currentClearColor = 0;
        this.clearColors = [
            Color.Clone(Color.BELIZE_HOLE),
            Color.Clone(Color.AMETHYST)
        ];

        this.timer = components.timer;
        this.graphics = components.graphicsContext;
        this.graphics.setClearColor(this.clearColors[this.currentClearColor]);
    }
    
    public onLoad(): Promise<void>
    {
        return Promise.resolve(undefined);
    }

    public onUpdate(): void
    {
        this.currentClearColor = (this.currentClearColor + 1) % this.clearColors.length;
        this.graphics.setClearColor(this.clearColors[this.currentClearColor]);

        if (clicked)
        {
            this.timer.suppressRender();
        }
    }

    public onDraw(): void
    {
        this.graphics.clear(ClearOptions.COLOR_BUFFER);
    }
}
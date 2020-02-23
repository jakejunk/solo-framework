import { ClearOptions } from "/solo/graphics/constants/clearOptions";
import { Color } from "/solo/graphics/color";
import { Game } from "/solo/core/game";
import { GameComponents } from "/solo/core/gameComponents";
import { GameManager } from "/solo/core/gameManager";
import { GraphicsContext } from "/solo/graphics/graphicsContext";

document.addEventListener("DOMContentLoaded", () => {
    const game = GameManager.Create(ClearScreenTest, {
        bufferWidth: 300,
        bufferHeight: 300
    });

    game.start();
});

class ClearScreenTest implements Game
{
    public shouldExit = false;
    
    private timeAccumulator: number;
    private currentClearColor: number;
    private readonly graphics: GraphicsContext;
    private readonly clearColors: Color[];

    public constructor(components: GameComponents)
    {
        this.timeAccumulator = 0;
        this.currentClearColor = 0;
        this.clearColors = [
            Color.Clone(Color.BELIZE_HOLE),
            Color.Clone(Color.AMETHYST)
        ];

        this.graphics = components.graphicsContext;
        this.graphics.setClearColor(this.clearColors[this.currentClearColor]);
    }
    
    public onLoad(): Promise<void>
    {
        return Promise.resolve(undefined);
    }

    public onUpdate(delta: number): void
    {
        this.timeAccumulator += delta;

        if (this.timeAccumulator >= 1)
        {
            this.timeAccumulator = 0;

            this.currentClearColor = (this.currentClearColor + 1) % this.clearColors.length;
            this.graphics.setClearColor(this.clearColors[this.currentClearColor]);
        }
    }

    public onDraw(): void
    {
        this.graphics.clear(ClearOptions.COLOR_BUFFER);
    }
}
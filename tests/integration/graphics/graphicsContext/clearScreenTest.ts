import { GraphicsContext } from "/solo/graphics/graphicsContext.js";
import { GameManager } from "/solo/core/gameManager.js";
import { Game } from "/solo/core/game.js";
import { GameComponents } from "/solo/core/gameComponents.js"
import { Color } from "/solo/graphics/color.js";
import { ClearOptions } from "/solo/graphics/clearOptions.js";

document.addEventListener("DOMContentLoaded", () => {
    const game = GameManager.Create(ClearScreenTest, {
        bufferWidth: 300,
        bufferHeight: 300
    });

    game.start();
});

class ClearScreenTest implements Game
{
    shouldExit = false;
    timeAccumulator: number;
    currentClearColor: number;
    readonly graphics: GraphicsContext;
    readonly clearColors: Color[];

    constructor(components: GameComponents)
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
    
    onLoad(): Promise<{}>
    {
        return Promise.resolve({});
    }

    onUpdate(delta: number): void
    {
        this.timeAccumulator += delta;

        if (this.timeAccumulator >= 1)
        {
            this.timeAccumulator = 0;

            this.currentClearColor = (this.currentClearColor + 1) % this.clearColors.length;
            this.graphics.setClearColor(this.clearColors[this.currentClearColor]);
        }
    }

    onDraw(delta: number): void
    {
        this.graphics.clear(ClearOptions.COLOR_BUFFER);
    }
}
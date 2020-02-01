import { GraphicsContext } from "/solo/graphics/graphicsContext.js";
import { GameManager } from "/solo/core/gameManager.js";
import { Game } from "/solo/core/game.js";
import { GameComponents } from "/solo/core/gameComponents.js"
import { Color } from "/solo/graphics/color.js";
import { ClearOptions } from "/solo/graphics/clearOptions.js";
import { ContentLoader } from "/solo/content/contentLoader";
import { Texture2D } from "/solo/graphics/texture2d";

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
    
    private readonly loader: ContentLoader;
    private readonly graphics: GraphicsContext;
    private texture!: Texture2D;

    public constructor(components: GameComponents)
    {
        this.loader = components.loader;
        this.graphics = components.graphicsContext;
        this.graphics.setClearColor(Color.BELIZE_HOLE);
    }
    
    public async onLoad(): Promise<void>
    {
        this.texture = await this.loader.loadTexture2D("/_assets/img/test.png");
    }

    public onUpdate(delta: number): void
    {

    }

    public onDraw(delta: number): void
    {
        this.graphics.clear(ClearOptions.COLOR_BUFFER);

        this._renderTexture();
    }

    private _renderTexture()
    {
        
    }
}
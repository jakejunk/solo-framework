import { ContentLoader } from "/solo/content/contentLoader";
import { Game } from "/solo/core/game";
import { GameComponents } from "/solo/core/gameComponents";
import { GameManager } from "/solo/core/gameManager";
import { Logger } from "/solo/util/logger";

document.addEventListener("DOMContentLoaded", () => {
    const game = GameManager.Create(ContentLoaderTest, {
        bufferWidth: 300,
        bufferHeight: 300
    });

    game.start();
});

class ContentLoaderTest implements Game
{
    private static readonly _Logger = new Logger("ContentLoaderTest");

    public shouldExit = false;

    private readonly loader: ContentLoader;

    public constructor(components: GameComponents)
    {
        this.loader = components.loader;

        this.loader.setRootDirectory("/_assets");
    }
    
    public async onLoad(): Promise<void>
    {
        await this.loader.loadTexture2D("img/test.png");

        // Should load from cache
        const sameTextureResult = await this.loader.tryLoadTexture2D("img/test.png");
        
        if (sameTextureResult.isErr())
        {
            throw new Error("This should not happen");
        }
        
        try
        {
            // Should throw and error
            await this.loader.loadTexture2D("__file-does-not-exist.bmp");
        }
        catch (e)
        {
            const doesNotExistResult = await this.loader.tryLoadTexture2D("__file-also-does-not-exist.bmp");

            if (doesNotExistResult.isOk())
            {
                throw new Error("This should not happen");
            }

            ContentLoaderTest._Logger.log("🤙");

            return;
        }

        throw new Error("This should not happen");
    }
            

    public onUpdate(delta: number): void
    {
        
    }

    public onDraw(delta: number): void
    {
        
    }
}
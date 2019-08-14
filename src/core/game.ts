import { GameTime } from "./gameTime";
import { GameComponents } from "./gameComponents";

export interface Game
{
    /**
     * Called when the game first starts.
     */
    onLoad(components: GameComponents): Promise<{}>;

    onUpdate(gameTime: Readonly<GameTime>): void;

    onUpdateFixed(gameTime: Readonly<GameTime>): void;

    onDraw(gameTime: Readonly<GameTime>): void;
}
import { GameTime } from "./gameTime";
import { GameComponents } from "./gameComponents";

export interface Game
{
    /**
     * Setting this value to `true` schedules the game to exit on the next frame.
     */
    shouldExit: boolean;

    /**
     * Called when the game first starts.
     */
    onLoad(components: GameComponents): Promise<{}>;

    /**
     * Called when the game is ready to update its logic.
     */
    onUpdate(gameTime: Readonly<GameTime>): void;

    /**
     * Called when the game is ready to draw.
     */
    onDraw(gameTime: Readonly<GameTime>): void;

    onResize?: () => void;

    onResume?: () => void;

    onPause?: () => void;

    onExit?: () => void;
}

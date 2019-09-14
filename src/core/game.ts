export interface Game
{
    /**
     * Setting this value to `true` schedules the game to exit on the next frame.
     */
    shouldExit: boolean;

    /**
     * Called when the game first starts.
     */
    onLoad(): Promise<{}>;

    /**
     * Called when the game is ready to update its logic.
     */
    onUpdate(delta: number): void;

    /**
     * Called when the game is ready to draw.
     */
    onDraw(delta: number): void;

    onResize?: () => void;

    onResume?: () => void;

    onPause?: () => void;

    onExit?: () => void;
}

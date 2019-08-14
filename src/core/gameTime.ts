/**
 * A utility class for holding per-frame timing values.
 */
export class GameTime
{
    /**
     * The elapsed game time since the last update call.
     */
    elapsedGameTime: number = 0;

    /**
     * The total elapsed game time since the game started.
     */
    totalElapsedGameTime: number = 0;

    /**
     * Gets whether the game is taking too long to update or render.
     */
    isRunningSlow: boolean = false;
}
/**
 * Defines the way `Game.onUpdate()` is called throughout a game.
 */
export const enum Timestep
{
    /**
     * Defines an update interval of once per frame, however fast or slow that may be.
     */
    VARIABLE,

    /**
     * Defines a fixed, framerate-independent update interval.
     */
    FIXED
}
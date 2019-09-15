import { Clamp } from "../math/mathHelper";
import { Game } from "./game";
import { Logger } from "../util/logger";
import { Timestep } from "./timestep";

export class GameTimer
{
    private static readonly _Logger = new Logger("GameTimer");

    private _isFixedTimestep!: boolean;
    private _isRunningSlow!: boolean;
    private _totalGameTime: number;
    private _targetFrameTime!: number;
    private _lastTimestamp!: number;
    private _frameTimeAccumulator!: number;
    private _frameLag!: number;

    /** @internal */
    constructor(timestep = Timestep.VARIABLE, frameTime = 1000 / 60, initialTimestamp = 0)
    {
        this._totalGameTime = 0;

        this.setTimestep(timestep);
        this.setTargetFrameTime(frameTime);
        this.reset(initialTimestamp);
    }

    /**
     * Sets whether this timer uses a fixed or variable timestep.
     */
    setTimestep(timestep: Timestep)
    {
        const isFixed = (timestep === Timestep.FIXED);

        GameTimer._Logger.debug(`Setting timestep to Timestep.${isFixed ? "FIXED" : "VARIABLE"}`);

        this._isFixedTimestep = isFixed;
        this._isRunningSlow = isFixed && this._isRunningSlow;
    }

    /**
     * Sets how often `Game.onUpdate()` should fire in fixed timestep mode, in milliseconds.
     * Value must be `>= 0`.
     */
    setTargetFrameTime(frameTime: number)
    {
        const targetFrameTime = Math.max(frameTime, 0);

        GameTimer._Logger.debug(`Setting target frame time to ${targetFrameTime}`);

        this._targetFrameTime = targetFrameTime;
    }

    /**
     * Gets how often `Game.onUpdate()` will fire in fixed timestep mode, in milliseconds.
     */
    getTargetFrameTime()
    {
        return this._targetFrameTime;
    }

    /**
     * Gets the total time since the game was started, in milliseconds.
     */
    getTotalGameTime()
    {
        return this._totalGameTime;
    }

    /**
     * Gets whether the game is taking too long to update or render.
     * This will always return `false` when running on a variable timestep.
     */
    isRunningSlow(): boolean
    {
        return this._isRunningSlow;
    }

    /**
     * Sets this timer to a specified timestamp, and resets elapsed time.
     * Useful for preventing large amounts of "catch-up" when running on
     * a fixed timestep after long timing delays.
     */
    reset(timestamp: number)
    {
        GameTimer._Logger.debug("Resetting timer");

        this._lastTimestamp = timestamp;
        this._frameTimeAccumulator = 0;
        this._frameLag = 0;
        this._isRunningSlow = false;
    }

    /**
     * @internal
     */
    _tickGame(game: Game, timestamp: number)
    {
        const targetFrameTime = this._targetFrameTime;
        const accumulatedElapsed = this._frameTimeAccumulator + (timestamp - this._lastTimestamp);
        this._lastTimestamp = timestamp;

        // 100 milliseconds is the longest frame time allowed
        // Frame times within 1/4 of a millisecond of the target are clamped to the target
        const clampedElapsed = Clamp(accumulatedElapsed, 0, 100);
        const elapsed = Math.abs(clampedElapsed - targetFrameTime) >= 0.25
            ? clampedElapsed
            : targetFrameTime;
        
        if (this._isFixedTimestep)
        {
            let numUpdates = 0;
            let frameTimeBank = elapsed;
            const fixedDelta = targetFrameTime / 1000;

            while (frameTimeBank >= targetFrameTime)
            {
                numUpdates += 1;
                frameTimeBank -= targetFrameTime;
                this._totalGameTime += targetFrameTime;

                game.onUpdate(fixedDelta);
            }

            this._frameTimeAccumulator = frameTimeBank;

            this._calculateFrameLag(numUpdates);
        }
        else
        {
            this._frameTimeAccumulator = 0;
            this._totalGameTime += elapsed;
            
            game.onUpdate(elapsed / 1000);
        }

        game.onDraw(elapsed);
    }

    private _calculateFrameLag(numUpdates: number)
    {
        // https://github.com/FNA-XNA/FNA/blob/master/src/Game.cs#L458

        // TODO: Consider a "maxFrameLag". If a game lags for a long time
        // but then starts behaving, it could take awhile to not be "running slow"

        this._frameLag += Math.max(0, numUpdates - 1);

        if (numUpdates === 1 && this._frameLag > 0)
        {
            this._frameLag -= 1;
        }

        if (this._isRunningSlow && this._frameLag === 0)
        {
            this._isRunningSlow = false;
        }
        else if (this._frameLag > 5)
        {
            this._isRunningSlow = true;
        }
    }
}

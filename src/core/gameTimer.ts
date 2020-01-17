import { Game } from "./game.js";
import { Timestep } from "./timestep.js";
import { Clamp } from "../math/mathHelper.js";
import { Logger } from "../util/logger.js";

export class GameTimer
{
    private static readonly _Logger = new Logger("GameTimer");

    private _timestep!: Timestep;
    private _isRunningSlow!: boolean;
    private _totalGameTime: number;
    private _targetFrameTime!: number;
    private _targetDelta!: number;
    private _lastTimestamp!: number;
    private _frameTimeAccumulator!: number;
    private _frameLag!: number;

    public constructor(timestep = Timestep.VARIABLE, frameTime = 1000 / 60)
    {
        this._totalGameTime = 0;

        this.setTimestep(timestep);
        this.setTargetFrameTime(frameTime);
        this.reset(0);
    }

    /**
     * Sets whether this timer uses a fixed or variable timestep.
     */
    public setTimestep(timestep: Timestep)
    {
        const isFixed = (timestep === Timestep.FIXED);

        GameTimer._Logger.debug(`Setting timestep to Timestep.${isFixed ? "FIXED" : "VARIABLE"}`);

        this._timestep = timestep;
        this._isRunningSlow = isFixed && this._isRunningSlow;
    }

    /**
     * Gets the timestep used by this timer.
     */
    public getTimestep(): Timestep
    {
        return this._timestep;
    }

    /**
     * Sets how often `Game.onUpdate()` should fire in fixed timestep mode, in milliseconds.
     * Value must be `>= 0`.
     */
    public setTargetFrameTime(frameTime: number)
    {
        const targetFrameTime = Math.max(frameTime, 0);

        GameTimer._Logger.debug(`Setting target frame time to ${targetFrameTime}`);

        this._targetFrameTime = targetFrameTime;
        this._targetDelta = targetFrameTime / 1000;
    }

    /**
     * Gets how often `Game.onUpdate()` will fire in fixed timestep mode, in milliseconds.
     */
    public getTargetFrameTime(): number
    {
        return this._targetFrameTime;
    }

    /**
     * Gets the value passed to `Game.onUpdate()` in fixed timestep mode, represented in seconds.
     * For variable timestep mode, `Game.onUpdate()` will instead receive the time between the
     * previous and the current update call.
     */
    public getTargetDelta(): number
    {
        return this._targetDelta;
    }

    /**
     * Gets the total time since the game was started, in milliseconds.
     */
    public getTotalGameTime(): number
    {
        return this._totalGameTime;
    }

    /**
     * Gets whether the game is taking too long to update or render.
     * This will always return `false` when running on a variable timestep.
     */
    public isRunningSlow(): boolean
    {
        return this._isRunningSlow;
    }

    /**
     * Resets the elapsed time of this timer.
     * Useful for preventing large amounts of "catch-up" when running on
     * a fixed timestep after long timing delays.
     */
    public reset(timestamp = window.performance.now())
    {
        GameTimer._Logger.debug("Resetting timer");

        this._lastTimestamp = timestamp;
        this._frameTimeAccumulator = 0;
        this._frameLag = 0;
        this._isRunningSlow = false;
    }

    /**
     * Ticks the provided game forward to a specified timestamp.
     */
    public tickGame(game: Game, timestamp: number, suppressRender: false)
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

        if (this._timestep === Timestep.FIXED)
        {
            let numUpdates = 0;
            let frameTimeBank = elapsed;

            while (frameTimeBank >= targetFrameTime)
            {
                numUpdates += 1;
                frameTimeBank -= targetFrameTime;
                this._totalGameTime += targetFrameTime;

                game.onUpdate(this._targetDelta);
            }

            this._frameTimeAccumulator = frameTimeBank;

            this._updateFrameLag(numUpdates);
        }
        else
        {
            this._frameTimeAccumulator = 0;
            this._totalGameTime += elapsed;
            
            game.onUpdate(elapsed / 1000);
        }

        // TODO: Check if it's even possible to skip frames in WebGL.
        // The buffer swap behavior will basically decide that... 
        if (!suppressRender)
        {
            game.onDraw(elapsed / 1000);
        }
    }

    private _updateFrameLag(numUpdates: number)
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

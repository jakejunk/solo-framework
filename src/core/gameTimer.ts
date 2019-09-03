import { Clamp } from "../math/mathHelper";
import { Game } from "./game";
import { GameTime } from "./gameTime";
import { Logger } from "../util/logger";

export class GameTimer
{
    private static readonly _Logger = new Logger("GameTimer");

    isFixedTimestep: boolean;
    private readonly _gameTime: GameTime;
    private _targetFrameTime!: number;
    private _maxFrameTime!: number;
    private _lastTimestamp!: number;
    private _frameTimeAccumulator!: number;
    private _frameLag!: number;

    /** @internal */
    constructor(isFixed = false, fps = 60, minFps = 15)
    {
        this._gameTime = new GameTime();
        this.isFixedTimestep = isFixed;

        this.setFps(fps);
        this.setMinFps(minFps);
        this.reset();
    }

    /**
     * Sets the FPS of this timer.
     * Values are interpreted as integers, and cannot be less than `1`.
     */
    setFps(fps: number)
    {
        if (fps < 1)
        {
            fps = 1;
        }

        GameTimer._Logger.debug(`Setting FPS to ${fps}`);

        this._targetFrameTime = 1000 / (fps | 0);
    }

    getFps(): number
    {
        return Math.round(1000 / this._targetFrameTime);
    }

    /**
     * Sets the minimum FPS of this timer.
     * Values are interpreted as integers, and cannot be less than `1`.
     */
    setMinFps(minFps: number)
    {
        if (minFps < 1)
        {
            minFps = 1;
        }

        GameTimer._Logger.debug(`Setting minimum FPS to ${minFps}`);

        this._maxFrameTime = 1000 / (minFps | 0);
    }

    getMinFps(): number
    {
        return Math.round(1000 / this._maxFrameTime);
    }

    reset()
    {
        GameTimer._Logger.debug("Resetting timer");

        this._lastTimestamp = window.performance.now();
        this._frameTimeAccumulator = 0;
        this._frameLag = 0;
    }

    /**
     * @internal
     * TODO
     */
    _tickGame(game: Game, timestamp: number)
    {
        const gameTime = this._gameTime;
        const targetFrameTime = this._targetFrameTime;

        const accumulatedElapsed = this._frameTimeAccumulator + (this._lastTimestamp - timestamp);
        this._lastTimestamp = timestamp;

        const clampedElapsed = Clamp(accumulatedElapsed, 0, this._maxFrameTime);
        let elapsed = Math.abs(clampedElapsed - targetFrameTime) >= 5 // Magic number
            ? clampedElapsed
            : targetFrameTime;
        
        if (this.isFixedTimestep)
        {
            let numSteps = 0;
            gameTime.elapsedGameTime = targetFrameTime;

            while (elapsed >= targetFrameTime)
            {
                numSteps += 1;
                elapsed -= targetFrameTime;

                gameTime.totalElapsedGameTime += targetFrameTime;
                game.onUpdate(gameTime);
            }

            this._frameTimeAccumulator = elapsed;

            // Adapted from FNA:
            // https://github.com/FNA-XNA/FNA/blob/master/src/Game.cs#L458
            this._frameLag += Math.max(0, numSteps - 1);
            if (gameTime.isRunningSlow && this._frameLag === 0)
            {
                gameTime.isRunningSlow = false;
            }
            else if (this._frameLag > 5)
            {
                gameTime.isRunningSlow = true;
            }

            if (numSteps == 1 && this._frameLag > 0)
            {
                this._frameLag -= 1;
            }

            // TODO: In cases where no updates are performed, maybe elapsed would work better here?
            gameTime.elapsedGameTime = targetFrameTime * numSteps;
        }
        else
        {
            this._frameTimeAccumulator = 0;

            gameTime.elapsedGameTime = elapsed;
            gameTime.totalElapsedGameTime += elapsed;
            game.onUpdate(gameTime);
        }

        game.onDraw(gameTime);
    }
}

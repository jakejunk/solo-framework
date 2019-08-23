import { Clamp } from "../math/mathHelper";
import { Game } from "./game";
import { GameTime } from "./gameTime";

export class GameTimer
{
    isFixedTimestep: boolean;

    private readonly _gameTime: GameTime;
    private _targetFrameTime!: number;
    private _maxFrameTime!: number;
    private _lastTimestamp!: number;
    private _frameTimeAccumulator!: number;
    private _frameLag!: number;

    /** @internal */
    constructor(isFixed: boolean, fps: number, maxFrameTime = 500)
    {
        this._gameTime = new GameTime();
        this.isFixedTimestep = isFixed;
        this.setFps(fps);
        this.setMaxFrameTime(maxFrameTime);
        this.reset();
    }

    setFps(fps: number)
    {
        this._targetFrameTime = 1000 / fps;
    }

    getTargetFrameTime(): number
    {
        return this._targetFrameTime;
    }

    setMaxFrameTime(maxFrameTime: number)
    {
        this._maxFrameTime = maxFrameTime;
    }

    reset()
    {
        this._lastTimestamp = performance.now();
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

        const realElapsed = this._lastTimestamp - timestamp;
        this._lastTimestamp = timestamp;
        const clampedElapsed = Clamp(realElapsed, 0, this._maxFrameTime);
        
        const elapsed = Math.abs(clampedElapsed - targetFrameTime) >= 5 // Magic number
            ? clampedElapsed
            : targetFrameTime;
        
        if (this.isFixedTimestep)
        {
            const accumulated = elapsed + this._frameTimeAccumulator;
            const frames = accumulated / targetFrameTime;
            this._frameTimeAccumulator %= targetFrameTime;

            gameTime.elapsedGameTime = targetFrameTime;

            for (let i = 0; i < frames && !game.shouldExit; ++i)
            {
                gameTime.totalElapsedGameTime += targetFrameTime;

                game.onUpdate(gameTime);
            }

            // Adapted from FNA: https://github.com/FNA-XNA/FNA/blob/master/src/Game.cs#L458
            this._frameLag += Math.max(0, frames - 1);
            if (gameTime.isRunningSlow && this._frameLag === 0)
            {
                gameTime.isRunningSlow = false;
            }
            else if (this._frameLag > 5)
            {
                gameTime.isRunningSlow = true;
            }

            if (frames == 1 && this._frameLag > 0)
            {
                this._frameLag -= 1;
            }

            gameTime.elapsedGameTime = targetFrameTime * frames;
        }
        else
        {
            // TODO: Variable step
        }

        game.onDraw(gameTime);
    }
}
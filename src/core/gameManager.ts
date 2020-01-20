import { Game } from "./game";
import { GameCanvas } from "./gameCanvas";
import { GameComponents } from "./gameComponents";
import { GameParams } from "./gameParams";
import { Timestep } from "./timestep";
import { GameTimer } from "./gameTimer";
import { Logger } from "../util/logger";
import { Color } from "../graphics/color";
import { GraphicsContext } from "../graphics/graphicsContext";

type GameConstructor = { new(components: GameComponents): Game };
type TickFunc = (timestap: number) => void;

/**
 * Manages the life-cycle of a game.
 */
export class GameManager
{
    private static readonly _Logger = new Logger("Solo", Color.BELIZE_HOLE);

    private readonly _tickFunc: TickFunc;
    private readonly _game: Game;
    private readonly _timer: GameTimer;
    private readonly _components: GameComponents;
    private _isRunning: boolean;
    private _nextFrameHandle: number;

    private constructor(gameConstructor: GameConstructor, components: GameComponents)
    {
        this._tickFunc = this._tick.bind(this);
        this._timer = components.timer;
        this._components = components;
        this._isRunning = false;
        this._nextFrameHandle = -1;

        this._initEvents(components);

        this._game = new gameConstructor(components);
    }

    public static Create(gameConstructor: GameConstructor, params: GameParams): GameManager
    {
        const gameParams = GameParams.Complete(params);
        const gameCanvas = GameCanvas.Create(
            gameParams.canvasId, gameParams.defaultCanvasColor, gameParams.scalingAlgorithm);

        if (gameCanvas.parentElement == undefined)
        {
            gameParams.parentElement.appendChild(gameCanvas);
        }

        return new GameManager(gameConstructor, {
            canvas: gameCanvas,
            timer: this._CreateTimer(gameParams.updateRate, gameParams.timestep),
            graphicsContext: this._CreateGraphicsContext(
                gameCanvas, gameParams.bufferWidth, gameParams.bufferHeight, gameParams.backBufferAlpha)
        });
    }

    private static _CreateTimer(updateRate: number, timestep: Timestep): GameTimer
    {
        const desiredFrameTimeMillis = 1000 / updateRate;

        return new GameTimer(timestep, desiredFrameTimeMillis);
    }

    private static _CreateGraphicsContext(
        canvas: GameCanvas, bufferWidth: number, bufferHeight: number, backBufferAlpha: boolean): GraphicsContext
    {
        const graphicsContextResult = GraphicsContext.Create(canvas, bufferWidth, bufferHeight, backBufferAlpha);
        if (graphicsContextResult.isError())
        {
            throw graphicsContextResult.errorValue;
        }

        return graphicsContextResult.okValue;
    }

    private _initEvents(components: GameComponents)
    {
        //window.addEventListener("resize", )

        const canvas = components.canvas;
        canvas.addEventListener("focus", this.resume.bind(this));
        canvas.addEventListener("blur", this.pause.bind(this));
    }

    /**
     * Starts the game!
     * 
     * Calling this multiple times without calling `GameManager.stop()` is a no-op.
     */
    public start()
    {
        if (this._isRunning)
        {
            GameManager._Logger.warn("Game is already running");
            return;
        }

        GameManager._Logger.debug("Game.onLoad()");

        this._isRunning = true;

        this._game.onLoad()
            .then(() => this._tick(performance.now()));
    }

    /**
     * Stops this game's execution and cancels any pending frames.
     */
    public stop()
    {
        cancelAnimationFrame(this._nextFrameHandle);

        GameManager._Logger.debug("Game.onExit()");

        if (this._game.onExit != undefined)
        {
            this._game.onExit();
        }

        this._isRunning = false;
    }

    public resume()
    {
        GameManager._Logger.debug("Game.onResume()");

        if (this._game.onResume != undefined)
        {
            this._game.onResume();
        }

        this._isRunning = true;
        
        this._tick(performance.now());
    }

    public pause()
    {
        GameManager._Logger.debug("Game.onPause()");

        if (this._game.onPause != undefined)
        {
            this._game.onPause();
        }

        this._isRunning = false;
    }

    private _tick(timestamp: number)
    {
        this._nextFrameHandle = requestAnimationFrame(this._tickFunc);

        this._timer.tickGame(this._game, timestamp, false);

        // Handle input managers
    }
}

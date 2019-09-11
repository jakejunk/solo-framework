import { Game } from "./game";
import { GameParams } from "./gameParams";
import { GameCanvas } from "./gameCanvas";
import { Logger } from "../util/logger";
import { Color } from "../graphics/color";
import { GameComponents } from "./gameComponents";
import { GameTimer } from "./gameTimer";
import { GraphicsContext } from "../graphics/graphicsContext";

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
    private readonly _gameComponents: GameComponents;
    private _isRunning: boolean;
    private _nextFrameHandle: number;

    private constructor(game: Game, components: GameComponents)
    {
        this._tickFunc = this._tick.bind(this);

        this._game = game;
        this._timer = components.timer;
        this._gameComponents = components;
        this._isRunning = false;
        this._nextFrameHandle = -1;

        this._initEvents(components);
    }

    static Create(game: Game, params: GameParams): GameManager
    {
        const gameParams = GameParams.Complete(params);
        const gameCanvas = GameCanvas.Create(gameParams.canvasId, gameParams.defaultCanvasColor);

        if (gameCanvas.parentElement == undefined)
        {
            gameParams.parentElement.appendChild(gameCanvas);
        }

        const graphicsContext = GraphicsContext.Create(gameCanvas, gameParams.backBufferAlpha);
        if (typeof graphicsContext === "string")
        {
            throw new Error(graphicsContext);
        }

        const desiredFrameTimeMillis = 1000 / gameParams.updateRate;
        const gameTimer = new GameTimer(gameParams.timestep, desiredFrameTimeMillis, window.performance.now());

        return new GameManager(game, {
            canvas: gameCanvas,
            timer: gameTimer,
            graphicsContext: graphicsContext
        });
    }

    private _initEvents(components: GameComponents)
    {
        //window.addEventListener("resize", )

        const canvas = components.canvas;
        canvas.addEventListener("focus", this.resume.bind(this));
        canvas.addEventListener("blur", this.pause.bind(this));
    }

    start()
    {
        if (this._isRunning)
        {
            GameManager._Logger.warn("Game is already running");
            return;
        }

        GameManager._Logger.debug("Game.onLoad()");

        this._isRunning = true;

        this._game.onLoad(this._gameComponents)
            .then(() => this._tick(performance.now()));
    }

    stop()
    {
        cancelAnimationFrame(this._nextFrameHandle);

        GameManager._Logger.debug("Game.onExit()");

        if (this._game.onExit != undefined)
        {
            this._game.onExit();
        }

        this._isRunning = false;
    }

    resume()
    {
        GameManager._Logger.debug("Game.onResume()");

        if (this._game.onResume != undefined)
        {
            this._game.onResume();
        }

        this._isRunning = true;
        
        this._tick(performance.now());
    }

    pause()
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
        this._timer._tickGame(this._game, timestamp);

        // Handle input managers

        this._nextFrameHandle = requestAnimationFrame(this._tickFunc);
    }
}

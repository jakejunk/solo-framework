import { Game } from "./game";
import { GameComponents } from "./gameComponents";
import { GameParams } from "./gameParams";
import { GameTimer } from "./gameTimer";
import { Logger } from "../util/logger";
import { Color } from "../graphics/color";

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
        const components = GameComponents.Create(gameParams);

        return new GameManager(gameConstructor, components);
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
     */
    public start()
    {
        if (this._isRunning)
        {
            GameManager._Logger.warn("Game is already running");
            return;
        }

        GameManager._Logger.debug("Game.onLoad()");

        this._game.onLoad()
            .then(() => this.resume());
    }

    public resume()
    {
        // If a game starts up without focus, don't "resume" it again
        if (this._isRunning)
        {
            return;
        }

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
        this._stopRendering();

        GameManager._Logger.debug("Game.onPause()");

        if (this._game.onPause != undefined)
        {
            this._game.onPause();
        }
    }

    /**
     * Stops this game's execution and cancels any pending frames.
     */
    public stop()
    {
        this._stopRendering();

        GameManager._Logger.debug("Game.onExit()");

        if (this._game.onExit != undefined)
        {
            this._game.onExit();
        }
    }

    private _stopRendering()
    {
        cancelAnimationFrame(this._nextFrameHandle);
        this._isRunning = false;
    }

    private _tick(timestamp: number)
    {
        this._nextFrameHandle = requestAnimationFrame(this._tickFunc);

        this._timer.tickGame(this._game, timestamp);

        // Handle input managers
    }
}

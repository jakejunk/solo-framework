import { ContentParser } from "./contentParser";
import { Logger } from "../util/logger";
import { Result } from "../util/result";
import { Texture2D } from "../graphics/texture2d";
import { GraphicsContext } from "../graphics/graphicsContext";

/**
 * A `Promise`-based loader for game content.
 */
export class ContentLoader
{
    private static _Logger = new Logger("ContentLoader");

    private _rootDir: string;
    private _graphicsContext: GraphicsContext;

    private constructor(rootDir: string, graphicsContext: GraphicsContext)
    {
        this._rootDir = rootDir;
        this._graphicsContext = graphicsContext;
    }

    public static Create(graphicsContext: GraphicsContext, rootDir = ""): Result<ContentLoader, Error>
    {
        const hasFetch = "fetch" in window;

        if (!hasFetch)
        {
            const error = new Error("The Fetch API is not supported.");

            return Result.OfError(error);
        }

        return Result.OfOk(new ContentLoader(rootDir, graphicsContext));
    }

    /**
     * Sets the root directory for all subsequent load calls.
     * @example
     * loader.setRootDirectory("foo");
     * loader.loadTexture2D("bar.png"); // Loads "foo/bar.png"
     */
    public setRootDirectory(rootDir: string)
    {
        if (rootDir.charAt(rootDir.length - 1) !== '/')
        {
            rootDir += '/';
        }

        this._rootDir = rootDir;
    }
    
    public getRootDirectory(): string
    {
        return this._rootDir;
    }

    /**
     * Loads a remote resource processed by the provided `parser`.
     */
    public async tryLoad<T>(parser: ContentParser<T>, contentUri: string): Promise<Result<T, Error>>
    {
        try
        {
            const response = await this._makeRequest(contentUri);

            return parser.fromFetchResponse(response);
        }
        catch (error)
        {
            return Result.OfError(error as TypeError)
        }
    }

    /**
     * Loads a remote resource processed by the provided `parser`.
     * 
     * This load function will throw exceptions on both network and content-parsing errors.
     * For a non-throwing variant, see `ContentLoader.tryLoad()`.
     */
    public async load<T>(parser: ContentParser<T>, contentUri: string): Promise<T>
    {
        const response = await this._makeRequest(contentUri);
        const parseResult = await parser.fromFetchResponse(response);

        if (parseResult.isError())
        {
            throw parseResult.errorValue;
        }

        return parseResult.okValue;
    }

    private async _makeRequest(contentUri: string): Promise<Response>
    {
        const requestInit: RequestInit = {
            method: "GET",
        }

        const fullPath = this._getFullPath(contentUri);

        ContentLoader._Logger.debug(`Fetching file: ${fullPath}`)

        return await fetch(fullPath, requestInit);
    }

    private _getFullPath(contentUri: string): string
    {
        const isUriAbsolute = contentUri.charAt(0) === '/';
        const fullPath = isUriAbsolute
            ? contentUri
            : this._rootDir + contentUri;

        return fullPath;
    }

    // Some special-case loaders

    public async tryLoadTexture2D(contentUri: string): Promise<Result<Texture2D, Error>>
    {
        try
        {
            const texture = await this.loadTexture2D(contentUri);

            return Result.OfOk(texture);
        }
        catch (e)
        {
            return Result.OfError(e);
        }
    }

    public async loadTexture2D(contentUri: string): Promise<Texture2D>
    {
        // TODO: Check a texture cache
        
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
            const imageElement = new Image();

            imageElement.onload = () => resolve(imageElement);
            imageElement.onerror = () => reject();

            imageElement.src = this._getFullPath(contentUri);
        });
        
        return this._graphicsContext.textureManager.createTextureFromImage(image);
    }
}
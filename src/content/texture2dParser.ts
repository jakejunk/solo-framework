import { ContentParser } from "./contentParser";
import { Texture2D } from "../graphics/texture2d";
import { Result } from "../util/result";
import { GraphicsContext } from "../graphics/graphicsContext";

export class Texture2DParser implements ContentParser<Texture2D>
{
    private _context: GraphicsContext;

    public constructor(context: GraphicsContext)
    {
        this._context = context;
    }

    public async fromFetchResponse(response: Response): Promise<Result<Texture2D, Error>>
    {
        throw new Error("Method not implemented.");
    }
}
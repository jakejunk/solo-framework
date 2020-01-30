import { Texture2D } from "../texture2d";

export class TextureBindingCache
{
    private readonly _boundTextures: (Texture2D | undefined)[];
    private readonly _bindLocations: number;
    private _nextBindLocation: number;

    /**
     * Constructs a new cache for use in smart texture binding.
     * `bindLocations` must be >= 1.
     */
    public constructor(bindLocations: number)
    {
        if (bindLocations < 1)
        {
            throw new Error("'bindLocations' must be >= 1");
        }

        this._boundTextures = new Array(bindLocations);
        this._bindLocations = bindLocations;
        this._nextBindLocation = bindLocations - 1;
    }

    public getNumBindLocations(): number
    {
        return this._bindLocations;
    }
    
    public getBindLocation(texture: Texture2D): number | undefined
    {
        const boundIndex = this._boundTextures.indexOf(texture);

        if (boundIndex !== -1)
        {
            return boundIndex;
        }

        return undefined;
    }

    /**
     * Calculates and returns a new bind location for texture manager usage.
     */
    public bindAnywhere(texture: Texture2D): number
    {
        // Calculate the next suggested bind location:
        // _nextTextureBindLocation starts at `maxTextures - 1` at initialization.
        // This cycles `location` backwards from `maxTextures - 1` to `0`

        this._nextBindLocation += 1;
        this._nextBindLocation %= this._bindLocations;
        
        const location = this._bindLocations - this._nextBindLocation - 1;

        this._setBindingLocationAt(texture, location);

        return location;
    }

    /**
     * Tells this cache to mark a specific location as bound by the specified texture.
     * Returns `true` if the provided texture was already bound to this location.
     */
    public bindAtLocation(texture: Texture2D, location: number): boolean
    {
        if (location < 0 || location >= this._bindLocations)
        {
            throw new Error(`Location value ${location} is outside the bounds of [0, ${this._bindLocations})`);
        }

        const textureWasBound = (this._boundTextures[location] === texture);

        if (!textureWasBound)
        {
            this._setBindingLocationAt(texture, location);
        }

        return textureWasBound;
    }

    private _setBindingLocationAt(texture: Texture2D, location: number)
    {
        this._boundTextures[location] = texture;
    }

    /**
     * Marks a specific binding location in this cache as dirty.
     */
    public markDirty(location: number)
    {
        if (location < 0 || location >= this._bindLocations)
        {
            throw new Error(`Location value ${location} is outside the bounds of [0, ${this._bindLocations})`);
        }

        this._boundTextures[location] = undefined;
    }


    /**
     * Marks all binding locations in this cache as dirty, indicating that they need to be rebound.
     */
    public markAllDirty()
    {
        this._nextBindLocation = this._bindLocations - 1;
        
        for (let i = 0; i < this._bindLocations; i += 1)
        {
            this._boundTextures[i] = undefined;
        }
    }
}
import { Color } from "../graphics/color";

export class Logger
{
    readonly name: string;
    private _style: string;
    
    constructor(name: string, color?: Readonly<Color>)
    {
        this.name = name;

        if (color == undefined)
        {
            const hash = Logger._GenHashFromName(name);

            color = Color.FromInt(hash);
        }

        this._style = "background:" + color.toHexString() + ";";
    }

    private static _GenHashFromName(name: string): number
    {
        let hash = 0;
        for (let i = 0; i < name.length; i += 1)
        {
            const char = name.charCodeAt(i) || 0; // Catch NaNs
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }

        // Color should not be transparent
        hash |= 0x000000ff;

        return hash;
    }

    debug(message: string | object)
    {
        console.debug("%c ", this._style, `${this.name}: ${message}`);
    }

    log(message: string | object)
    {
        console.log("%c ", this._style, `${this.name}: ${message}`);
    }

    warn(message: string | object)
    {
        console.warn("%c ", this._style, `${this.name}: ${message}`);
    }

    error(message: string | object)
    {
        console.error("%c ", this._style, `${this.name}: ${message}`);
    }
}
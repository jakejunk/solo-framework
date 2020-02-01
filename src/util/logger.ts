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
            color = Logger._GenColorFromName(name);
        }

        this._style = "background:" + color.toHexString() + ";";
    }

    private static _GenColorFromName(name: string): Color
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

        return Color.FromInt(hash);
    }

    public debug(message: string | object)
    {
        console.debug("%c ", this._style, `${this.name}: ${message}`);
    }

    public log(message: string | object)
    {
        console.log("%c ", this._style, `${this.name}: ${message}`);
    }

    public warn(message: string | object)
    {
        console.warn("%c ", this._style, `${this.name}: ${message}`);
    }

    public error(message: string | object)
    {
        console.error("%c ", this._style, `${this.name}: ${message}`);
    }
}
import { Color } from "../graphics/color";

export class Logger
{
    public readonly debug: (message: string | object) => void;

    public readonly log: (message: string | object) => void;

    public readonly warn: (message: string | object) => void;

    public readonly error: (message: string | object) => void;

    public constructor(name: string, color?: Color)
    {
        if (color == undefined)
        {
            color = Logger._GenColorFromName(name);
        }

        const style = "background:" + color.toHexString() + ";";
        const prefix = `${name}:`;

        this.debug = window.console.debug.bind(window.console, "%c ", style, prefix);
        this.log = window.console.log.bind(window.console, "%c ", style, prefix);
        this.warn = window.console.warn.bind(window.console, "%c ", style, prefix);
        this.error = window.console.error.bind(window.console, "%c ", style, prefix);
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
}
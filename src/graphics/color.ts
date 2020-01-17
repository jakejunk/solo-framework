/**
 * Represents an RGBA color packed into a 32-bit value.
 */
export class Color
{
    private static _shortFormRegex = /^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
    private static _longFormRegex = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;

    private _packedColor: number;

    constructor(packedColor = 0x000000ff)
    {
        this._packedColor = packedColor;
    }

    static Clone(other: Color): Color
    {
        return new Color(other._packedColor);
    }

    /**
     * Returns either `Color.Black` or `Color.White`, depending on the primary color's intensity.
     * Use `CreateContrastingColorW3C()` for a W3C-compliant version.
     */
    static CreateContrastingColor(primary: Color): Color
    {
        // https://stackoverflow.com/q/3942878

        const luminance = primary.getR() * 0.299 + primary.getG() * 0.587 + primary.getB() * 0.114;
        if (luminance > 186)
        {
            return Color.Clone(Color.BLACK as Color);
        }
        
        return Color.Clone(Color.WHITE as Color);
    }

    /**
     * Returns either `Color.Black` or `Color.White`, depending on the primary color's intensity.
     */
    static CreateContrastingColorW3C(primary: Color): Color
    {
        // https://stackoverflow.com/q/3942878

        const r = primary.getR() / 255;
        const g = primary.getG() / 255;
        const b = primary.getB() / 255;
        const rc = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055 ) / 1.055, 2.4);
        const gc = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055 ) / 1.055, 2.4);
        const bc = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055 ) / 1.055, 2.4);

        const luminance = 0.2126 * rc + 0.7152 * gc + 0.0722 * bc;
        if (luminance > 0.179)
        {
            return Color.Clone(Color.BLACK as Color);
        }
        
        return Color.Clone(Color.WHITE as Color);
    }

    /**
     * Creates a new `Color` from a packed 32-bit integer.
     */
    static FromPackedColor(packedColor: number): Color
    {
        return new Color(packedColor);
    }

    /**
     * Creates a new `Color` from its components, each within the range [0, 255].
     */
    static FromComponents(r: number, g: number, b: number, a: number): Color
    {
        let packedColor = (a << 24) | (b << 16) | (g << 8) | r;

        return new Color(packedColor);
    }

    /**
     * Creates a new `Color` from a hexadecimal string.
     * `Color.BLACK` will be returned for any unrecognized hex string.
     */
    static FromHexString(hexString: string): Color
    {
        hexString = hexString.replace(Color._shortFormRegex, (_, r: string, g: string, b: string, a?: string) => {
            const alpha = (a != undefined) ? a + a : "";
            return r + r + g + g + b + b + alpha;
        });

        const captureArray = Color._longFormRegex.exec(hexString);
        if (captureArray == undefined)
        {
            return new Color();
        }
        
        const radix = 16;
        const r = parseInt(captureArray[1], radix) / 255;
        const g = parseInt(captureArray[2], radix) / 255;
        const b = parseInt(captureArray[3], radix) / 255;
        const a = (captureArray[4] != undefined)
            ? parseInt(captureArray[4], radix) / 255
            : 1;

        return Color.FromComponents(r, g, b, a);
    }

    /**
     * Gets the red component as a value in the range [0, 255].
     */
    getR()
    {
        return 0xff & (this._packedColor >>> 24);
    }

    /**
     * Gets the green component as a value in the range [0, 255].
     */
    getG()
    {
        return 0xff & (this._packedColor >>> 16);
    }

    /**
     * Gets the blue component as a value in the range [0, 255].
     */
    getB()
    {
        return 0xff & (this._packedColor >>> 8);
    }

    /**
     * Gets the alpha component as a value in the range [0, 255].
     */
    getA()
    {
        return 0xff & this._packedColor;
    }

    set(other: Color)
    {
        this._packedColor = other._packedColor;
    }

    /**
     * Returns a string representing this color in `#rrggbbaa` format.
     */
    toHexString(): string
    {
        // The zero-fill right shift operation results in an unsigned 32-bit integer.
        const unsignedPackedValue = this._packedColor >>> 0;

        return "#" + unsignedPackedValue.toString(16);
    }

    equals(other: Color): boolean
    {
        return this._packedColor === other._packedColor;
    }
}

export namespace Color
{
    // https://flatuicolors.com/palette/defo

    /** #000000 */
    export const BLACK = new Color();

    /** #ffffff */
    export const WHITE = Color.FromPackedColor(0xffffffff);

    /** #1abc9c */
    export const TURQUOISE = Color.FromPackedColor(0x1abc9cff);

    /** #16a085 */
    export const GREEN_SEA = Color.FromPackedColor(0x16a085ff);

    /** #2ecc71 */
    export const EMERALD = Color.FromPackedColor(0x2ecc71ff);

    /** #27ae60 */
    export const NEPHRITIS = Color.FromPackedColor(0x27ae60ff);

    /** #3498db */
    export const PETER_RIVER = Color.FromPackedColor(0x3498dbff);

    /** #2980b9 */
    export const BELIZE_HOLE = Color.FromPackedColor(0x2980b9ff);

    /** #6495ed (XNA!) */
    export const CORNFLOWER_BLUE = Color.FromPackedColor(0x6495edff);

    /** #9b59b6 */
    export const AMETHYST = Color.FromPackedColor(0x9b59b6ff);
    
    /** #8e44ad */
    export const WISTERIA = Color.FromPackedColor(0x8e44adff);

    /** #34495e */
    export const WET_ASPHALT = Color.FromPackedColor(0x34495eff);

    /** #2c3e50 */
    export const MIDNIGHT_BLUE = Color.FromPackedColor(0x2c3e50ff);

    /** #f1c40f */
    export const SUNFLOWER = Color.FromPackedColor(0xf1c40fff);

    /** #f39c12 */
    export const ORANGE = Color.FromPackedColor(0xf39c12ff);

    /** #e67e22 */
    export const CARROT = Color.FromPackedColor(0xe67e22ff);

    /** #d35400 */
    export const PUMPKIN = Color.FromPackedColor(0xd35400ff);

    /** #e74c3c */
    export const ALIZARIN = Color.FromPackedColor(0xe74c3cff);

    /** #c0392b */
    export const POMEGRANATE = Color.FromPackedColor(0xc0392bff);

    /** #ecf0f1 */
    export const CLOUDS = Color.FromPackedColor(0xecf0f1ff);

    /** #bdc3c7 */
    export const SILVER = Color.FromPackedColor(0xbdc3c7ff);

    /** #95a5a6 */
    export const CONCRETE = Color.FromPackedColor(0x95a5a6ff);

    /** #7f8c8d */
    export const ASBESTOS = Color.FromPackedColor(0x7f8c8dff);
}

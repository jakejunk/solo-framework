import { Clamp } from "../math/mathHelper.js";

/**
 * Represents an RGBA color defined by four floating-point components,
 * each of which should have a value within the range `[0, 1]`.
 */
export class Color
{
    private static _shortFormRegex = /^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
    private static _longFormRegex = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;

    // Moving from numbers to ranges here would be nice:
    // https://github.com/Microsoft/TypeScript/issues/15480

    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r = 0, g = 0, b = 0, a = 1)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static Clone(other: Readonly<Color>): Color
    {
        return new Color(other.r, other.g, other.b, other.a);
    }

    /**
     * Returns either `Color.Black` or `Color.White`, depending on the primary color's intensity.
     * Use `CreateContrastingColorW3C()` for a W3C-compliant version.
     */
    static CreateContrastingColor(primary: Readonly<Color>): Color
    {
        // https://stackoverflow.com/q/3942878

        const luminance = primary.r * 76.245 + primary.g * 149.685 + primary.b * 29.070;
        if (luminance > 186)
        {
            return Color.Clone(Color.BLACK);
        }
        
        return Color.Clone(Color.WHITE);
    }

    /**
     * Returns either `Color.Black` or `Color.White`, depending on the primary color's intensity.
     */
    static CreateContrastingColorW3C(primary: Readonly<Color>): Color
    {
        // https://stackoverflow.com/q/3942878

        const r = primary.r;
        const g = primary.g;
        const b = primary.b;
        const rc = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055 ) / 1.055, 2.4);
        const gc = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055 ) / 1.055, 2.4);
        const bc = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055 ) / 1.055, 2.4);

        const luminance = 0.2126 * rc + 0.7152 * gc + 0.0722 * bc;
        if (luminance > 0.179)
        {
            return Color.Clone(Color.BLACK);
        }
        
        return Color.Clone(Color.WHITE);
    }

    /**
     * Creates a new `Color` from an RGBA-formatted 32-bit integer.
     */
    static FromRgba8888(rgba8888: number): Color
    {
        const r = ((rgba8888 & 0xff000000) >>> 24) / 255;
        const g = ((rgba8888 & 0x00ff0000) >>> 16) / 255;
        const b = ((rgba8888 & 0x0000ff00) >>> 8) / 255;
        const a = ((rgba8888 & 0x000000ff)) / 255;

        return new Color(r, g, b, a);
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

        return new Color(r, g, b, a);
    }

    set(other: Readonly<Color>)
    {
        this.r = other.r;
        this.g = other.g;
        this.b = other.b;
        this.a = other.a;
    }

    /**
     * Returns a string representing this color in `#rrggbbaa` format.
     */
    toHexString(): string
    {
        const r = Clamp(this.r * 255 | 0, 0, 255);
        const g = Clamp(this.g * 255 | 0, 0, 255);
        const b = Clamp(this.b * 255 | 0, 0, 255);
        const a = Clamp(this.a * 255 | 0, 0, 255);

        // The zero-fill right shift operation results in an unsigned 32-bit integer.
        const unsignedIntValue = ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;

        return "#" + unsignedIntValue.toString(16);
    }

    equals(other: Readonly<Color>): boolean
    {
        return this.a === other.a
            && this.r === other.r
            && this.g === other.g
            && this.b === other.b;
    }
}

export namespace Color
{
    // https://flatuicolors.com/palette/defo

    /** #000000 */
    export const BLACK: Readonly<Color> = new Color();

    /** #ffffff */
    export const WHITE: Readonly<Color> = Color.FromRgba8888(0xffffffff);

    /** #1abc9c */
    export const TURQUOISE: Readonly<Color> = Color.FromRgba8888(0x1abc9cff);

    /** #16a085 */
    export const GREEN_SEA: Readonly<Color> = Color.FromRgba8888(0x16a085ff);

    /** #2ecc71 */
    export const EMERALD: Readonly<Color> = Color.FromRgba8888(0x2ecc71ff);

    /** #27ae60 */
    export const NEPHRITIS: Readonly<Color> = Color.FromRgba8888(0x27ae60ff);

    /** #3498db */
    export const PETER_RIVER: Readonly<Color> = Color.FromRgba8888(0x3498dbff);

    /** #2980b9 */
    export const BELIZE_HOLE: Readonly<Color> = Color.FromRgba8888(0x2980b9ff);

    /** #6495ed (XNA!) */
    export const CORNFLOWER_BLUE: Readonly<Color> = Color.FromRgba8888(0x6495edff);

    /** #9b59b6 */
    export const AMETHYST: Readonly<Color> = Color.FromRgba8888(0x9b59b6ff);
    
    /** #8e44ad */
    export const WISTERIA: Readonly<Color> = Color.FromRgba8888(0x8e44adff);

    /** #34495e */
    export const WET_ASPHALT: Readonly<Color> = Color.FromRgba8888(0x34495eff);

    /** #2c3e50 */
    export const MIDNIGHT_BLUE: Readonly<Color> = Color.FromRgba8888(0x2c3e50ff);

    /** #f1c40f */
    export const SUNFLOWER: Readonly<Color> = Color.FromRgba8888(0xf1c40fff);

    /** #f39c12 */
    export const ORANGE: Readonly<Color> = Color.FromRgba8888(0xf39c12ff);

    /** #e67e22 */
    export const CARROT: Readonly<Color> = Color.FromRgba8888(0xe67e22ff);

    /** #d35400 */
    export const PUMPKIN: Readonly<Color> = Color.FromRgba8888(0xd35400ff);

    /** #e74c3c */
    export const ALIZARIN: Readonly<Color> = Color.FromRgba8888(0xe74c3cff);

    /** #c0392b */
    export const POMEGRANATE: Readonly<Color> = Color.FromRgba8888(0xc0392bff);

    /** #ecf0f1 */
    export const CLOUDS: Readonly<Color> = Color.FromRgba8888(0xecf0f1ff);

    /** #bdc3c7 */
    export const SILVER: Readonly<Color> = Color.FromRgba8888(0xbdc3c7ff);

    /** #95a5a6 */
    export const CONCRETE: Readonly<Color> = Color.FromRgba8888(0x95a5a6ff);

    /** #7f8c8d */
    export const ASBESTOS: Readonly<Color> = Color.FromRgba8888(0x7f8c8dff);
}

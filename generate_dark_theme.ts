import * as fs from "fs";
import * as path from "path";

const theme = JSON.parse(fs.readFileSync(path.join(__dirname, "themes", "cybercore-color-theme.json")).toString());

const color_scale_factor = 0.85;

/**
 * @param hex_code like: FFFFFF
 */
function darken_hex_color(hex_code: string, factor: number): string {
    const r = Math.round(parseInt(hex_code.slice(0, 2), 16) * factor);
    const g = Math.round(parseInt(hex_code.slice(2, 4), 16) * factor);
    const b = Math.round(parseInt(hex_code.slice(4, 6), 16) * factor);

    let nr = r.toString(16);
    if (nr == "0") nr = "00";
    let ng = g.toString(16);
    if (ng == "0") ng = "00";
    let nb = b.toString(16);
    if (nb == "0") nb = "00";

    return `${nr}${ng}${nb}`;
}

function invert_color(hex_code: string): string {
    const value = parseInt(hex_code.slice(0, 2), 16);
    const value_inverted = 255 - value;
    let inverted_string = value_inverted.toString(16);
    if (inverted_string == "0")
        inverted_string = "00";

    return `${inverted_string}${inverted_string}${inverted_string}`;
}

for (const key of Object.keys(theme.colors)) {
    let vv = theme.colors[key] as string;
    const hex_code = vv.slice(1, 7);
    const split_result = hex_code.split(hex_code.slice(0, 2)).join("");

    // single color gray scale
    if (split_result == "") {
        theme.colors[key] = vv.replace(hex_code, invert_color(hex_code));
        continue;
    } else {
        theme.colors[key] = vv.replace(hex_code, darken_hex_color(hex_code, color_scale_factor));
        continue;
    }
}

for (const object of theme.tokenColors) {
    const hex_code = object.settings.foreground.slice(1, 7);
    const split_result = hex_code.split(hex_code.slice(0, 2)).join("");

    // single color gray scale
    if (split_result == "") {
        object.settings.foreground = object.settings.foreground.replace(hex_code, invert_color(hex_code));
    } else {
        object.settings.foreground = object.settings.foreground.replace(hex_code, darken_hex_color(hex_code, color_scale_factor));
    }
}

fs.writeFileSync(path.join(__dirname, "themes", "cybercore-dark-color-theme.json"), JSON.stringify(theme, null, 4));
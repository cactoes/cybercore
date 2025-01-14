import * as fs from "fs";
import * as path from "path";

function invert_color(hex_code: string): string {
    const value = parseInt(hex_code.slice(0, 2), 16);
    const value_inverted = 255 - value;
    let inverted_string = value_inverted.toString(16);
    if (inverted_string == "0")
        inverted_string = "00";

    return `${inverted_string}${inverted_string}${inverted_string}`;
}

function generate_white_theme(in_file: string, out_file: string): void {
    const theme = JSON.parse(fs.readFileSync(path.join(__dirname, "themes", in_file)).toString());

    for (const key of Object.keys(theme.colors)) {
        let vv = theme.colors[key] as string;
        const hex_code = vv.slice(1, 7);
        const split_result = hex_code.split(hex_code.slice(0, 2)).join("");
    
        // single color gray scale
        if (split_result == "") {
            theme.colors[key] = vv.replace(hex_code, invert_color(hex_code));
            continue;
        } else {
            theme.colors[key] = vv.replace(hex_code, invert_color(hex_code));
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
            object.settings.foreground = object.settings.foreground.replace(hex_code, invert_color(hex_code));
        }
    }
    
    fs.writeFileSync(path.join(__dirname, "themes", out_file), JSON.stringify(theme, null, 4));
}

generate_white_theme("cybercore-black-color-theme.json", "cybercore-white-color-theme.json");
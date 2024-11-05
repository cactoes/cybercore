import * as fs from "fs";
import * as path from "path";

function hex_to_rgb(hex: string) {
    let num = parseInt(hex, 16);
    let r: number, g: number, b: number, a: number;

    r = (num >> 16) & 255;
    g = (num >> 8) & 255;
    b = num & 255;

    return [ r, g, b ];
}

function rgb_to_hex(r: number, g: number, b: number) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function blend_colors(grey_hex: string, color_hex: string, blend_factor) {
    const grey_rgb = hex_to_rgb(grey_hex);
    const color_rgb = hex_to_rgb(color_hex);

    const r = Math.round((1 - blend_factor) * grey_rgb[0] + blend_factor * color_rgb[0]);
    const g = Math.round((1 - blend_factor) * grey_rgb[1] + blend_factor * color_rgb[1]);
    const b = Math.round((1 - blend_factor) * grey_rgb[2] + blend_factor * color_rgb[2]);

    return rgb_to_hex(r, g, b);
}

function generate_dark_theme_for(in_file: string, out_file: string, color_theme_code: string, blend_factor: number): void {
    const theme = JSON.parse(fs.readFileSync(path.join(__dirname, "themes", in_file)).toString());

    for (const key of Object.keys(theme.colors)) {
        let vv = theme.colors[key] as string;
        const hex_code = vv.slice(1, 7);
        const split_result = hex_code.split(hex_code.slice(0, 2)).join("");
    
        // single color gray scale
        if (split_result == "") {
            theme.colors[key] = vv.replace(hex_code, blend_colors(hex_code, color_theme_code, blend_factor));
            continue;
        }
    }
    
    for (const object of theme.tokenColors) {
        const hex_code = object.settings.foreground.slice(1, 7);
        const split_result = hex_code.split(hex_code.slice(0, 2)).join("");
    
        // single color gray scale
        if (split_result == "") {
            object.settings.foreground = object.settings.foreground.replace(hex_code, blend_colors(hex_code, color_theme_code, blend_factor));
        }
    }
    
    fs.writeFileSync(path.join(__dirname, "themes", out_file), JSON.stringify(theme, null, 4));
}

generate_dark_theme_for("cybercore-color-theme.json", "cybercore-tinted-color-theme.json", "8ba2c0", 0.4);
generate_dark_theme_for("cybercore-dark-color-theme.json", "cybercore-tinted-dark-color-theme.json", "768aa3", 0.3);

generate_dark_theme_for("cybercore-gold-color-theme.json", "cybercore-tinted-gold-color-theme.json", "d6b997", 0.4);
generate_dark_theme_for("cybercore-gold-dark-color-theme.json", "cybercore-tinted-gold-dark-color-theme.json", "b69d80", 0.3);

generate_dark_theme_for("cybercore-purple-color-theme.json", "cybercore-tinted-purple-color-theme.json", "958bc0", 0.4);
generate_dark_theme_for("cybercore-purple-dark-color-theme.json", "cybercore-tinted-purple-dark-color-theme.json", "7f76a3", 0.3);
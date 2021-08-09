import tinycolor from 'tinycolor2';

export function isDark(colorPallete) {
    return tinycolor(colorPallete).isDark();
}

export function updateColorOfInput(input, newColor) {
    $(input).spectrum('set', newColor);
}
const rgbToHex = (rgb: number[]) => '#' + rgb.map(c => c
    .toString(16)
    .padStart(2, '0'))
    .join('');

export const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const hexColor = rgbToHex([r, g, b]);

    return hexColor;
};
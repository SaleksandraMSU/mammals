export const hexToRgb = (hex: string) => {
    hex = hex.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
};

export const getInterimColor = (color1: number[], color2: number[], opacity?: number) => {
    const [r1, g1, b1] = color1;
    const [r2, g2, b2] = color2;

    const rMid = Math.round((r1 + r2) / 2);
    const gMid = Math.round((g1 + g2) / 2);
    const bMid = Math.round((b1 + b2) / 2);

    return [rMid, gMid, bMid, opacity];
};

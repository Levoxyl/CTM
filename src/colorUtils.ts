function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

 // Calculates WCAG relative luminance of a color
export function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb){return 0;}
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

 //Ensures Git decoration text remains beautifully legible against any canvas background
export function getAdaptiveGitColor(canvasBg: string, type: 'addition' | 'deletion'): string {
    const isDarkBackground = getLuminance(canvasBg) < 0.5;

    if (type === 'addition') {
        return isDarkBackground ? '#4af626' : '#166534';
    } else {
        return isDarkBackground ? '#ff5353' : '#991b1b';
    }
}
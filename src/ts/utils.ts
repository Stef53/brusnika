import {IRectSize} from "./interfaces.ts";

const getGrid = (rows: number, columns: number, size: IRectSize, gap: number) => {
    const cards = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const x = col * (size.width + gap);
            const y = row * (size.height + gap);
            cards.push({key: row - col, x, y});
        }
    }
    return cards
};


const getCentredPosX = (x, width, childWidth, childGap, columns) =>
    (width - ((columns - 1) * childGap + columns * childWidth)) / 2 + x;

const getCentredPosY = (y, height, childHeight, childGap, rows) =>
    (height - ((rows - 1) * childGap + rows * childHeight)) / 2 + y;


const getRelativeSize = (parentSize: IRectSize, part: number): IRectSize =>
    ({
        width: parentSize.width * part,
        height: parentSize.height * part
    });

export {
    getGrid,
    getRelativeSize,
    getCentredPosX,
    getCentredPosY
}


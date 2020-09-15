export class SplitColor {

    backgroundColor: string;
    textColor: string;

    constructor() {

    }

    updateValues(splitColor: SplitColor): void {
        this.backgroundColor = splitColor.backgroundColor;
        this.textColor = splitColor.textColor;
    }

}
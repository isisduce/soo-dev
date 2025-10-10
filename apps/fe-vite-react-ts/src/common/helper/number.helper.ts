export const NumberHelper = {
    // ====================================================================================================

    addCommaThousand: (money: string | number | undefined) => {
        if (money === undefined || money === null) return '';
        const num = typeof money === 'string'
            ? Number(money.replace(/,/g, ''))
            : money;
        if (isNaN(num)) return '';
        return num.toLocaleString();
    },

    removeCommaThousand: (money: string | number | undefined) => {
        if (money === undefined || money === null) return '';
        if (typeof money === 'string') {
            return money.replace(/,/g, '');
        }
        return money.toString().replace(/,/g, '');
    },

    // ====================================================================================================

    getProperMoneyKR: (size: string | number | undefined, moneyUnit: number = 10000): string => {
        const units = ['천', '만', '억', '조'];
        let number = Number(size);
        if (isNaN(number) || number < 0) return '';
        for (let i = 0; i < units.length; i++) {
            if (number < moneyUnit) {
                return `${number.toFixed(2)} ${units[i]}`;
            }
            number /= moneyUnit;
        }
        return number.toFixed(2);
    },

    getProperMoneyUS: (size: string | number | undefined, moneyUnit: number = 1000): string => {
        const units = ['T', 'M', 'B', 'Tn'];
        let number = Number(size);
        if (isNaN(number) || number < 0) return '';
        for (let i = 0; i < units.length; i++) {
            if (number < moneyUnit) {
                return `${number.toFixed(2)} ${units[i]}`;
            }
            number /= moneyUnit;
        }
        return number.toFixed(2);
    },

    // ====================================================================================================

    getProperSizeFromString: (size: string | undefined | null): string => {
        if (size === undefined || size === null) return '';
        const numSize = parseFloat(size);
        if (isNaN(numSize) || numSize < 0) return '';
        return NumberHelper.getProperSizeFromNumber(numSize);
    },

    getProperSizeFromNumber: (size: number | undefined | null): string => {
        if (size === undefined || size === null || isNaN(size) || size < 0) return '';
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let newSize = size;
        let unitIndex = 0;
        while (newSize >= 1024 && unitIndex < units.length - 1) {
            newSize /= 1024;
            unitIndex++;
        }
        return unitIndex === 0
            ? `${newSize} ${units[unitIndex]}`
            : `${newSize.toFixed(2)} ${units[unitIndex]}`;
    },

    // ====================================================================================================
};

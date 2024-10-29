const generateCombinations = (items: number[], length: number): string[][] => {
    const combinations: string[][] = [];

    // Convert numbers to prefixed item strings
    const mappedItems = items.map((item, index) => {
        const prefix = String.fromCharCode(65 + index); // Generate 'A', 'B', 'C', etc.
        return `${prefix}${item}`;
    });

    function backtrack(start: number, currentCombination: string[]): void {
        if (currentCombination.length === length) {
            combinations.push([...currentCombination]);
            return;
        }

        for (let i = start; i < mappedItems.length; i++) {
            const currentItem = mappedItems[i];

            // Skip items with the same prefix as any in the current combination
            if (currentCombination.some(item => item[0] === currentItem[0])) continue;

            currentCombination.push(currentItem);
            backtrack(i + 1, currentCombination);

            currentCombination.pop();
        }
    }

    backtrack(0, []);
    return combinations;
}

export {
    generateCombinations
}
export async function mapWithConcurrency<T, R>(
    values: T[],
    concurrency: number,
    mapper: (value: T, index: number) => Promise<R>,
): Promise<R[]> {
    const results: R[] = new Array(values.length);
    let nextIndex = 0;

    const worker = async () => {
        while (nextIndex < values.length) {
            const currentIndex = nextIndex;
            nextIndex += 1;
            results[currentIndex] = await mapper(values[currentIndex], currentIndex);
        }
    };

    const workerCount = Math.max(1, Math.min(concurrency, values.length));
    await Promise.all(Array.from({ length: workerCount }, () => worker()));
    return results;
}

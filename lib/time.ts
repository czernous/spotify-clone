export const msToMins = (ms: number) => {
    const mins = Math.floor(ms / 60000)
    const seconds: any = ((ms % 60000) / 1000).toFixed(0)
    return seconds == 0
        ? mins + 1 + ':00'
        : mins + ':' + (seconds < 10 ? '0' : '') + seconds
}

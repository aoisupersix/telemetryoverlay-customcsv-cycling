export const splitFileNameExtension = (
    fileName: string,
): { name: string; extension: string } => {
    const lastDotIndex = fileName.lastIndexOf('.')

    if (lastDotIndex !== -1) {
        const name = fileName.slice(0, lastDotIndex)
        const extension = fileName.slice(lastDotIndex + 1)
        return { name, extension }
    } else {
        return { name: fileName, extension: '' }
    }
}

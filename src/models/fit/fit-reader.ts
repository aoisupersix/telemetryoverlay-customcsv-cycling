import { Buffer } from 'buffer'

import { ListedFit } from './listed-fit'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const FitParser = require('fit-file-parser/dist/fit-parser.js').default

export const readFitFile = async (blob: Blob): Promise<ListedFit> => {
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const parser = new FitParser({
        force: true,
        speedUnit: 'km/h',
        lengthUnit: 'm',
        temperatureUnit: 'celsius',
        elapsedRecordField: false,
        mode: 'list',
    })

    return new Promise<ListedFit>((resolve, reject) => {
        parser.parse(buffer, (error: string | null, fitContent: ListedFit) => {
            if (error !== null) {
                reject(error)
            }

            resolve(fitContent)
        })
    })
}

import React from 'react'

import { Parser } from '@json2csv/plainjs'
import { CssBaseline, Grid, createTheme } from '@mui/material'
import styled, { ThemeProvider } from 'styled-components'

import { AppBar } from './components/app-bar'
import { Spacer } from './components/spacer'
import { FitUploadForm } from './features/fit-upload-form/fit-upload-form'
import { ListedFit } from './models/fit/listed-fit'
import { convertToTelemetryCsv } from './models/telemetry-csv/fit-csv-converter'
import { TelemetryCsv } from './models/telemetry-csv/telemetry-csv'
import { splitFileNameExtension } from './utils/split-filename-extension'

const theme = createTheme({
    typography: {
        fontFamily: [
            'Roboto',
            '"Noto Sans JP"',
            '"Helvetica"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
})

const MarginedBody = styled.div`
    margin: 8px;
`

const App = () => {
    const [_np, setTelemetryCsv] = React.useState<TelemetryCsv | undefined>()

    const onUpload = (fit: ListedFit, weight: number, file: File) => {
        const [csvObject, fields] = convertToTelemetryCsv(fit, weight)
        setTelemetryCsv(csvObject)
        const csvParser = new Parser({ fields: fields })
        const csv = csvParser.parse(csvObject)
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const fileName = splitFileNameExtension(file.name).name

        const downloadAnchor = document.createElement('a')
        downloadAnchor.href = url
        downloadAnchor.download = `${fileName}_ForTelemetryOverlay.csv`
        downloadAnchor.click()

        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="app">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar />
                <MarginedBody>
                    <Grid
                        container
                        spacing={3}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid item xs={12}>
                            <FitUploadForm onUpload={onUpload} />
                        </Grid>
                    </Grid>

                    <Spacer size={50} axis="vertical" />
                </MarginedBody>
            </ThemeProvider>
        </div>
    )
}

export default App

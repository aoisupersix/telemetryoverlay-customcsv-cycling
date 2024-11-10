import React from 'react'

import UploadFileIcon from '@mui/icons-material/UploadFile'
import {
    Stack,
    Button,
    Alert,
    Card,
    CardHeader,
    CardContent,
    Container,
    TextField,
} from '@mui/material'

import { FileUploader } from '../../components/file-uploader'
import { IconicTypography } from '../../components/iconic-typography'
import { readFitFile } from '../../models/fit/fit-reader'
import { ListedFit } from '../../models/fit/listed-fit'

interface FitUploadFormProps {
    onUpload?: (fit: ListedFit, ftp: number, weight: number, file: File) => void
}

export const FitUploadForm: React.FC<FitUploadFormProps> = (props) => {
    const [errors, setErrors] = React.useState<string[]>([])
    const [file, setFile] = React.useState<File | undefined>()
    const [fit, setFit] = React.useState<ListedFit | undefined>()
    const [ftp, setFtp] = React.useState<number | undefined>()
    const [weight, setWeight] = React.useState<number | undefined>()

    const onUploadFitFile = (f: File) => {
        setFile(f)
        readFitFile(f)
            .then((listedFit) => {
                setFit(listedFit)

                if (
                    listedFit.user_profile?.weight !== undefined &&
                    listedFit.user_profile.weight_setting === 'metric'
                ) {
                    setWeight(listedFit.user_profile.weight)
                }
                if (
                    listedFit.zones_target.functional_threshold_power !==
                    undefined
                ) {
                    setFtp(listedFit.zones_target.functional_threshold_power)
                }
            })
            .catch((err) => {
                const errs = [...errors, err]
                setErrors(errs)
            })
    }

    const onCloseErrorAlert = (err: string) => {
        const errs = errors.filter((e) => e !== err)
        setErrors(errs)
    }

    const onUpload = () => {
        const errs: string[] = []
        if (fit === undefined) {
            errs.push('Upload your FIT file.')
        }
        if (weight === undefined) {
            errs.push('Enter your weight.')
        }
        if (weight <= 0) {
            errs.push('The weight value is incorrect.')
        }

        setErrors(errs)
        if (errs.length === 0) {
            props.onUpload(fit, ftp, weight, file)
        }
    }

    const errorAlerts = errors.map((err) => (
        <Alert
            key={err}
            variant="filled"
            severity="error"
            onClose={() => {
                onCloseErrorAlert(err)
            }}
        >
            {err}
        </Alert>
    ))

    return (
        <Card variant="outlined">
            <Container>{errorAlerts}</Container>
            <CardHeader
                variant="outlined"
                title={
                    <IconicTypography
                        icon={<UploadFileIcon color="primary" />}
                        text="Set FIT file and FTP and weight"
                        variant="h5"
                    />
                }
            />
            <CardContent>
                <Stack spacing={5}>
                    <FileUploader
                        title="Select FIT File"
                        acceptExtension=".fit"
                        buttonText="Upload FIT file"
                        onUpload={onUploadFitFile}
                    />
                    <TextField
                        required
                        type="number"
                        label="FTP"
                        helperText="Used to calculate power zones; if the user's FTP is included in the FIT file, it is automatically completed."
                        value={ftp ?? 0}
                        onChange={(e) => setFtp(Number(e.currentTarget.value))}
                    />
                    <TextField
                        required
                        type="number"
                        label="Weight"
                        helperText="Used to calculate PWR; if the user's weight is included in the FIT file, it is automatically completed."
                        value={weight ?? 0}
                        onChange={(e) =>
                            setWeight(Number(e.currentTarget.value))
                        }
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        onClick={onUpload}
                    >
                        Convert
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}

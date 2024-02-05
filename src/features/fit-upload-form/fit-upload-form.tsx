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
    onUpload?: (fit: ListedFit, weight: number, file: File) => void
}

export const FitUploadForm: React.FC<FitUploadFormProps> = (props) => {
    const [errors, setErrors] = React.useState<string[]>([])
    const [file, setFile] = React.useState<File | undefined>()
    const [fit, setFit] = React.useState<ListedFit | undefined>()
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
            errs.push('FITファイルをアップロードしてください。')
        }
        if (weight === undefined) {
            errs.push('体重を入力してください。')
        }
        if (weight <= 0) {
            errs.push('体重の値が不正です。')
        }

        setErrors(errs)
        if (errs.length === 0) {
            props.onUpload(fit, weight, file)
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
                        text="FITファイルと体重を設定"
                        variant="h5"
                    />
                }
            />
            <CardContent>
                <Stack spacing={5}>
                    <FileUploader
                        title="FITファイルを選択"
                        acceptExtension=".fit"
                        buttonText="FITファイルをアップロード"
                        onUpload={onUploadFitFile}
                    />
                    <TextField
                        required
                        type="number"
                        label="体重"
                        helperText="PWRの算出に使用します。FITファイル内にユーザの体重が含まれる場合は自動で補完されます。"
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
                        変換
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
}

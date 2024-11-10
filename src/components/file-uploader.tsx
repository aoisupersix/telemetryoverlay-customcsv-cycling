import React from 'react'

import { Button, ButtonGroup, Container } from '@mui/material'
import styled from 'styled-components'

interface FileUploaderProps {
    title?: string
    acceptExtension?: string
    buttonText?: string
    onUpload?: (file: File) => void
}

const HiddenInput = styled.input`
    display: none;
`

export const FileUploader: React.FC<FileUploaderProps> = (props) => {
    const inputRef = React.useRef(null)
    const [file, setFile] = React.useState<File | undefined>()

    const onClickUploadButton = () => {
        inputRef.current.click()
    }
    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        const files = (e.target as HTMLInputElement).files
        if (files.length === 1) {
            const uploadedFile = files[0]
            props.onUpload(uploadedFile)
            setFile(uploadedFile)
        } else {
            setFile(undefined)
        }
    }

    return (
        <Container>
            <ButtonGroup variant="contained" aria-label="primary button group">
                <Button disabled>{file?.name ?? 'Upload your file.'}</Button>
                <Button onClick={onClickUploadButton}>
                    {props.buttonText ?? 'Upload File'}
                </Button>
            </ButtonGroup>
            <HiddenInput
                type="file"
                accept={props.acceptExtension}
                onChange={onChange}
                ref={inputRef}
            />
        </Container>
    )
}

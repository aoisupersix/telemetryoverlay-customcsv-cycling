import * as React from 'react'

import GitHubIcon from '@mui/icons-material/GitHub'
import XIcon from '@mui/icons-material/X'
import {
    AppBar as MUIAppBar,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material'

import { environment } from '../models/environment'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mainLogo = require('../assets/images/mainLogo.svg')

export const AppBar: React.FC = () => {
    return (
        <MUIAppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    color="inherit"
                    edge="start"
                    disableRipple
                    sx={{ cursor: 'default' }}
                >
                    <img src={mainLogo.default} height={24} />
                </IconButton>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: 'bold', flexGrow: 1 }}
                    gutterBottom
                >
                    TelemetryOverlay custom CSV generation for cycling
                </Typography>
                <Typography variant="caption">
                    v{environment.VERSION}
                </Typography>
                <IconButton
                    size="large"
                    color="inherit"
                    href="https://github.com/aoisupersix/telemetryoverlay-customcsv-cycling"
                    target="_blank"
                >
                    <GitHubIcon />
                </IconButton>
                <IconButton
                    size="large"
                    color="inherit"
                    href="https://twitter.com/aoisupersix"
                    target="_blank"
                >
                    <XIcon />
                </IconButton>
            </Toolbar>
        </MUIAppBar>
    )
}

import React from 'react'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { useContext } from 'react';
import { ColorModeContext, tokens } from '../theme';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import Logo from '../assets/logo.png'
const NavBar = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const colorMode = useContext(ColorModeContext)
    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            <Box display="flex" color={colors.primary[100]} borderRadius="3px" >
                
                <img src={Logo} alt="logo img" height="50px" width="100px"></img>
                <Typography variant='h1' >
                    Youtube Video Summarizer
                </Typography>
            </Box>
            <Box display='flex' >
                <IconButton sx={{ display: "flex" }} onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? <DarkModeOutlinedIcon></DarkModeOutlinedIcon> : <LightModeOutlinedIcon></LightModeOutlinedIcon>}
                </IconButton>
            </Box>
        </Box>
    )
}

export default NavBar

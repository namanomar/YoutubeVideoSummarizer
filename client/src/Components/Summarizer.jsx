import React, { useState, useEffect } from 'react'
import { Box, Button, TextField, useTheme, Typography } from '@mui/material'
import axios from 'axios'
import { tokens } from '../theme';
import { CardMedia } from '@mui/material';
import { get_summary } from '../config/api';


const Summarizer = () => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [youtubeVideo, setYoutubeVideo] = useState('')
    const [summary, setSummary] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [videoId, setVideoId] = useState(null)
    const handleInputChange = (event) => {
        setYoutubeVideo(event.target.value);
        const videoId = (event.target.value).split('=')[1]
        setVideoId(videoId)
    };

    const handleSubmit = async (event) => {
        setSummary('')
        event.preventDefault();
        if (youtubeVideo.length <= 0) {
            setError('Video not loaded')
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.get(get_summary(youtubeVideo), { signal })
            if (response.status === 200) {
                const result = await response.data;
                setSummary(result.data)
                setIsLoading(false);
                console.log(result.data)
            }
        } catch (error) {
            if (!axios.isCancel(error)) {
                console.error(error);
                setError('An error occurred while fetching the summary')
                setIsLoading(false);
            }
        }

        return () => {
            // Cleanup the request when the component unmounts
            controller.abort();
        };
    };


    useEffect(() => {
        const controller = new AbortController();
        // Cleanup function to abort the request on unmount
        return () => {
            if (isLoading) {
                controller.abort();
            }
        }
    }, [isLoading]);


    const formatSummary = (text) => {
        // Custom function to format the summary
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')  // Italic
            .replace(/\n/g, '<br/>');  // New line

        return { __html: formattedText };
    };
    return (
        <Box display="flex" justifyContent="center" flexDirection="column" m="20px">
            <form onSubmit={handleSubmit}>
                <Box display="flex" gap="30px" justifyItems="center">
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Youtube Video"
                        name="youtubeVideo"
                        sx={{ gridColumn: "span 2" }}
                        value={youtubeVideo}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box display="flex" justifyContent="center" mt="20px">
                    <Button type="submit" color="secondary" variant="contained" sx={{ backgroundColor: colors.greenAccent[400] }}>
                        Submit
                    </Button>
                </Box>
            </form>
            {youtubeVideo && <Box m="20px" display="flex" justifyItems="center">
                <CardMedia component="img" sx={{ width: '640px', height: '320px' }} src={`http://img.youtube.com/vi/${videoId}/0.jpg`} allow="autoPlay" />
            </Box>}
            {isLoading === true && <div role="status">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
            </div>}
            {error && <Typography color="error" variant="body1" sx={{ mt: "20px" }}>{error}</Typography>}
            {summary && !isLoading && <Typography variant='h4' sx={{ mt: "20px" }}>
                <Box mt="20px">
                    {/* <Typography variant="h5" fontWeight="bold">Summary:</Typography> */}
                    <Typography variant="body1" dangerouslySetInnerHTML={formatSummary(summary)} />
                </Box>
            </Typography>}
        </Box>
    )
}

export default Summarizer

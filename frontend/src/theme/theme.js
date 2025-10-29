import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import backgroundImage from '../assets/images/fond.png'; // Assuming your image is named background.jpg

let theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
        background: {
            default: '#f4f6f8',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3rem',
            fontWeight: 500,
        },
        h4: {
            fontSize: '1.8rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: `url(${backgroundImage}) center/cover no-repeat fixed`,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        color: 'rgba(0, 0, 0, 0.87)', // Default dark text
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 0.6)', // Default dark label
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#1976d2', // primary.main
                        },
                        '&:hover fieldset': {
                            borderColor: '#1976d2',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                        },
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    color: 'rgba(0, 0, 0, 0.87)', // Default dark text
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                    },
                    '& .MuiSelect-icon': {
                        color: 'rgba(0, 0, 0, 0.54)', // Default dark icon
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'rgba(0, 0, 0, 0.6)', // Default dark label
                },
            },
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;
export const DARK_THEME = {
    palette: {
        mode: 'dark',
        text: {
            primary: '#f1f2f9',
            secondary: '#f1f2f9'
        }
    },
    components: {
        MuiSelect: {
            styleOverrides: {
                root: {
                    color: '#f1f2f9',
                    borderRadius: '10px',
                    backgroundColor: '#222d41',
                    '.MuiOutlinedInput-input': {
                        // padding: '0'
                    },
                    '.MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: '2px solid #2187d0',
                    }
                }
            },

        }
    }
}

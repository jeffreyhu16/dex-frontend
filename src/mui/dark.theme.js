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
                    fontFamily: 'DM Sans',
                    width: '10rem',
                    color: '#f1f2f9',
                    borderRadius: '10px',
                    backgroundColor: '#222d41',
                    '.MuiOutlinedInput-input': {
                        
                        textTransform: 'capitalize',
                        padding: '12.5px 14px',
                        '.MuiBox-root': {
                            gap: '16px',
                            alignItems: 'center'
                        }
                    },
                    '.MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: '2px solid #2187d0',
                    }
                }
            },
        },
        MuiMenu: {
            styleOverrides: {
                root: {
                    '.MuiPopover-paper': {
                        borderRadius: '10px',
                        '.MuiMenuItem-root': {
                            fontFamily: 'DM Sans',
                            padding: '6px 14px',
                            gap: '16px'
                        }
                    }
                }
            }
        }
    }
}

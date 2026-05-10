import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#000000",
      paper: "#0a0a0a",
    },

    primary: {
      main: "#22c55e",
    },

    text: {
      primary: "#ffffff",
      secondary: "#8a8a8a",
    },
  },

  typography: {
    fontFamily: "'Inter', sans-serif",

    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },

    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },

    h3: {
      fontSize: "1.6rem",
      fontWeight: 600,
    },

    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },

    body2: {
      fontSize: "0.92rem",
      lineHeight: 1.6,
    },

    button: {
      fontSize: "0.9rem",
      fontWeight: 600,
      textTransform: "none",
    },
  },

  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#080808",
          backgroundImage: "none",
          border: "1px solid #1a1a1a",
          borderRadius: 18,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.3px",
          textTransform: "none",
          minWidth: 90,
          color: "#777",

          "&.Mui-selected": {
            color: "#22c55e",
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#22c55e",
          height: 3,
          borderRadius: 10,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #111",
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: "#ddd",
          padding: "16px 18px",
        },

        head: {
          color: "#777",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1px",
          textTransform: "uppercase",
          backgroundColor: "#000",
          padding: "12px 18px",
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#111",
          border: "1px solid #222",
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          padding: "8px 10px",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 18px",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
        },
      },
    },
  },
});

export default theme;
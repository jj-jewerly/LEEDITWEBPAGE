// src/styles/theme.js
export const theme = {
    colors: {
      primary: {
        main: '#00AB55',
        light: '#3FC79A',
        dark: '#008F48',
        contrastText: '#FFFFFF'
      },
      secondary: {
        main: '#3366FF',
        light: '#84A9FF',
        dark: '#1939B7',
        contrastText: '#FFFFFF'
      },
      text: {
        primary: '#212B36',
        secondary: '#637381'
      },
      background: {
        default: '#FFFFFF',
        paper: '#F9FAFB'
      },
      error: '#FF4842',
      warning: '#FFC107',
      info: '#00B8D9',
      success: '#54D62C'
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      h1: {
        fontSize: '4rem',
        fontWeight: 800,
        lineHeight: 1.2
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.3
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'none'
      }
    },
    spacing: (factor) => `${0.5 * factor}rem`,
    borderRadius: {
      small: '8px',
      medium: '12px',
      large: '16px'
    },
    shadows: {
      card: '0 0 20px rgba(0, 0, 0, 0.05)',
      button: '0 5px 15px rgba(0, 171, 85, 0.3)',
      navbar: '0 2px 20px rgba(0, 0, 0, 0.1)'
    },
    transitions: {
      default: 'all 0.3s ease',
      fast: 'all 0.2s ease'
    }
  };
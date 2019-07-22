import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#48639c',
    },
    secondary: {
      main: '#712f79',
    },
  },
  typography: {
    fontFamily: `'EB Garamond', serif`,
  },
});

export default theme;

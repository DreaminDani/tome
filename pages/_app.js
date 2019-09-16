import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';
import Menu from '../src/molecule/Menu';
import theme from '../src/theme';
import { UserContext } from '../src/contexts';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    if (ctx.req && ctx.req.session.passport) {
      pageProps.user = ctx.req.session.passport.user;
    }
    return { pageProps };
  }

  constructor(props) {
    super(props);
    this.state = {
      user: props.pageProps.user,
    };
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    const props = {
      ...pageProps,
      user: this.state.user,
    };

    return (
      <Container>
        <Head>
          <title>Tome</title>
        </Head>
        <UserContext.Provider value={this.state.user}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Menu />
            <Component {...props} />
          </ThemeProvider>
        </UserContext.Provider>
      </Container>
    );
  }
}

export default MyApp;

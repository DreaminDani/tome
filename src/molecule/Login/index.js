import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const { toggleLogin, onSubmit } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // should be form submit to prevent default
  const submit = (e) => {
    // validate here before sending
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in\
      </Typography>
      <form onSubmit={submit} className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          // TODO add "forgot password" flow
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          type="submit"
          id="signin-button"
        >
          Sign In
        </Button>
        <Grid container justify="space-between">
          <Grid item>
            <Link href="/auth/google" variant="body2">
              Login with Google
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" onClick={toggleLogin} variant="body2">
              Create an account
            </Link>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

Login.propTypes = {
  onSubmit: PropTypes.func,
  toggleLogin: PropTypes.func,
};

export default Login;

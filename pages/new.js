import React, { useEffect } from 'react';
import { Box, Grid, ButtonGroup, Button, TextField, makeStyles, Typography } from '@material-ui/core';
import { postData } from '../src/api';
import Router from 'next/router';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 16px',
  },
  title: {
    maxWidth: 'calc(100% - 120px)', //header width
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  settings: {
    [theme.breakpoints.down('xs')]: {
      background: '#ffffff',
      zIndex: 5,
      boxShadow: theme.shadows[2],
      position: 'absolute',
      bottom: 0,
      width: '100%',
      marginLeft: -8,
    }
  },
  actions: {
    [theme.breakpoints.down('xs')]: {
      float: 'right'
    },
    marginTop: 24,
    marginBottom: 24
  },
  button: {
    marginRight: 8,
  }
}));

function New(props) {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    name: '',
    body: '',
    numRows: 4,
  });

  useEffect(() => {
    const calculatedRows = Math.round(document.getElementById('body-border').clientHeight / 19);
    setValues({...values, numRows: calculatedRows });
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = async () => {
    // todo validate
    const res = await postData('/api/artifact/add',{
      name: values.name,
      body: values.body
    });
    
    if (res.id) {
      Router.push(`/artifact/slug=${res.id}`, `/artifact/${res.id}`);
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h1" className={classes.title}>
          New Artifact
      </Typography>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        spacing={2}
      >
        <Grid item xs={12} sm={8}>
          <TextField
            id="outlined-name"
            label="Name"
            className={classes.name}
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <Box height="100%" maxHeight="40vh" width="100%" id="body-border">
            <TextField
              id="outlined-body"
              label="Body"
              multiline
              rows={values.numRows} // each row is 19px
              value={values.body}
              onChange={handleChange('body')}
              margin="normal"
              variant="outlined"
              fullWidth
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} className={classes.settings}>
          <div className={classes.actions}>
            <Button className={classes.button}>Discard</Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleSave}>
              Save
            </Button>
          </div>
          <Typography variant="h4" component="h2" gutterBottom>
            Font type
          </Typography>
          <ButtonGroup aria-label="Small outlined button group">
            <Button>Serif</Button>
            <Button>Sans</Button>
            <Button>Mono</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </div>
  )
}

export default New;
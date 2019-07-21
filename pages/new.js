import React, { useEffect } from 'react';
import { Box, Grid, TextField, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  title: {
    maxWidth: 'calc(100% - 120px)', //header width
  },
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
})

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

  return (
    <div>
      <Typography variant="h1" className={classes.title}>
          New Artifact
        </Typography>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
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
          <Box height="100%" maxHeight="50vh" width="100%" id="body-border">
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
      </Grid>
    </div>
  )
}

export default New;
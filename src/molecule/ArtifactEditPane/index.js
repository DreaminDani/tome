import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, TextField, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textBox: {
    maxHeight: '60vh',
    [theme.breakpoints.down('sm')]: {
      maxHeight: '30vh'
    }
  }
}))

function ArtifactEditPane(props) {
  const classes = useStyles();
  const { handleChange, name, body, handleFocus, handleBlur } = props;

  const [numRows, setNumRows] = useState(4);

  useEffect(() => {
    const calculatedRows = Math.round(document.getElementById('body-border').clientHeight / 19); // each row is 19px
    setNumRows(calculatedRows);
  });

  return (
    <Grid item xs={12} sm={8}>
      <TextField
        id="outlined-name"
        label="Name"
        className={classes.name}
        value={name}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange('name')}
        margin="normal"
        variant="outlined"
        fullWidth
      />
      <Box height="100%" width="100%" id="body-border" className={classes.textBox}>
        <TextField
          id="outlined-body"
          label="Body"
          multiline
          rows={numRows}
          value={body}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange('body')}
          margin="normal"
          variant="outlined"
          fullWidth
        />
      </Box>
    </Grid>
  )
}

ArtifactEditPane.propTypes = {
  handleChange: PropTypes.func,
  handleFocus: PropTypes.func,
  handleBlur: PropTypes.func,
  name: PropTypes.string,
  body: PropTypes.string,
  numRows: PropTypes.number,
}

export default ArtifactEditPane;
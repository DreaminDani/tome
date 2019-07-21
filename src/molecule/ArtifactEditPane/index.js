import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, TextField, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  name: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
})

function ArtifactEditPane(props) {
  const classes = useStyles();
  const { handleChange, name, body } = props;

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
          rows={numRows}
          value={body}
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
  name: PropTypes.string,
  body: PropTypes.string,
  numRows: PropTypes.number,
}

export default ArtifactEditPane;
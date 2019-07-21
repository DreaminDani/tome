import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { getData, postData } from '../src/api';
import Router from 'next/router';

import ArtifactEditPane from '../src/molecule/ArtifactEditPane';
import ArtifactSettingsPane from '../src/molecule/ArtifactSettingsPane';

const useStyles = makeStyles({
  root: {
    margin: '0 16px',
  },
  title: {
    maxWidth: 'calc(100% - 120px)', //header width
  }
});

function Edit(props) {
  const classes = useStyles();

  const [values, setValues] = useState({
    name: (props.artifact_data && props.artifact_data.name) ? props.artifact_data.name : '',
    body: (props.artifact_data && props.artifact_data.body) ? props.artifact_data.body : '',
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSave = async () => {
    // todo validate
    const request = {
      name: values.name,
      body: values.body
    };
    if (props.id) {
      request.id = props.id;
    }

    const res = await postData(
      props.id ? '/api/artifact/update' : '/api/artifact/add',
      request
    );
    
    if (res.id) {
      Router.push(`/artifact/slug=${res.id}`, `/artifact/${res.id}`);
    }
  }

  return (
    <div className={classes.root}>
      <Typography variant="h1" className={classes.title}>
          { props.id ? 'Edit' : 'New' } Artifact
      </Typography>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        spacing={2}
      >
        <ArtifactEditPane handleChange={handleChange} name={values.name} body={values.body} />
        <ArtifactSettingsPane handleSave={handleSave} />
      </Grid>
    </div>
  )
}

Edit.getInitialProps = async ({ req }) => {
  if (req && req.params && req.params.slug) {
    const res = await getData(`/api/artifact/${req.params.slug}`, req.headers.cookie);
    return res;
  }

  return {};
}

Edit.propTypes = {
  id: PropTypes.string,
  user_id: PropTypes.number,
  artifact_data: PropTypes.shape({
    body: PropTypes.string,
    name: PropTypes.string
  }),
  created_at: PropTypes.string,
  updated_at: PropTypes.string
}

export default Edit;
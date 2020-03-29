import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import Head from 'next/head';
import Router from 'next/router';
import { getData, postData } from '../src/api';

import { artifactDataProps } from '../src/organism/Artifact';
import ArtifactEditPane from '../src/molecule/ArtifactEditPane';
import ArtifactSettingsPane from '../src/molecule/ArtifactSettingsPane';

const useStyles = makeStyles({
  root: {
    margin: '0 16px',
  },
  title: {
    maxWidth: 'calc(100% - 120px)', // header width
  },
});

function Edit(props) {
  const classes = useStyles();
  const { artifact_data, id } = props;
  const artifactEdit = Array.isArray(artifact_data)
    ? artifact_data[artifact_data.length - 1]
    : artifact_data;
  const artifact_title =
    artifactEdit && artifactEdit.name ? artifactEdit.name : 'Artifact';

  const [values, setValues] = useState({
    name: artifactEdit && artifactEdit.name ? artifactEdit.name : '',
    body: artifactEdit && artifactEdit.body ? artifactEdit.body : '',
  });

  const [focused, setFocus] = useState(false);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleDiscard = () => {
    if (history) {
      history.back();
    } else {
      Router.push('/');
    }
  };

  const handleSave = async () => {
    // todo validate
    const request = {
      name: values.name,
      body: values.body,
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
  };

  const handleFocus = () => {
    setFocus(true);
  };
  const handleBlur = () => {
    setFocus(false);
  };

  return (
    <div className={classes.root}>
      <Head>
        <title>Tome - {id ? `Edit "${artifact_title}"` : 'New Artifact'}</title>
      </Head>
      <Typography variant="h1" className={classes.title}>
        {id ? 'Edit' : 'New'} Artifact
      </Typography>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        spacing={2}
      >
        <ArtifactEditPane
          handleChange={handleChange}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          name={values.name}
          body={values.body}
        />
        <ArtifactSettingsPane
          handleDiscard={handleDiscard}
          handleSave={handleSave}
          focused={focused}
        />
      </Grid>
    </div>
  );
}

Edit.getInitialProps = async ({ req }) => {
  if (req && req.params && req.params.slug) {
    const res = await getData(
      `/api/artifact/${req.params.slug}`,
      req.headers.cookie
    );
    return res;
  }

  return {};
};

Edit.propTypes = {
  id: PropTypes.string,
  // user_id: PropTypes.number,
  artifact_data: PropTypes.oneOfType([
    PropTypes.shape(artifactDataProps),
    PropTypes.arrayOf(PropTypes.shape(artifactDataProps)),
  ]),
  // created_at: PropTypes.string,
  // updated_at: PropTypes.string,
};

export default Edit;

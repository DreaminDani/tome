import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Grid, Typography, makeStyles } from '@material-ui/core';
import { getData } from '../src/api';
import ArtifactContext from '../src/ArtifactContext';
import Artifact, { artifactDataProps } from '../src/organism/Artifact';
import ArtifactVersionSelection from '../src/molecule/ArtifactVersionSelection';

const useStyles = makeStyles({
  topMatter: {
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 8,
  },
  editButton: { display: 'flex', alignItems: 'center' },
});

function ArtifactPage(props) {
  const classes = useStyles();
  const { artifact_data, artifact_url, id } = props;
  const [artifactIndex, updateArtifactIndex] = useState(
    artifact_data.length ? artifact_data.length - 1 : 0
  );

  const versions = Array.isArray(artifact_data)
    ? artifact_data
    : [artifact_data];

  const currentURL = versions[artifactIndex].version
    ? `${artifact_url}#v${versions[artifactIndex].version}`
    : artifact_url;

  useEffect(() => {
    if (versions[artifactIndex].version) {
      window.location.hash = `v${versions[artifactIndex].version}`;
    }
  });

  const artifact_title =
    artifact_data && versions[artifactIndex].name
      ? versions[artifactIndex].name
      : 'Artifact';

  return (
    <ArtifactContext.Provider
      value={{
        versions,
        currentVersionIndex: artifactIndex,
        updateCurrentVersionIndex: updateArtifactIndex,
      }}
    >
      <Head>
        <title>Tome - "{artifact_title}"</title>
      </Head>
      <Grid
        container
        direction={versions[artifactIndex].version ? 'row-reverse' : 'row'}
        justify={versions[artifactIndex].version ? 'center' : 'flex-start'}
        align-items="center"
        spacing={2}
        className={classes.topMatter}
      >
        <Grid className={classes.editButton} item xs={1}>
          <Link href="/edit/[slug]" as={`/edit/${id}`}>
            <Button id="edit-artifact-button" color="secondary">
              Edit
            </Button>
          </Link>
        </Grid>
        <Grid item xs={8}>
          {versions[artifactIndex].version ? (
            <ArtifactVersionSelection />
          ) : (
            <>
              <Typography>
                <strong>Artifact link:</strong> {currentURL}
              </Typography>
              <Typography>
                <em>Copy / paste this link to share with others</em>
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
      <Artifact id={id} artifact_data={versions[artifactIndex]} />
    </ArtifactContext.Provider>
  );
}

ArtifactPage.getInitialProps = async ({ req }) => {
  const res = await getData(
    `/api/artifact/${req.params.slug}`,
    req.headers.cookie
  );

  res.artifact_url = `${req.headers.host}${req.path}`;
  return res;
};

ArtifactPage.propTypes = {
  artifact_url: PropTypes.string,
  id: PropTypes.string,
  artifact_data: PropTypes.oneOfType([
    PropTypes.shape(artifactDataProps),
    PropTypes.arrayOf(PropTypes.shape(artifactDataProps)),
  ]),
};

export default ArtifactPage;

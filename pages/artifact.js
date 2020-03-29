import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const classes = useStyles();
  const { artifact_data, artifact_url, id } = props;

  const [versions, updateVersions] = useState(
    Array.isArray(artifact_data) ? artifact_data : [artifact_data]
  );

  const copyCommentsToVersion = (comments, version) => {
    const newVersions = versions;
    newVersions[version].comments = comments;
    updateVersions(newVersions);
  };

  let query = {};
  if (Array.isArray(artifact_data)) {
    const versionInQuery = router.asPath.split('?')[1];
    if (versionInQuery) {
      query = JSON.parse(
        `{"${decodeURI(versionInQuery)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"')}"}`
      );
    } else {
      query.version = artifact_data.length;
    }
  }

  const requestedVersion = query.version ? Number(query.version) : 1;
  const [queryVersion, setQueryVersion] = useState(
    versions.length < requestedVersion ? versions.length : requestedVersion
  );

  const [artifactIndex, updateArtifactIndex] = useState(queryVersion - 1);
  const [currentArtifact, setCurrentArtifact] = useState(
    versions[artifactIndex]
  );

  const updateCurrentVersion = versionIndex => {
    updateArtifactIndex(versionIndex);
    setCurrentArtifact(versions[versionIndex]);
  };

  useEffect(() => {
    if (
      requestedVersion !== queryVersion ||
      (versions[artifactIndex].version &&
        versions[artifactIndex].version !== queryVersion)
    ) {
      window.history.pushState(
        '',
        '',
        `?version=${versions[artifactIndex].version}`
      );
      setQueryVersion(versions[artifactIndex].version);
    }
  }, [versions, artifactIndex, queryVersion, requestedVersion]);

  const artifact_title =
    artifact_data && versions[artifactIndex].name
      ? versions[artifactIndex].name
      : 'Artifact';

  return (
    <ArtifactContext.Provider
      value={{
        versions,
        currentVersionIndex: artifactIndex,
        updateCurrentVersionIndex: updateCurrentVersion,
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
            <Button
              id="edit-artifact-button"
              color="secondary"
              disabled={artifactIndex !== versions.length - 1}
            >
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
                <strong>Artifact link:</strong> {artifact_url}
              </Typography>
              <Typography>
                <em>Copy / paste this link to share with others</em>
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
      <Artifact
        id={id}
        artifact_data={currentArtifact}
        copyCommentsToVersion={copyCommentsToVersion}
      />
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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import {
  Button,
  Grid,
  Typography,
  Slider,
  makeStyles,
} from '@material-ui/core';
import { getData } from '../src/api';
import Artifact, { artifactDataProps } from '../src/organism/Artifact';

const useStyles = makeStyles({
  topMatter: {
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 8,
  },
});

function ArtifactPage(props) {
  const classes = useStyles();
  const { artifact_data, artifact_url, id } = props;
  const [artifactIndex, updateArtifactIndex] = useState(
    artifact_data.length ? artifact_data.length - 1 : 0
  );

  const currentArtifact = Array.isArray(artifact_data)
    ? artifact_data[artifactIndex]
    : artifact_data;
  const currentURL = currentArtifact.version
    ? `${artifact_url}#v${currentArtifact.version}`
    : artifact_url;

  useEffect(() => {
    if (currentArtifact.version) {
      window.location.hash = `v${currentArtifact.version}`;
    }
  });

  const artifact_title =
    artifact_data && currentArtifact.name ? currentArtifact.name : 'Artifact';

  // todo, convert these into the version numbers
  // similar to restricted values: https://material-ui.com/components/slider/#discrete-sliders
  const marks = [
    {
      value: 0,
      label: '0°C',
    },
    {
      value: 20,
      label: '20°C',
    },
    {
      value: 37,
      label: '37°C',
    },
    {
      value: 100,
      label: '100°C',
    },
  ];

  const valuetext = value => `${value}°C`;

  const valueLabelFormat = value =>
    marks.findIndex(mark => mark.value === value) + 1;

  return (
    <div>
      <Head>
        <title>Tome - "{artifact_title}"</title>
      </Head>
      <Grid container direction="row" spacing={2} className={classes.topMatter}>
        <Grid item>
          <Link href="/edit/[slug]" as={`/edit/${id}`}>
            <Button id="edit-artifact-button" color="secondary">
              Edit
            </Button>
          </Link>
        </Grid>
        <Grid item>
          {currentArtifact.version ? (
            <Slider
              defaultValue={artifactIndex}
              valueLabelFormat={valueLabelFormat}
              getAriaValueText={valuetext}
              aria-labelledby="discrete-slider-restrict"
              step={null}
              valueLabelDisplay="auto"
              marks={marks}
            />
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
      <Artifact id={id} artifact_data={currentArtifact} />
    </div>
  );
}

ArtifactPage.getInitialProps = async ({ req }) => {
  const res = await getData(
    `/api/artifact/${req.params.slug}`,
    req.headers.cookie
  );

  console.log(res);

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

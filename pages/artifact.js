import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Grid, Typography, makeStyles } from '@material-ui/core';
import { getData } from '../src/api';
import Artifact from '../src/organism/Artifact';

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
  const artifact_title =
    artifact_data && artifact_data.name ? artifact_data.name : 'Artifact';

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
          <Typography>
            <strong>Artifact link:</strong> {artifact_url}
          </Typography>
          <Typography>
            <em>Copy / paste this link to share with others</em>
          </Typography>
        </Grid>
      </Grid>
      <Artifact id={id} artifact_data={artifact_data} />
    </div>
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
  ...Artifact.propTypes,
};

export default ArtifactPage;

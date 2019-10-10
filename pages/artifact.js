import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button, makeStyles } from '@material-ui/core';
import { getData } from '../src/api';
import Artifact from '../src/organism/Artifact';

const useStyles = makeStyles({
  topButton: {
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 8,
  },
});

function ArtifactPage(props) {
  const classes = useStyles();
  const { artifact_data, id } = props;
  const artifact_title =
    artifact_data && artifact_data.name ? artifact_data.name : 'Artifact';

  return (
    <div>
      <Head>
        <title>Tome - "{artifact_title}"</title>
      </Head>
      <Link href="/edit/[slug]" as={`/edit/${id}`}>
        <Button className={classes.topButton} color="secondary">
          Edit
        </Button>
      </Link>
      <Artifact id={id} artifact_data={artifact_data} />
    </div>
  );
}

ArtifactPage.getInitialProps = async ({ req }) => {
  const res = await getData(
    `/api/artifact/${req.params.slug}`,
    req.headers.cookie
  );
  return res;
};

ArtifactPage.propTypes = {
  ...Artifact.propTypes,
};

export default ArtifactPage;

import React from 'react';
// import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import { getData } from '../src/api';
import Artifact from '../src/organism/Artifact';

function ArtifactPage(props) {
  const { artifact_data, id } = props;

  return (
    <div>
      <Link href="/edit/[slug]" as={`/edit/${id}`}>
        <Button color="secondary">Edit</Button>
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
  // user_id: PropTypes.number,
  ...Artifact.propTypes,
  // created_at: PropTypes.string,
  // updated_at: PropTypes.string,
};

export default ArtifactPage;

import React from 'react';
import PropTypes from 'prop-types';
import { getData } from '../src/api';
import Artifact from '../src/organism/Artifact';

function ArtifactPage(props) {
  return (
    <div>
        {/* Header info about artifact will go here */}
        <Artifact name={props.artifact_data.name} body={props.artifact_data.body} />
    </div>
  );
}

ArtifactPage.getInitialProps = async ({ req }) => {
  const res = await getData(`/api/artifact/${req.params.slug}`, req.headers.cookie);
  return res;
}

ArtifactPage.propTypes = {
  id: PropTypes.string,
  user_id: PropTypes.number,
  artifact_data: PropTypes.shape({
    body: PropTypes.string,
    name: PropTypes.string
  }),
  created_at: PropTypes.string,
  updated_at: PropTypes.string
}

export default ArtifactPage;
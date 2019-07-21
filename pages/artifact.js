import React from 'react';
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

export default ArtifactPage;
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '../src/Link';
import Artifact from '../src/organism/artifact';


export default function ArtifactPage() {
  return (
    <div>
        <Typography variant="h4" component="h1" gutterBottom>
            Tome
        </Typography>
        <Link href="/about" color="secondary">
            Go to the about page
        </Link>
        <Artifact />
    </div>
  );
}

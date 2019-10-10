import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button, makeStyles } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import Artifact from '../src/organism/Artifact';

const currentTime = new Date().getTime();

const artifact_data = {
  name: 'About Tome',
  body: `Tome is a crowd-sourced poetry critique, collaboration and publishing platform. Tome aims to be:
- a fully-featured workshopping tool for undergraduate and graduate English programs
- an educational resource for secondary schools
- and a patron-based income generator for poets.

Poetry is the perfect art for the modern age – portable, short-form, and self-curated.

The only thing stopping poetry from becoming a dominant art form once again is the stigma against it.

Many believe that poetry is cryptic, inaccessible, and boring, which doesn’t have to be true. 

Milton and Dante aren’t all that poetry has to offer...
These days, poets are engaging topics that are relevant and relatable,
most often in colloquial free verse that’s affecting for all readers. 

And with a bit of study, it’s possible to get just as much beauty and emotion from the old masters, too.

All it will take is Tome to move poetry from the dusty halls of ivory towers into the public domain.

Try commenting to see what Tome has to offer!`,
  comments: [
    {
      user: {
        id: 0,
        name: 'Dani Sandoval (Tome)',
      },
      comment:
        'To add a new comment, click (and/or drag) anywhere within the artifact.',
      created: currentTime,
      updated: currentTime,
      location: [978, 988],
      id: 'default-comment',
    },
  ],
};

const useStyles = makeStyles({
  topButton: {
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 8,
  },
});

export default function AboutPage() {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>Tome - About</title>
      </Head>
      <Link href="/">
        <Button className={classes.topButton} color="secondary">
          <ChevronLeftIcon />
          Return Home
        </Button>
      </Link>
      <Artifact id="about" artifact_data={artifact_data} disableSave />
    </div>
  );
}

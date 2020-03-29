import { Slider, Typography, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import ArtifactContext from '../../ArtifactContext';

const useStyles = makeStyles({
  title: {
    marginLeft: '-2.4em',
  },
  markLabel: {
    width: '7.5em',
    height: '3em',
    overflow: 'hidden',
    whiteSpace: 'break-spaces',
    textAlign: 'center',
  },
});

function ArtifactVersionSelection() {
  const classes = useStyles();
  const {
    versions,
    currentVersionIndex,
    updateCurrentVersionIndex,
  } = useContext(ArtifactContext);

  const marks = versions.map(v => ({
    value: v.version - 1,
    label: new Date(v.date).toString(),
  }));

  const valuetext = value => marks.find(mark => mark.value === value).label;

  const valueLabelFormat = value =>
    `v${marks.findIndex(mark => mark.value === value) + 1}`;

  return (
    <div>
      <Typography className={classes.title} variant="overline">
        Versions
      </Typography>
      <Slider
        classes={{
          markLabel: classes.markLabel,
        }}
        data-testid="artifact-version"
        defaultValue={currentVersionIndex}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        aria-labelledby="artifact-version-selection"
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
        min={0}
        max={versions.length - 1}
        onChange={(event, value) => updateCurrentVersionIndex(value)}
      />
    </div>
  );
}

export default ArtifactVersionSelection;

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ArtifactListItem from '../../molecule/ArtifactListItem';

function ArtifactList(props) {
  const { list } = props;

  if (list && list.length) {
    return (
      <React.Fragment>
        <Typography variant="subtitle1">
          Or have a look at your previous work...
        </Typography>
        {list.map(artifact => (
          <ArtifactListItem artifact={artifact} key={artifact.id} />
        ))}
      </React.Fragment>
    );
  }

  return null;
}

ArtifactList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      user_id: PropTypes.number,
      created_at: PropTypes.string,
      updated_at: PropTypes.string,
      auth_metadata: PropTypes.object,
    })
  ),
};

export default ArtifactList;

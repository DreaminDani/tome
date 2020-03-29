import { createContext } from 'react';

const ArtifactContext = createContext({
  versions: [],
  currentVersionIndex: 0,
  updateCurrentVersionIndex: () => {},
});

export default ArtifactContext;

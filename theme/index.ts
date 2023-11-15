import { extendTheme } from '@chakra-ui/react';

import components from './components/index';
import config from './config';
import borders from './foundations/borders';
import breakpoints from './foundations/breakpoints';
import colors from './foundations/colors';
import semanticTokens from './foundations/semanticTokens';
import transition from './foundations/transition';
import typography from './foundations/typography';
import zIndices from './foundations/zIndices';
import global from './global';

const overridesBase = {
  ...typography,
  ...borders,
  colors,
  components,
  config,
  styles: {
    global,
  },
  breakpoints,
  transition,
  zIndices,
  semanticTokens,
};

// Additional Alice Overrides ( Old Alice -- MUI Provider ) -- TODO Extract as lib or extend chakra UI theme
const aliceThemeBase = ({
  palette: {
    mode: 'dark',
    extra: {
      modalBgDark: '#293240',
      modalBgDark50: '#29324050',
      modalBgDark2: '#202734',
    },
  },
});

const composedOverrides = {
  ...overridesBase,
  ...aliceThemeBase,
};

export default extendTheme(composedOverrides);

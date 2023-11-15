import { Box, Grid, Flex, Text, Link, Skeleton, HStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
// import discussionsIcon from 'icons/discussions.svg';
// import donateIcon from 'icons/donate.svg';
// import editIcon from 'icons/edit.svg';
// import cannyIcon from 'icons/social/canny.svg';
import discordIcon from 'icons/social/discord.svg';
import gitIcon from 'icons/social/git.svg';
import twitterIcon from 'icons/social/tweet.svg';
import type { ResourceError } from 'lib/api/resources';
// import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
// import useIssueUrl from 'lib/hooks/useIssueUrl';
// import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

// import ColorModeToggler from '../header/ColorModeToggler';
import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';
// import getApiVersionUrl from './utils/getApiVersionUrl';

const MAX_LINKS_COLUMNS = 4;

// const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${ config.UI.footer.frontendVersion }`;
// const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${ config.UI.footer.frontendCommit }`;

const Footer = () => {

  /*
  const { data: backendVersionData } = useApiQuery('config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
    },
  });
  */

  //   const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  //   const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  const BLOCKSCOUT_LINKS = [
    // {
    //   icon: editIcon,
    //   iconSize: '16px',
    //   text: 'Submit an issue',
    //   url: issueUrl,
    // },
    // {
    //   icon: cannyIcon,
    //   iconSize: '20px',
    //   text: 'Feature request',
    //   url: 'https://blockscout.canny.io/feature-requests',
    // },
    {
      icon: gitIcon,
      iconSize: '18px',
      text: 'Contribute',
      url: 'https://github.com/alicenet',
    },
    {
      icon: twitterIcon,
      iconSize: '18px',
      text: 'X',
      url: 'https://x.com/getvalencelabs',
    },
    {
      icon: discordIcon,
      iconSize: '18px',
      text: 'Discord',
      url: 'https://discord.gg/alicenet',
    },
    // {
    //   icon: discussionsIcon,
    //   iconSize: '20px',
    //   text: 'Discussions',
    //   url: 'https://github.com/orgs/blockscout/discussions',
    // },
    // {
    //   icon: donateIcon,
    //   iconSize: '20px',
    //   text: 'Donate',
    //   url: 'https://github.com/sponsors/blockscout',
    // },
  ];

  /**
  const frontendLink = (() => {
      if (config.UI.footer.frontendVersion) {
          return <Link href={ FRONT_VERSION_URL } target="_blank">{ config.UI.footer.frontendVersion }</Link>;
        }

        if (config.UI.footer.frontendCommit) {
            return <Link href={ FRONT_COMMIT_URL } target="_blank">{ config.UI.footer.frontendCommit }</Link>;
        }

        return null;
    })();
  */

  const fetch = useFetch();

  const { isPending, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
  });

  //   const colNum = Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      px={{ base: 4, lg: 8 }}
      py={{ base: 4, lg: 8 }}
      borderTop="1px solid"
      borderColor="divider"
      as="footer"
      columnGap={{ lg: '32px', xl: '100px' }}
    >
      <Box flexGrow="1" mb={{ base: 8, lg: 0 }} minW="195px">
        <Flex flexWrap="wrap" columnGap={ 4 } rowGap={ 4 }>
          { /* <ColorModeToggler/> */ }
          { !config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus/> }
          { /* TODO: Do we need this? -- Probably not until wallet integrations.. */ }
          { /* <NetworkAddToWallet/> */ }
        </Flex>
        <Box mt={{ base: 5, lg: 1 }}>
          <Link fontSize="xs" href="https://www.alice.net">alice.net</Link>
        </Box>
        { /* <VStack spacing={ 1 } mt={ 6 } alignItems="start">
          { apiVersionUrl && (
            <Text fontSize="xs">
                Backend: <Link href={ apiVersionUrl } target="_blank">{ backendVersionData?.backend_version }</Link>
            </Text>
          ) }
          { frontendLink && (
            <Text fontSize="xs">
              Frontend: { frontendLink }
            </Text>
          ) }
        </VStack> */ }
      </Box>
      <Grid
        gap={{ base: 6, lg: 4, xl: 4 }}
        gridTemplateColumns="auto"
      >
        <Box>
          { config.UI.footer.links && <Text fontWeight={ 500 } mb={ 3 }>Alice.Net</Text> }
          <Grid
            gap={ 1 }
            gridTemplateColumns={
              config.UI.footer.links ?
                '1fr' :
                {
                  base: 'repeat(auto-fill, 160px)',
                  lg: 'repeat(3, 160px)',
                  xl: 'repeat(3, 160px)',
                }
            }
            gridTemplateRows={{
              base: 'auto',
              lg: 'repeat(1, auto)',
              xl: 'repeat(1, auto)',
            }}
            gridAutoFlow="row"
            mt={{ base: 0, lg: config.UI.footer.links ? 0 : '0px' }}
          >
            { BLOCKSCOUT_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
          </Grid>
        </Box>
        { config.UI.footer.links && isPending && (
          Array.from(Array(3)).map((i, index) => (
            <Box key={ index }>
              <Skeleton w="100%" h="20px" mb={ 6 }/>
              <HStack spacing={ 5 } alignItems="start" mb={ 2 }>
                { Array.from(Array(5)).map((i, index) => <Skeleton w="100%" h="14px" key={ index }/>) }
              </HStack>
            </Box>
          ))
        ) }
        { config.UI.footer.links && linksData && (
          linksData.slice(0, MAX_LINKS_COLUMNS).map(linkGroup => (
            <Box key={ linkGroup.title }>
              <Text fontWeight={ 500 } mb={ 3 }>{ linkGroup.title }</Text>
              <HStack spacing={ 1 } alignItems="start">
                { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }
              </HStack>
            </Box>
          ))
        ) }
      </Grid>
    </Flex>
  );
};

export default Footer;

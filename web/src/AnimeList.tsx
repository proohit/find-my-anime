import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  Anime,
  getAnyIdOfAnime,
  getProvider,
  getProviderIdOfAnime,
  getProviders,
} from "@find-my-anime/shared";
import { FC } from "react";
import { FaLink, FaTag } from "react-icons/fa";
import { AnimeTopic } from "./AnimeTopic";
import { AnimeTopicHeader } from "./AnimeTopicHeader";
import { TagList } from "./TagList";

interface Props {
  animes: Anime[];
}

const AnimeList: FC<Props> = (props) => {
  const { animes } = props;
  return (
    <>
      {animes.map((anime) => (
        <AnimeSearchEntry anime={anime} key={anime.title} />
      ))}
    </>
  );
};

export default AnimeList;

const AnimeSearchEntry: FC<{ anime: Anime }> = (props) => {
  const { anime } = props;
  const providers = getProviders(anime);
  const provider = providers.length > 0 ? providers[0] : undefined;
  const id = provider
    ? getProviderIdOfAnime(anime, provider)
    : getAnyIdOfAnime(anime);
  const getUrlOfAnime = () => {
    if (provider) {
      return `/anime/${id}?provider=${provider}`;
    } else return `/anime/${id}`;
  };
  const queriedTagLimit =
    useBreakpointValue({
      base: 10,
      lg: 30,
      xl: 50,
    }) || 10;
  return (
    <LinkBox w={{ md: "100%" }}>
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        w="100%"
        h={{ lg: "md" }}
        bg={useColorModeValue("white", "gray.900")}
        boxShadow={"2xl"}
        padding={4}
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "center", md: "normal" }}
      >
        <Flex alignItems="center">
          <Image objectFit="contain" h="100%" src={anime.picture} />
        </Flex>
        <VStack
          flex={1}
          justifyContent="flex-start"
          alignItems="stretch"
          p={1}
          pt={2}
        >
          <Heading fontSize={"2xl"} fontFamily={"body"}>
            <Link href={getUrlOfAnime()}>{anime.title}</Link>
          </Heading>
          <AnimeTopic>
            <AnimeTopicHeader icon={<FaTag />}>Tags</AnimeTopicHeader>
            <Popover>
              <PopoverTrigger>
                <Box>
                  <TagList tags={anime.tags} limit={queriedTagLimit} />
                  {anime.tags?.length >= queriedTagLimit && <Text>...</Text>}
                </Box>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>All Tags</PopoverHeader>
                <PopoverBody>
                  <TagList tags={anime.tags} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </AnimeTopic>
          <AnimeTopic>
            <AnimeTopicHeader icon={<FaLink />}>Links</AnimeTopicHeader>
            <HStack p={2} justifyContent={"flex-start"} flexWrap="wrap">
              {anime.sources.map((source) => (
                <LinkBox key={source}>
                  <LinkOverlay href={source} isExternal>
                    <Badge color={useColorModeValue("blue.500", "blue.200")}>
                      {getProvider(anime, source)}
                    </Badge>
                  </LinkOverlay>
                </LinkBox>
              ))}
            </HStack>
          </AnimeTopic>
        </VStack>
      </Stack>
    </LinkBox>
  );
};

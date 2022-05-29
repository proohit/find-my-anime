import {
  Badge,
  Box,
  BoxProps,
  Center,
  Flex,
  Heading,
  HeadingProps,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Anime, getProvider, Provider } from "@find-my-anime/shared";
import { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "./Api";
import { TagList } from "./TagList";
import { useQuery } from "./useQuery";

const AnimePage: FC = () => {
  const params = useParams();
  const query = useQuery();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const provider = useMemo(() => {
    const queryProvider = query.get("provider") as Provider | undefined;
    if (!queryProvider) return undefined;
    if (Object.values(Provider).includes(queryProvider)) {
      return queryProvider;
    }
    return undefined;
  }, [query.has("provider")]);

  useEffect(() => {
    if (params.id) {
      setIsLoading(true);
      Api.queryAnime(params.id, undefined, provider)
        .then((animes) => {
          if (animes?.length > 0) {
            setAnime(animes[0]);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [params.id, provider]);

  return (
    <VStack mt="10" spacing={8}>
      {isLoading && <Spinner />}
      {anime && (
        <Center py={6}>
          <Stack
            borderWidth="1px"
            borderRadius="lg"
            direction={{ base: "column", lg: "row" }}
            maxH={"xl"}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            padding={4}
          >
            <Flex flex={1} justifyContent="center" alignItems="center">
              <Image
                objectFit="contain"
                boxSize={{ sm: "50%", md: "100%" }}
                src={anime.picture}
              />
            </Flex>
            <VStack
              flex={1}
              justifyContent="center"
              alignItems="center"
              p={1}
              pt={2}
            >
              <Heading fontSize={"2xl"} fontFamily={"body"}>
                {anime.title}
              </Heading>
              <AnimeTopic>
                <AnimeTopicHeader>Alternative titles</AnimeTopicHeader>
                <HStack p={2} justifyContent={"flex-start"} flexWrap="wrap">
                  {anime.synonyms.map((synonym) => (
                    <Text fontSize={["sm", "md", "lg", "xl"]} textAlign="left">
                      {synonym}
                    </Text>
                  ))}
                </HStack>
              </AnimeTopic>
              <AnimeTopic>
                <AnimeTopicHeader>Tags</AnimeTopicHeader>
                <TagList tags={anime.tags} />
              </AnimeTopic>
              <AnimeTopic>
                <AnimeTopicHeader>Links</AnimeTopicHeader>
                <HStack p={2} justifyContent={"flex-start"} flexWrap="wrap">
                  {anime.sources.map((source) => (
                    <LinkBox key={source}>
                      <LinkOverlay href={source} isExternal>
                        <Badge
                          color={useColorModeValue("blue.500", "blue.200")}
                        >
                          {getProvider(anime, source)}
                        </Badge>
                      </LinkOverlay>
                    </LinkBox>
                  ))}
                </HStack>
              </AnimeTopic>
            </VStack>
          </Stack>
        </Center>
      )}
    </VStack>
  );
};
export default AnimePage;

const AnimeTopic: FC<PropsWithChildren<BoxProps>> = (props) => {
  const { children, ...rest } = props;
  return <Box {...rest}>{children}</Box>;
};

const AnimeTopicHeader: FC<PropsWithChildren<HeadingProps>> = (props) => {
  const { children, ...rest } = props;
  return (
    <Heading variant="h6" fontSize="md" textAlign="left" {...rest}>
      {children}
    </Heading>
  );
};

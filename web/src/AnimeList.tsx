import {
  Badge,
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { getProvider } from "@shared/anime/sources";
import { Anime } from "@shared/interfaces/AnimeDb";
import { FC } from "react";

interface Props {
  animes: Anime[];
}

const AnimeList: FC<Props> = ({ animes }) => {
  return (
    <Box w="100%">
      {animes.map((anime) => (
        <Center py={6}>
          <Stack
            borderWidth="1px"
            borderRadius="lg"
            w={{ md: "100%" }}
            direction={{ base: "column", md: "row" }}
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
              w="100%"
            >
              <Heading fontSize={"2xl"} fontFamily={"body"}>
                {anime.title}
              </Heading>
              <HStack
                p={2}
                justifyContent={"flex-start"}
                flexWrap="wrap"
                gap={1}
              >
                {anime.tags.slice(0, 9).map((tag) => (
                  <Badge
                    px={2}
                    py={1}
                    bg={useColorModeValue("gray.50", "gray.800")}
                    fontWeight={"400"}
                  >
                    {tag}
                  </Badge>
                ))}
              </HStack>

              <HStack p={2} justifyContent={"flex-start"} flexWrap="wrap">
                {anime.sources.map((source) => (
                  <LinkBox>
                    <LinkOverlay href={source} isExternal>
                      <Badge color={useColorModeValue("blue.500", "blue.200")}>
                        {getProvider(anime, source)}
                      </Badge>
                    </LinkOverlay>
                  </LinkBox>
                ))}
              </HStack>
            </VStack>
          </Stack>
        </Center>
      ))}
    </Box>
  );
};

export default AnimeList;

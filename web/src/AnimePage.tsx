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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Anime, getProvider } from "@find-my-anime/shared";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "./Api";
import { TagList } from "./TagList";

const AnimePage: FC = () => {
  const params = useParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (params.id) {
      setIsLoading(true);
      Api.queryAnime(params.id)
        .then((animes) => {
          if (animes?.length > 0) {
            setAnime(animes[0]);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [params.id]);
  return (
    <Box textAlign="center" fontSize="xl">
      <VStack
        spacing={8}
        w={["xs", "sm", "lg", "xl"]}
        ml="auto"
        mr="auto"
        mt="10"
      >
        {isLoading && <Spinner />}
        {anime && (
          <Center py={6} key={anime.title}>
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
              >
                <Heading fontSize={"2xl"} fontFamily={"body"}>
                  {anime.title}
                </Heading>
                <Popover>
                  <PopoverTrigger>
                    <Box>
                      <TagList tags={anime.tags} limit={10} />
                      {anime.tags?.length >= 10 && <Text>...</Text>}
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
              </VStack>
            </Stack>
          </Center>
        )}
      </VStack>
    </Box>
  );
};
export default AnimePage;

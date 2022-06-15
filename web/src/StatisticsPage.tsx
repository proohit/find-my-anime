import {
  Box,
  Divider,
  Heading,
  List,
  ListItem,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { DbStatistics } from "@find-my-anime/shared/interfaces/DbStatistics";
import { FC, ReactNode, useEffect, useState } from "react";
import Api from "./Api";

const StatisticsPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState<DbStatistics | undefined>(
    undefined
  );

  useEffect(() => {
    setIsLoading(true);
    Api.getStats().then((stats) => {
      setStatistics(stats);
      setIsLoading(false);
    });
  }, []);

  return (
    <VStack spacing={8} mt="10">
      {statistics && (
        <>
          <StatisticsTopic heading="Database status">
            <StatisticsSubTopic heading="Last download date">
              <Text>
                {new Date(statistics.lastDownloaded).toLocaleString()}
              </Text>
            </StatisticsSubTopic>
          </StatisticsTopic>
          <StatisticsTopic heading="Anime stats">
            <StatisticsSubTopic heading="Total count of anime:">
              <Text>{statistics.anime.count}</Text>
            </StatisticsSubTopic>
            <StatisticsSubTopic heading="Count of anime by season">
              <Box borderWidth="1px" borderRadius="lg">
                <List maxH={["sm", "md"]} overflow="auto">
                  {Object.entries(statistics.anime.seasons).map(
                    ([season, count]) => (
                      <ListItem key={season}>
                        {season} ({count})
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            </StatisticsSubTopic>
          </StatisticsTopic>
          <StatisticsTopic heading="Tags">
            <StatisticsSubTopic heading="Total count of tags:">
              <Text>{statistics.tags.count}</Text>
            </StatisticsSubTopic>
            <StatisticsSubTopic heading="Most common tags:">
              <Box borderWidth="1px" borderRadius="lg">
                <List maxH={["sm", "md"]} overflow="auto">
                  {Object.entries(statistics.tags.mostUsedTags).map(
                    ([tag, count]) => (
                      <ListItem key={tag}>
                        {tag} ({count})
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            </StatisticsSubTopic>
          </StatisticsTopic>
        </>
      )}
      {isLoading && <Spinner />}
    </VStack>
  );
};

type TopicProps = {
  children: ReactNode;
  heading: string;
};

const StatisticsTopic: FC<TopicProps> = (props) => {
  const { children, heading } = props;
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      w="100%"
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"sm"}
      p={4}
    >
      <Heading as="h5" size="md" textAlign="left">
        {heading}
      </Heading>
      <Divider my={4} />
      {children}
    </Box>
  );
};

const StatisticsSubTopic: FC<TopicProps> = ({ children, heading }) => {
  return (
    <Box my={2}>
      <Text
        fontWeight={"semibold"}
        fontSize={["md", "lg"]}
        textAlign="left"
        m={2}
      >
        {heading}
      </Text>
      {children}
    </Box>
  );
};

export default StatisticsPage;

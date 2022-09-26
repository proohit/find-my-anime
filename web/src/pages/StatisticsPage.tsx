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
import { TelemetrySource } from "@find-my-anime/shared/interfaces/AnimeDb";
import { DbStatistics } from "@find-my-anime/shared/interfaces/DbStatistics";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import Api from "../Api";

const StatisticsPage: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState<DbStatistics | undefined>(
    undefined
  );

  const apiStats = useMemo(
    () => ({
      [TelemetrySource.App]: statistics?.telemetry.filter(
        (data) => data.source === TelemetrySource.App
      ),
      [TelemetrySource.External]: statistics?.telemetry.filter(
        (data) => data.source === TelemetrySource.External
      ),
      [TelemetrySource.Anonymous]: statistics?.telemetry.filter(
        (data) => data.source === TelemetrySource.Anonymous
      ),
    }),
    [statistics]
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
          <StatisticsTopic heading="App Stats">
            {apiStats[TelemetrySource.App]?.length! > 0 && (
              <StatisticsSubTopic
                heading="Requests by App"
                description="App requests were made by the web app"
              >
                <StatisticsList
                  items={apiStats[TelemetrySource.App]!.map((data) => ({
                    key: data.data,
                    value: `${data.data} (${data.count})`,
                  }))}
                />
              </StatisticsSubTopic>
            )}
            {apiStats[TelemetrySource.External]?.length! > 0 && (
              <StatisticsSubTopic
                heading="Requests by External"
                description="External requests were made by some other app"
              >
                <StatisticsList
                  items={apiStats[TelemetrySource.External]!.map((data) => ({
                    key: data.data,
                    value: `${data.data} (${data.count})`,
                  }))}
                />
              </StatisticsSubTopic>
            )}
            {apiStats[TelemetrySource.Anonymous]?.length! > 0 && (
              <StatisticsSubTopic
                heading="Requests by Anonymous"
                description="Anonymous requests were made by an unknown source"
              >
                <StatisticsList
                  items={apiStats[TelemetrySource.Anonymous]!.map((data) => ({
                    key: data.data,
                    value: `${data.data} (${data.count})`,
                  }))}
                />
              </StatisticsSubTopic>
            )}
          </StatisticsTopic>
          <StatisticsTopic heading="Anime stats">
            <StatisticsSubTopic heading="Total count of anime:">
              <Text>{statistics.anime.count}</Text>
            </StatisticsSubTopic>
            <StatisticsSubTopic heading="Count of anime by season">
              <StatisticsList
                items={Object.entries(statistics.anime.seasons).map(
                  ([season, count]) => ({
                    key: season,
                    value: `${season} (${count})`,
                  })
                )}
              />
            </StatisticsSubTopic>
          </StatisticsTopic>
          <StatisticsTopic heading="Tags">
            <StatisticsSubTopic heading="Total count of tags:">
              <Text>{statistics.tags.count}</Text>
            </StatisticsSubTopic>
            <StatisticsSubTopic heading="Most common tags:">
              <StatisticsList
                items={Object.entries(statistics.tags.mostUsedTags).map(
                  ([tag, count]) => ({
                    key: tag,
                    value: `${tag} (${count})`,
                  })
                )}
              />
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
  description?: string;
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

const StatisticsSubTopic: FC<TopicProps> = ({
  children,
  heading,
  description,
}) => {
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
      {description && (
        <Text fontSize={["md"]} textAlign="left" m={2}>
          {description}
        </Text>
      )}
      {children}
    </Box>
  );
};

const StatisticsList: FC<{ items: { key: string; value: string }[] }> = ({
  items,
}) => {
  return (
    <Box borderWidth="1px" borderRadius="lg">
      <List maxH={["sm", "md"]} overflow="auto">
        {items.map((item) => (
          <ListItem key={item.key}>{item.value}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default StatisticsPage;

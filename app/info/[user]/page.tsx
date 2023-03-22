"use client";

// TODO
// has error on MYResponsivePie component where the component keeps refreshing

import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  ListItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import useSWR from "swr";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  SetStateAction,
  Suspense,
  use,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { lightGreen, purple, red } from "@mui/material/colors";
import { ResponsivePie } from "@nivo/pie";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const switchColor = (type: string) => {
  switch (type) {
    case "PushEvent" || "CreateEvent" || "CommitCommentEvent":
      return lightGreen[500];
    case "DeleteEvent":
      return red[500];
    case "PullRequestEvent" || "PullRequestReviewCommentEvent":
      return purple[200];
    case "IssuesEvent" || "IssueCommentEvent" || "ReleaseEvent":
    case "WatchEvent" || "ForkEvent":
      return "yellow";
    default:
      return "grey";
  }
};

const fetcher = (args: string) => {
  return fetch(args).then((res) => res.json());
};

export default function Info({ params }: { params: { user: string } }) {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  // Used useSWR instead of use() to avoid re-rendering
  const { data: userInfo = [], error: userInfoError } = useSWR(
    `https://api.github.com/users/${params.user}`,
    fetcher
  );
  const { data: userRepo = [], error: userRepoError } = useSWR(
    `https://api.github.com/users/${params.user}/repos`,
    fetcher
  );

  const { data: userPublicEvents = [], error: userPublicEventsError } = useSWR(
    `https://api.github.com/users/${params.user}/events/public`,
    fetcher
  );

  // creating data using userPublicEvents data
  // count by event type
  const [eventData, setEventData] = useState([]);
  let pieData = [];

  useEffect(() => {
    const eventCount = userPublicEvents.reduce((acc, event) => {
      const { type } = event;
      if (type in acc) {
        acc[type]++;
      } else {
        acc[type] = 1;
      }
      return acc;
    }, {});
    pieData = Object.keys(eventCount).map((key) => ({
      id: key,
      label: key,
      value: eventCount[key],
    }));
    setEventData(pieData);
  }, [userPublicEvents]);

  const MyResponsivePie = ({ data: pieData }) => {
    return (
      <ResponsivePie
        data={pieData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: "nivo" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextColor="#333333"
        radialLabelsLinkColor={{ from: "color" }}
        sliceLabelsSkipAngle={10}
        sliceLabelsTextColor="#333333"
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    );
  };

  const [repoLanguage, setRepoLanguage] = useState({});
  useEffect(() => {
    // use map to loop through array of repos and use SWR to fetch data
    const promises = userRepo.map((repo: { languages_url: string }) =>
      fetcher(repo.languages_url)
    );
    console.log(promises);
  }, [userRepo]);

  const setFormData = (e: { target: { value: SetStateAction<string> } }) => {
    setUserName(e.target.value);
  };

  // sends username to info/[user] page using query params
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push(`/info/${userName}`);
  };

  return (
    <>
      <section>
        <Suspense fallback={<Loading />}>
          {/* Appbar */}
          <AppBar position="static">
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  GitStats
                </Typography>
                <Box>
                  <FormControl onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Enter a GitHub username to search....."
                      variant="filled"
                      onChange={setFormData}
                    />
                    {/* <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  <SendIcon />
                </Button> */}
                  </FormControl>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>

          {/* Contents */}
          {/* Sidebar */}
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={4} md={4}>
                <Item>
                  <h2>{userInfo.login}</h2>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      letterSpacing: ".3rem",
                      textDecoration: "none",
                      p: 2,
                    }}
                  >
                    {userInfo.name}
                  </Typography>
                  <Divider />
                  <p>Joined Github: {userInfo.created_at}</p>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <p>Followers: {userInfo.followers}</p>
                      <p>Following: {userInfo.following}</p>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <p>Public Repos: {userInfo.public_repos}</p>
                      <p>Public Gists: {userInfo.public_gists}</p>
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                    }}
                    onClick={() => {
                      window.open(userInfo.html_url, "_blank");
                    }}
                  >
                    GitHub Page
                  </Button>
                </Item>
              </Grid>

              {/* Overall Activities */}
              <Grid item xs={8} md={8}>
                <Item>Recent 30 Activities Statistic</Item>
                <Divider />
                {/* Pie Chart for recent 30 activities */}
                <MyResponsivePie data={eventData} />
              </Grid>
              <Grid item xs={4} md={4}>
                <Item>
                  <h4>Active Repos</h4>
                  <p>All Repos</p>
                  <Divider />
                  {userRepo.map(
                    (repo: {
                      id: Key;
                      html_url: string | URL;
                      name: string;
                      language: string;
                    }) => (
                      <ListItem
                        key={repo.id}
                        onClick={() => {
                          window.open(repo.html_url, "_blank");
                        }}
                      >
                        <Card sx={{ width: 345 }}>
                          <CardContent>
                            <Typography>
                              {repo.name}{" "}
                              {repo.language !== null
                                ? repo.language
                                : "Does not exist"}
                            </Typography>
                            {/* data section for each prject */}
                          </CardContent>
                        </Card>
                      </ListItem>
                    )
                  )}
                </Item>
              </Grid>

              {/* Recent Activities */}
              <Grid item xs={8} md={8}>
                <Item>Details of Recent Activities</Item>
                {userPublicEvents.map(
                  (event: {
                    id: Key;
                    type: string;
                    created_at: string;
                    repo: {
                      name: string;
                    };
                  }) => (
                    <ListItem
                      key={event.id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        p: 2,
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        mb: 2,
                        backgroundColor: switchColor(event.type),
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => {}}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {event.type}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {event.repo.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 400 }}>
                        {event.created_at}
                      </Typography>
                    </ListItem>
                  )
                )}
              </Grid>
            </Grid>
          </Container>
        </Suspense>
      </section>
    </>
  );
}

import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const DashboardStats = ({ files = [], chatCount = 0 }) => {

  const documentFiles = files.filter((file) => {
    const name = file.fileName?.toLowerCase() || "";

    return (
      name.endsWith(".pdf") ||
      name.endsWith(".docx") ||
      name.endsWith(".xls") ||
      name.endsWith(".xlsx")
    );
  }).length;

  const audioFiles = files.filter((file) => {
    const name = file.fileName?.toLowerCase() || "";

    return (
      name.endsWith(".mp3") ||
      name.endsWith(".wav") ||
      name.endsWith(".aac") ||
      name.endsWith(".m4a")
    );
  }).length;

  const videoFiles = files.filter((file) => {
    const name = file.fileName?.toLowerCase() || "";

    return (
      name.endsWith(".mp4") ||
      name.endsWith(".avi") ||
      name.endsWith(".mov") ||
      name.endsWith(".mkv")
    );
  }).length;

  const cards = [
    {
      title: "Documents",
      value: documentFiles,
      color: "#1976d2",
      icon: <DescriptionIcon sx={{ fontSize: 45 }} />,
    },
    {
      title: "Audio Files",
      value: audioFiles,
      color: "#7b1fa2",
      icon: <AudiotrackIcon sx={{ fontSize: 45 }} />,
    },
    {
      title: "Video Files",
      value: videoFiles,
      color: "#ef6c00",
      icon: <VideoLibraryIcon sx={{ fontSize: 45 }} />,
    },
    {
      title: "AI Questions",
      value: chatCount,
      color: "#2e7d32",
      icon: <SmartToyIcon sx={{ fontSize: 45 }} />,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>

      {cards.map((card) => (

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={card.title}
        >

          <Card
            elevation={6}
            sx={{
              borderRadius: 4,
              transition: ".3s",

              "&:hover": {
                transform: "translateY(-6px)",
              },
            }}
          >

            <CardContent>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >

                <div>

                  <Typography
                    color="text.secondary"
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h3"
                    fontWeight="bold"
                  >
                    {card.value}
                  </Typography>

                </div>

                <Stack
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    bgcolor: card.color,
                    color: "#fff",
                  }}
                >
                  {card.icon}
                </Stack>

              </Stack>

            </CardContent>

          </Card>

        </Grid>

      ))}

    </Grid>
  );

};

export default DashboardStats;
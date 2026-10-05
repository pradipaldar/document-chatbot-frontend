import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Navbar = () => {

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {

    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  return (

    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background:
          "linear-gradient(90deg,#0d47a1,#1565c0,#1976d2)",
      }}
    >

      <Toolbar>

        {/* Left Section */}

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flex={1}
        >

          <Avatar
            sx={{
              bgcolor: "#ffffff",
              color: "#1976d2",
              width: 55,
              height: 55,
            }}
          >
            <SmartToyIcon fontSize="large" />
          </Avatar>

          <Box>

            <Typography
              variant="h5"
              fontWeight="bold"
              color="white"
            >
              AI Multi-Document Assistant
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,.85)",
              }}
            >
              PDF • Word • Excel • Audio • Video • Voice AI
            </Typography>

          </Box>

        </Stack>

        {/* Center */}

        <Stack
          direction="row"
          spacing={2}
          mr={3}
        >

          <Chip
            icon={<CalendarMonthIcon />}
            label={dateTime.toLocaleDateString()}
            sx={{
              bgcolor: "#ffffff",
              fontWeight: "bold",
            }}
          />

          <Chip
            icon={<AccessTimeIcon />}
            label={dateTime.toLocaleTimeString()}
            sx={{
              bgcolor: "#ffffff",
              fontWeight: "bold",
            }}
          />

        </Stack>

        {/* Right */}

        <Avatar
          src="/idbi-logo.jpg"
          variant="rounded"
          sx={{
            width: 65,
            height: 65,
            bgcolor: "#ffffff",
            p: 0.5,
          }}
        />

      </Toolbar>

    </AppBar>

  );

};

export default Navbar;
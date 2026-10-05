import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

const Loader = ({
  text = "Loading..."
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        py: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress
        size={55}
        thickness={4}
      />

      <Typography
        variant="body1"
        mt={2}
        color="text.secondary"
      >
        {text}
      </Typography>
    </Box>
  );
};

export default Loader;
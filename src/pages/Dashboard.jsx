import React, { useState } from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";

import Navbar from "../components/Navbar";
import UploadCard from "../components/UploadCard";
import ChatWindow from "../components/ChatWindow";
import FileTable from "../components/FileTable";
import DashboardStats from "../components/DashboardStats";

const Dashboard = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUploadSuccess = (response) => {
    if (!response) return;

    if (Array.isArray(response)) {
      setUploadedFiles((prev) => [...prev, ...response]);
    } else {
      setUploadedFiles((prev) => [...prev, response]);
    }
  };

  return (
    <>
      <Navbar />

      {/* IDBI Logo */}
      <Box
        sx={{
          position: "fixed",
          top: 95,
          right: 25,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <img
          src="/idbi-logo.jpg"
          alt="IDBI Intech"
          style={{
            width: "120px",
            height: "auto",
            background: "rgba(255,255,255,0.85)",
            padding: "6px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          }}
        />
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 5 }}>
        <Typography variant="h4" fontWeight="bold">
          Multi PDF AI Assistant
        </Typography>

        <Typography color="text.secondary" mb={4}>
          <DashboardStats files={uploadedFiles} chatCount={0} />
          Upload your PDF, Word, and Excel documents, then ask questions to get
          AI-powered answers from your uploaded files.
        </Typography>

        <Grid
          container
          spacing={3}
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          {/* Upload Documents Card */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              sx={{
                width: 360, // Smaller upload card
              }}
            >
              <UploadCard onUploadSuccess={handleUploadSuccess} />
            </Box>
          </Grid>

          {/* AI Chat */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                width: 620, // Smaller AI chat box
              }}
            >
              <ChatWindow />
            </Box>
          </Grid>

          {/* Empty space for logo */}
          <Grid size={{ xs: 12, md: 3 }} />
        </Grid>

        {/* Uploaded Files Table */}
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            p: 2,
            borderRadius: 3,
          }}
        >
          <FileTable files={uploadedFiles} />
        </Paper>
      </Container>
    </>
  );
};

export default Dashboard;

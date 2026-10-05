import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import toast from "react-hot-toast";
import {
  speakAnswer,
  playAudio,
} from "../services/api";

const AnswerCard = ({ response }) => {

  if (!response) return null;

  const copyAnswer = async () => {

    try {

      await navigator.clipboard.writeText(
        response.answer
      );

      toast.success("Answer copied");

    } catch {

      toast.error("Copy failed");

    }

  };

  const playAnswer = async () => {

    try {

      const blob =
        await speakAnswer(response.answer);

      playAudio(blob);

    } catch {

      toast.error("Unable to play audio");

    }

  };

  return (

    <Card
      elevation={3}
      sx={{
        mt: 2,
        borderRadius: 3,
      }}
    >

      <CardContent>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            AI Answer
          </Typography>

          <Stack
            direction="row"
            spacing={1}
          >

            <Tooltip title="Copy">

              <IconButton
                onClick={copyAnswer}
              >
                <ContentCopyIcon />
              </IconButton>

            </Tooltip>

            <Tooltip title="Listen">

              <IconButton
                onClick={playAnswer}
              >
                <VolumeUpIcon />
              </IconButton>

            </Tooltip>

          </Stack>

        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
          }}
        >
          {response.answer}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
        >

          <Chip
            color={
              response.found
                ? "success"
                : "error"
            }
            icon={
              response.found
                ? <CheckCircleIcon />
                : <ErrorIcon />
            }
            label={
              response.found
                ? "Answer Found"
                : "Answer Not Found"
            }
          />

          {response.fileName && (

            <Chip
              icon={<DescriptionIcon />}
              label={response.fileName}
              color="primary"
              variant="outlined"
            />

          )}

          {response.pageNumber > 0 && (

            <Chip
              label={
                "Page : " +
                response.pageNumber
              }
              color="secondary"
              variant="outlined"
            />

          )}

        </Stack>

      </CardContent>

    </Card>

  );

};

export default AnswerCard;
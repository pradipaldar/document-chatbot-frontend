import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from "@mui/icons-material/StopCircle";

import toast from "react-hot-toast";
import VoiceRecorder from "./VoiceRecorder";

const ChatInput = ({ question, setQuestion, onSend, loading }) => {
  const [recording, setRecording] = useState(false);

  // ==========================================
  // Send Message
  // ==========================================
  const sendMessage = () => {
    if (loading) return;

    if (!question.trim()) {
      toast.error("Please enter your question.");

      return;
    }

    // ChatWindow already reads the state,
    // so just call onSend()
    onSend(question);
  };

  // ==========================================
  // Start Recording
  // ==========================================
  const startRecording = () => {
    if (loading) return;

    setQuestion("");

    setRecording(true);
  };

  // ==========================================
  // Stop Recording
  // ==========================================
  const stopRecording = () => {
    setRecording(false);
  };

  // ==========================================
  // Voice Recognition Result
  // ==========================================
  const handleVoiceResponse = (result) => {
    if (!result) return;

    if (result.question) {
      setQuestion(result.question);
    }

    if (result.final) {
      setRecording(false);

      setQuestion(result.question);

      // Allow state update first
      setTimeout(() => {
        onSend(result.question);
      }, 300);
    }
  };

  return (
    <>
      <Box mt={2}>
        <TextField
          fullWidth
          value={question}
          disabled={loading}
          placeholder={
            recording
              ? "🎤 Listening..."
              : "Ask anything about your uploaded documents..."
          }
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              sendMessage();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {loading && <CircularProgress size={22} sx={{ mr: 1 }} />}

                <Tooltip
                  title={recording ? "Stop Recording" : "Start Voice Search"}
                >
                  <IconButton
                    color={recording ? "error" : "primary"}
                    disabled={loading}
                    onClick={() => {
                      if (recording) {
                        stopRecording();
                      } else {
                        startRecording();
                      }
                    }}
                  >
                    {recording ? <StopCircleIcon /> : <MicIcon />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Send">
                  <IconButton
                    color="primary"
                    disabled={loading}
                    onClick={sendMessage}
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "35px",
              background: "#ffffff",
            },
          }}
        />
      </Box>

      {recording && (
        <VoiceRecorder
          recording={recording}
          onVoiceResponse={handleVoiceResponse}
          onStop={stopRecording}
        />
      )}
    </>
  );
};

export default ChatInput;

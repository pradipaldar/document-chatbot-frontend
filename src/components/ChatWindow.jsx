import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

import Loader from "./Loader";
import AnswerCard from "./AnswerCard";
import ChatInput from "./ChatInput";

import {
  askQuestion,
  playAudio,
  speakAnswer,
} from "../services/api";

import toast from "react-hot-toast";

const SESSION_ID = "session123";

const ChatWindow = () => {

  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([]);

  const [response, setResponse] = useState(null);

  const messagesEndRef = useRef(null);

  // ===========================================
  // Auto Scroll
  // ===========================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // ===========================================
  // Current Time
  // ===========================================

  const getTime = () => {

    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  };

  // ===========================================
// Send Question
// ===========================================

const sendQuestion = async (text = question) => {

  if (!text || !text.trim()) {

    toast.error("Please enter your question.");

    return;

  }

  const userQuestion = text.trim();

  // Show user message
  setMessages((prev) => [

    ...prev,

    {
      type: "user",
      text: userQuestion,
      time: getTime(),
    },

  ]);

  setQuestion("");

  try {

    setLoading(true);

    const result = await askQuestion(
      SESSION_ID,
      userQuestion
    );

    setResponse(result);

    // Show AI message
    setMessages((prev) => [

      ...prev,

      {
        type: "ai",
        text: result.answer,
        fileName: result.fileName,
        pageNumber: result.pageNumber,
        found: result.found,
        time: getTime(),
      },

    ]);

    // Speak AI answer
    try {

      const audioBlob = await speakAnswer(result.answer);

      playAudio(audioBlob);

    } catch (err) {

      console.error("Unable to play voice.", err);

    }

  } catch (err) {

    console.error(err);

    toast.error("Unable to get AI response.");

  } finally {

    setLoading(false);

  }

};

  // ===========================================
  // Voice Response
  // ===========================================

  const handleVoiceResponse = async (
    result
  ) => {

    if (!result) {

      toast.error(
        "Voice processing failed."
      );

      return;

    }

    setQuestion("");

    setMessages((prev) => [

      ...prev,

      {
        type: "user",
        text: result.question,
        time: getTime(),
      },

      {
        type: "ai",
        text: result.answer,
        fileName: result.fileName,
        pageNumber: result.pageNumber,
        found: result.found,
        time: getTime(),
      },

    ]);

    setResponse(result);

    if (result.audio) {

      try {

        const bytes = Uint8Array.from(

          atob(result.audio),

          (c) => c.charCodeAt(0)

        );

        const blob = new Blob(
          [bytes],
          {
            type: "audio/mpeg",
          }
        );

        playAudio(blob);

      } catch (e) {

        console.log(
          "Unable to play returned audio."
        );

      }

    } else {

      try {

        const blob =
          await speakAnswer(result.answer);

        playAudio(blob);

      } catch (e) {

        console.log(e);

      }

    }

    toast.success(
      "Voice processed successfully."
    );

  };

   return (
    <Card
      elevation={8}
      sx={{
        borderRadius: 4,
        background: "rgba(255,255,255,.70)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,.25)",
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
        >
          🤖 AI Document Chat
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Chat Area */}

        <Box
          sx={{
            height: 450,
            overflowY: "auto",
            p: 2,
            borderRadius: 3,
            background: "#f7f9fc",
          }}
        >

          {messages.length === 0 && (

            <Typography
              align="center"
              color="text.secondary"
              mt={18}
            >
              Upload documents and ask anything...
            </Typography>

          )}

          <Stack spacing={2}>

            {messages.map((msg, index) => (

              <Box
                key={index}
                display="flex"
                justifyContent={
                  msg.type === "user"
                    ? "flex-end"
                    : "flex-start"
                }
              >

                <Box
                  sx={{
                    maxWidth: "75%",
                    p: 2,
                    borderRadius: 3,
                    boxShadow: 2,
                    display: "flex",
                    flexDirection: "column",
                    background:
                      msg.type === "user"
                        ? "#1976d2"
                        : "#ffffff",
                    color:
                      msg.type === "user"
                        ? "#ffffff"
                        : "#000000",
                  }}
                >

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >

                    {msg.type === "user" ? (
                      <PersonIcon />
                    ) : (
                      <SmartToyIcon
                        color="primary"
                      />
                    )}

                    <Typography
                      sx={{
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.text}
                    </Typography>

                  </Box>

                  {msg.type === "ai" &&
                    msg.fileName && (

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={1}
                      >
                        📄 {msg.fileName}
                        {msg.pageNumber
                          ? ` | Page ${msg.pageNumber}`
                          : ""}
                      </Typography>

                  )}

                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      opacity: 0.7,
                      textAlign: "right",
                    }}
                  >
                    {msg.time}
                  </Typography>

                </Box>

              </Box>

            ))}

            {loading && (

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                py={3}
              >

                <CircularProgress
                  size={28}
                />

                <Typography ml={2}>
                  AI is generating answer...
                </Typography>

              </Box>

            )}

            <div ref={messagesEndRef} />

          </Stack>

        </Box>

        <ChatInput
          question={question}
          setQuestion={setQuestion}
          onSend={sendQuestion}
          onVoiceResponse={handleVoiceResponse}
          loading={loading}
        />

        <Box mt={3}>
          <AnswerCard
            response={response}
          />
        </Box>

      </CardContent>

    </Card>
  );

};

export default ChatWindow;
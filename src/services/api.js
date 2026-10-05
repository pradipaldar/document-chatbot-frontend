import axios from "axios";

// =====================================================
// Axios Instance
// =====================================================

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 600000,
});

// =====================================================
// Upload Multiple Files
// =====================================================

export const uploadDocuments = async (files, onProgress) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        if (onProgress) {
          onProgress(percent);
        }
      },
    });

    return response.data;
  } catch (error) {
    console.error("Upload Error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Upload failed."
    );
  }
};

// =====================================================
// Get Processing Status
// =====================================================

export const getDocumentStatus = async (documentId) => {
  try {
    const response = await api.get(
      `/documents/status/${documentId}`
    );

    return response.data;
  } catch (error) {
    console.error("Status Error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to fetch document status."
    );
  }
};

// =====================================================
// Normal Chat
// =====================================================

export const askQuestion = async (sessionId, question) => {
  try {
    const response = await api.post("/chat/ask", {
      sessionId,
      question,
    });

    return response.data;
  } catch (error) {
    console.error("Chat Error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Chat request failed."
    );
  }
};

// =====================================================
// Streaming Chat
// =====================================================

export const streamChat = async (
  sessionId,
  question,
  onMessage
) => {
  const response = await fetch(
    "http://localhost:8080/api/chat/stream",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        sessionId,
        question,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Streaming failed.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value);

    if (onMessage) {
      onMessage(chunk);
    }
  }
};

// =====================================================
// Voice Chat
// =====================================================

export const askVoiceQuestion = async (
  sessionId,
  audioFile
) => {
  try {
    const formData = new FormData();

    formData.append("audio", audioFile);
    formData.append("sessionId", sessionId);

    const response = await api.post(
      "/voice/ask",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Voice Chat Error:", error);

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Voice chat failed."
    );
  }
};

// =====================================================
// Text To Speech
// =====================================================

export const speakAnswer = async (answer) => {

  try {

    const response = await axios.post(
      "http://localhost:8080/api/voice/speak",
      answer,
      {
        headers: {
          "Content-Type": "text/plain",
          "Accept": "audio/mpeg",
        },
        responseType: "blob",
      }
    );

    return response.data;

  } catch (error) {

    console.log("STATUS:", error.response?.status);
    console.log("HEADERS:", error.response?.headers);
    console.log("BACKEND RESPONSE:", error.response?.data);
    console.log("FULL ERROR:", error);

    throw error;
  }
};

// =====================================================
// Audio Playback
// =====================================================

let currentAudio = null;
let currentUrl = null;

export const playAudio = (audioBlob) => {

  try {

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }

    currentUrl = URL.createObjectURL(audioBlob);

    currentAudio = new Audio(currentUrl);

    currentAudio.play();

    currentAudio.onended = () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
        currentUrl = null;
      }
    };

  } catch (error) {
    console.error("Audio Playback Error:", error);
  }
};

// =====================================================
// Stop Audio
// =====================================================

export const stopAudio = () => {

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  if (currentUrl) {
    URL.revokeObjectURL(currentUrl);
    currentUrl = null;
  }
};

export default api;
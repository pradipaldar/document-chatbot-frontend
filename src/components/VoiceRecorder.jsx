import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const VoiceRecorder = ({
  recording,
  onVoiceResponse,
  onStop,
}) => {

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const stoppedRef = useRef(false);

  useEffect(() => {

    if (!SpeechRecognition) {
      toast.error(
        "Speech Recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    transcriptRef.current = "";
    stoppedRef.current = false;

    //----------------------------------
    // Recording Started
    //----------------------------------
    recognition.onstart = () => {

      console.log("🎤 Recording Started");

    };

    //----------------------------------
    // Live Speech With AI
    //----------------------------------
    recognition.onresult = (event) => {

      let transcript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript + " ";
      }

      transcript = transcript.trim();

      transcriptRef.current = transcript;

      const isFinal =
        event.results[event.results.length - 1].isFinal;

      onVoiceResponse({
        question: transcript,
        final: isFinal,
      });

      if (isFinal) {

        try {
          recognition.stop();
        } catch (e) {
          console.log(e);
        }

      }

    };

    //----------------------------------
    // Error
    //----------------------------------
    recognition.onerror = (event) => {

      console.log("Speech Error :", event.error);

      if (
        event.error !== "aborted" &&
        event.error !== "no-speech"
      ) {

        toast.error(
          "Voice Error : " + event.error
        );

      }

    };

    //----------------------------------
    // Recording Finished
    //----------------------------------
    recognition.onend = () => {

      console.log("🎤 Recording Finished");

      if (stoppedRef.current) {
        return;
      }

      stoppedRef.current = true;

      if (
        transcriptRef.current &&
        transcriptRef.current.trim().length > 0
      ) {

        onVoiceResponse({
          question: transcriptRef.current.trim(),
          final: true,
        });

      }

      onStop();

    };

    //----------------------------------
    // Start Recording
    //----------------------------------
    if (recording) {

      try {

        recognition.start();

      } catch (e) {

        console.log(e);

      }

    }

    //----------------------------------
    // Cleanup
    //----------------------------------
    return () => {

      try {

        recognition.stop();

      } catch (e) {

        console.log(e);

      }

    };

  }, [recording, onVoiceResponse, onStop]);

  return null;

};

export default VoiceRecorder;
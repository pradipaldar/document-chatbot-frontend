import { useEffect, useRef } from "react";

const AudioPlayer = ({ audioBlob }) => {

    const audioRef = useRef(null);

    useEffect(() => {

        if (!audioBlob) {
            return;
        }

        // Stop previous audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        // Create object URL
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);

        audioRef.current = audio;

        audio.play().catch((err) => {
            console.error("Audio playback failed", err);
        });

        return () => {

            if (audioRef.current) {
                audioRef.current.pause();
            }

            URL.revokeObjectURL(audioUrl);

        };

    }, [audioBlob]);

    return null;
};

export default AudioPlayer;
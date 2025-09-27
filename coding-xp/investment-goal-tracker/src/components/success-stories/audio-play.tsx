
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2 } from "lucide-react";
import { getSpeechAudio } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayProps {
  name: string;
  text: string;
}

export function AudioPlay({ name, text }: AudioPlayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handlePlayPause = async () => {
    if (isLoading) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (audioSrc && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      // Check cache first
      let storedAudio = localStorage.getItem(`audio_${name}`);
      if (!storedAudio) {
        storedAudio = await getSpeechAudio(text);
        try {
            localStorage.setItem(`audio_${name}`, storedAudio);
        } catch (e) {
            console.warn("Could not cache audio, storage might be full.");
        }
      }
      setAudioSrc(storedAudio);
    } catch (error) {
      toast({
        title: "Error Generating Audio",
        description: "Could not generate the audio at this time. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handlePlayPause} variant="outline" size="sm">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="mr-2 h-4 w-4" />
        ) : (
          <Play className="mr-2 h-4 w-4" />
        )}
        {isPlaying ? "Pause" : "Listen"}
      </Button>
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onLoadedData={() => {
            if (!isPlaying) {
                audioRef.current?.play();
                setIsPlaying(true);
            }
          }}
          className="hidden"
        />
      )}
    </div>
  );
}

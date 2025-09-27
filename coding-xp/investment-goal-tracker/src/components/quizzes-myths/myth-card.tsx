"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import * as tmImage from '@teachablemachine/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb, RefreshCw, CheckCircle, XCircle, CameraOff } from 'lucide-react';
import { generateMythFlow, incrementMythCounter } from '@/app/actions';
import type { MythOutput } from '@/lib/myth-types';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/SjV2xouYP/";

export function MythCard() {
    const [myth, setMyth] = useState<MythOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [revealed, setRevealed] = useState(false);
    const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [predictionLabel, setPredictionLabel] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const requestRef = useRef<number>();
    const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const gestureHoldRef = useRef<string | null>(null);

    const { toast } = useToast();

    const handleReveal = useCallback(async () => {
        if (revealed) return;
        setRevealed(true);
        await incrementMythCounter();
    }, [revealed]);

    const predict = useCallback(async (modelInstance: tmImage.CustomMobileNet) => {
        if (videoRef.current && videoRef.current.readyState === 4 && !revealed) {
            try {
                const predictions = await modelInstance.predict(videoRef.current);
                
                let bestPrediction = null;
                let highestProb = 0;

                for (const p of predictions) {
                    if (p.probability > highestProb) {
                        highestProb = p.probability;
                        bestPrediction = p;
                    }
                }

                if (bestPrediction) {
                    let gestureName = bestPrediction.className;
                    let emoji = '🤔';
                    if (gestureName === "👍") {
                        emoji = '👍';
                        gestureName = "Thumbs Up";
                    } else if (gestureName === "👎") {
                        emoji = '👎';
                        gestureName = "Thumbs Down";
                    } else if (gestureName === "Neutral") {
                        emoji = '✋';
                        gestureName = "Neutral";
                    }
                    
                    setPredictionLabel(`${emoji} ${gestureName} (${Math.round(highestProb * 100)}%)`);

                    const isConfidentGesture = (gestureName === "Thumbs Up" || gestureName === "Thumbs Down") && highestProb > 0.60;

                    if (isConfidentGesture) {
                        if (gestureHoldRef.current === gestureName) {
                            // Still holding the same gesture, do nothing
                        } else {
                            // New gesture detected, clear old timer and start new one
                            gestureHoldRef.current = gestureName;
                            if (holdTimeoutRef.current) {
                                clearTimeout(holdTimeoutRef.current);
                            }
                            holdTimeoutRef.current = setTimeout(() => {
                                handleReveal();
                            }, 3000); // 3 seconds
                        }
                    } else {
                        // Not a confident gesture, reset timer
                        gestureHoldRef.current = null;
                        if (holdTimeoutRef.current) {
                            clearTimeout(holdTimeoutRef.current);
                            holdTimeoutRef.current = null;
                        }
                    }
                }

            } catch (e) {
                console.error("Prediction error:", e);
            }
        }
        if (!revealed) {
            requestRef.current = requestAnimationFrame(() => predict(modelInstance));
        }
    }, [handleReveal, revealed]);

    const stopPrediction = () => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
        }
        if (holdTimeoutRef.current) {
            clearTimeout(holdTimeoutRef.current);
        }
    }

    const startPrediction = (modelInstance: tmImage.CustomMobileNet) => {
        stopPrediction();
        requestRef.current = requestAnimationFrame(() => predict(modelInstance));
    };

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setHasCameraPermission(true);
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions to use gesture controls.',
            });
          }
        };
        getCameraPermission();
        
        return () => {
             if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
            stopPrediction();
        }
    }, [toast]);
    
    useEffect(() => {
        const loadModel = async () => {
            if (hasCameraPermission) {
                try {
                    const modelURL = `${MODEL_URL}model.json`;
                    const metadataURL = `${MODEL_URL}metadata.json`;
                    const loadedModel = await tmImage.load(modelURL, metadataURL);
                    setModel(loadedModel);
                } catch (e) {
                    console.error("Failed to load model", e);
                    setError("Could not load gesture model. Please check the URL and your connection.");
                }
            }
        };
        loadModel();
    }, [hasCameraPermission]);

    useEffect(() => {
        if (model && myth && !revealed) {
            startPrediction(model);
        } else {
            stopPrediction();
        }
        return () => {
            stopPrediction();
        }
    // predict should not be a dependency here, it causes re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model, myth, revealed]);


    const handleGenerateMyth = async () => {
        setIsLoading(true);
        setError('');
        setMyth(null);
        setRevealed(false);
        setPredictionLabel(null);
        try {
            const result = await generateMythFlow();
            setMyth(result);
        } catch (e) {
            setError('Failed to generate a myth. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Myth Buster</CardTitle>
                <CardDescription>Challenge common financial misconceptions. Show a 👍 or 👎 to the camera to share your opinion!</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px] flex flex-col items-center justify-center gap-4">
                {hasCameraPermission === false && (
                     <Alert variant="destructive">
                        <CameraOff className="h-4 w-4" />
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access to use gesture-based interaction. You can still use the buttons below.
                        </AlertDescription>
                    </Alert>
                )}
               
                <video ref={videoRef} className={cn("w-full aspect-video rounded-md", !(hasCameraPermission && myth && !revealed) && "hidden" )} autoPlay muted playsInline />
                
                {hasCameraPermission && myth && !revealed && predictionLabel && (
                    <div className="mt-2 text-lg font-medium text-muted-foreground">
                       Detected: <span className="font-bold text-primary">{predictionLabel}</span>
                    </div>
                )}


                {isLoading ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="animate-spin h-8 w-8" />
                        <p>Generating a myth...</p>
                    </div>
                ) : error ? (
                    <p className="text-destructive">{error}</p>
                ) : myth ? (
                    <div className="space-y-4 text-center">
                        <p className="font-semibold text-lg">"{myth.myth}"</p>
                        {revealed && (
                            <Alert className={cn(
                                myth.isTrue ? "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500" : "border-amber-500/50 text-amber-700 dark:text-amber-400 [&>svg]:text-amber-500",
                                "bg-opacity-20"
                            )}>
                                {myth.isTrue ? <CheckCircle className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
                                <AlertTitle className="font-bold">{myth.isTrue ? "This is True!" : "This is a Myth!"}</AlertTitle>
                                <AlertDescription className="text-foreground/80">{myth.explanation}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                ) : (
                   !hasCameraPermission ? null : <p className="text-muted-foreground">Click the button to bust a myth!</p>
                )}
            </CardContent>
            <CardFooter className="flex justify-center">
                {myth && !revealed ? (
                    <Button onClick={handleReveal}>
                        <Lightbulb className="mr-2"/> Reveal Answer
                    </Button>
                ) : (
                    <Button onClick={handleGenerateMyth} disabled={isLoading}>
                        <RefreshCw className={cn("mr-2", isLoading && "animate-spin")} />
                        {myth ? "Bust Another Myth" : "Bust a Myth"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

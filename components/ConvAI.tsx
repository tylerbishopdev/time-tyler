"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversation } from "@elevenlabs/react";
import { cn } from "@/lib/utils";

type Star = { leftPct: number; topPct: number; sizePx: number };

// Deterministic PRNG (LCG) to ensure SSR and CSR generate identical values
function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000; // [0, 1)
  };
}

function genStarsFromSeed(count: number, minSize: number, maxSize: number, seed: number): Star[] {
  const rand = createSeededRandom(seed);
  const list: Star[] = [];
  for (let i = 0; i < count; i += 1) {
    const leftPct = rand() * 100;
    const topPct = rand() * 100;
    const sizePx = minSize + rand() * (maxSize - minSize);
    list.push({ leftPct, topPct, sizePx });
  }
  return list;
}

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch {
    console.error("Microphone permission denied");
    return false;
  }
}

async function getSignedUrl(): Promise<string> {
  const response = await fetch("/api/signed-url");
  if (!response.ok) {
    throw Error("Failed to get signed url");
  }
  const data = await response.json();
  return data.signedUrl;
}

export function ConvAI() {
  const conversation = useConversation({
    onConnect: () => {
      console.log("connected");
    },
    onDisconnect: () => {
      console.log("disconnected");
    },
    onError: error => {
      console.log(error);
      alert("An error occurred during the conversation");
    },
    onMessage: message => {
      console.log(message);
    },
  });

  async function startConversation() {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      alert("No permission");
      return;
    }
    const signedUrl = await getSignedUrl();
    const conversationId = await conversation.startSession({ signedUrl });
    console.log(conversationId);
  }

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const layer1 = useMemo(() => genStarsFromSeed(60, 1, 2, 1337), []);
  const layer2 = useMemo(() => genStarsFromSeed(40, 1, 2, 4242), []);
  const layer3 = useMemo(() => genStarsFromSeed(25, 1, 2, 9001), []);

  return (
    <div className={"flex justify-center items-center gap-x-4"}>
      <Card className={"rounded-2xl"}>
        <CardContent>
          <CardHeader>
            <CardTitle className={"text-center text-orange-100 font-mono tracking-tighter opacity-50 "}>
              {conversation.status === "connected"
                ? conversation.isSpeaking
                  ? `Tyler is speaking`
                  : "Tyler is listening"
                : "Connected, click start..."}
            </CardTitle>
          </CardHeader>
          <div className={"flex flex-col gap-y-4 text-center"}>
            <div
              className={cn(
                "orb my-16 mx-12",
                conversation.status === "connected" && conversation.isSpeaking
                  ? "orb-active animate-orb"
                  : conversation.status === "connected"
                    ? "animate-orb-slow orb-inactive"
                    : "orb-inactive"
              )}
            >
              <div className="nebula" />
              <div className="grid-plane" />
              <div className="stars-container">
                <div className="star-layer">
                  {layer1.map((s, i) => (
                    <div
                      key={`l1-${i}`}
                      className="star"
                      style={{
                        left: `${s.leftPct}%`,
                        top: `${s.topPct}%`,
                        width: `${s.sizePx}px`,
                        height: `${s.sizePx}px`,
                      }}
                    />
                  ))}
                </div>
                <div className="star-layer">
                  {layer2.map((s, i) => (
                    <div
                      key={`l2-${i}`}
                      className="star"
                      style={{
                        left: `${s.leftPct}%`,
                        top: `${s.topPct}%`,
                        width: `${s.sizePx}px`,
                        height: `${s.sizePx}px`,
                      }}
                    />
                  ))}
                </div>
                <div className="star-layer">
                  {layer3.map((s, i) => (
                    <div
                      key={`l3-${i}`}
                      className="star"
                      style={{
                        left: `${s.leftPct}%`,
                        top: `${s.topPct}%`,
                        width: `${s.sizePx}px`,
                        height: `${s.sizePx}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant={"outline"}
              className={"rounded-full"}
              size={"lg"}
              disabled={
                conversation !== null && conversation.status === "connected"
              }
              onClick={startConversation}
            >
              Start conversation
            </Button>
            <Button
              variant={"outline"}
              className={"rounded-full"}
              size={"lg"}
              disabled={conversation === null}
              onClick={stopConversation}
            >
              End conversation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

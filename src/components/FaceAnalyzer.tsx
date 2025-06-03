import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import {
  FACEMESH_TESSELATION,
  FACEMESH_CONTOURS,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
} from "@mediapipe/face_mesh";
import { LeafLoader } from "./LeafLoader";

type Props = {
  file: File | null;
  loading: boolean;
};

const FaceAnalyzer: React.FC<Props> = ({ file, loading }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const [isFaceMeshLoaded, setIsFaceMeshLoaded] = useState(false);
  const animationFrameId = useRef<number | null>(null);
  const [lastDetectionResults, setLastDetectionResults] = useState<any>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);

  const scanDuration = 3000;
  const scanBandWidth = 0.2;
  const animationStartTimeRef = useRef<DOMHighResTimeStamp>(0);

  useEffect(() => {
    (window as any).Module = (window as any).Module || {};

    const faceMeshInstance = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`;
      },
    });

    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMeshInstance.onResults((results) => {
      setLastDetectionResults(results);
    });

    faceMeshInstance
      .initialize()
      .then(() => {
        console.log("MediaPipe FaceMesh initialized successfully.");
        faceMeshRef.current = faceMeshInstance;
        setIsFaceMeshLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to initialize MediaPipe FaceMesh:", error);
      });

    return () => {
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
        faceMeshRef.current = null;
      }
      if (backgroundImageRef.current && backgroundImageRef.current.src) {
        URL.revokeObjectURL(backgroundImageRef.current.src);
        backgroundImageRef.current = null;
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      setLastDetectionResults(null);
      animationStartTimeRef.current = 0;
    };
  }, []);

  const animateMesh = useCallback(
    (currentTime: DOMHighResTimeStamp) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const img = backgroundImageRef.current;

      if (!canvas || !ctx || !img) {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
          animationStartTimeRef.current = 0;
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (
        loading &&
        lastDetectionResults &&
        lastDetectionResults.multiFaceLandmarks &&
        lastDetectionResults.multiFaceLandmarks.length > 0
      ) {
        if (animationStartTimeRef.current === 0) {
          animationStartTimeRef.current = currentTime;
        }

        const elapsedTime = currentTime - animationStartTimeRef.current;
        let normalizedTime = (elapsedTime % scanDuration) / scanDuration;

        let scanProgress: number;

        if (normalizedTime < 0.5) {
          scanProgress = normalizedTime * 2;
        } else {
          scanProgress = 1 - (normalizedTime - 0.5) * 2;
        }

        const landmarks = lastDetectionResults.multiFaceLandmarks[0];

        const drawMeshSegment = (
          connections: number[][],
          lineWidth: number
        ) => {
          connections.forEach(([p1Index, p2Index]) => {
            const p1 = landmarks[p1Index];
            const p2 = landmarks[p2Index];

            if (p1 && p2) {
              const midX = (p1.x + p2.x) / 2;

              let opacity = 0;

              const scanStartBand = scanProgress - scanBandWidth / 2;
              const scanEndBand = scanProgress + scanBandWidth / 2;

              if (midX >= scanStartBand && midX <= scanEndBand) {
                const relativePosInBand =
                  (midX - scanStartBand) / scanBandWidth;
                opacity = Math.sin(relativePosInBand * Math.PI);
              }
              if (opacity > 0) {
                const alpha = Math.floor(opacity * 255)
                  .toString(16)
                  .padStart(2, "0");
                const lineColor = `#E0E0E0${alpha}`;

                ctx.beginPath();
                ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
                ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
              }
            }
          });
        };

        const baseConnections = [
          FACEMESH_FACE_OVAL,
          FACEMESH_CONTOURS,
          FACEMESH_LIPS,
          FACEMESH_LEFT_EYE,
          FACEMESH_LEFT_EYEBROW,
          FACEMESH_RIGHT_EYE,
          FACEMESH_RIGHT_EYEBROW,
        ];
        baseConnections.forEach((connections) =>
          drawMeshSegment(connections, 2)
        );
        drawMeshSegment(FACEMESH_TESSELATION, 1);

        animationFrameId.current = requestAnimationFrame(animateMesh);
      } else {
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
          animationStartTimeRef.current = 0;
        }
      }
    },
    [lastDetectionResults, loading, scanDuration, scanBandWidth]
  );

  useEffect(() => {
    const loadImageAndRunDetection = async () => {
      if (
        !file ||
        !canvasRef.current ||
        !faceMeshRef.current ||
        !isFaceMeshLoaded
      ) {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Could not get 2D context for canvas.");
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;

      img.onload = async () => {
        if (backgroundImageRef.current && backgroundImageRef.current.src) {
          URL.revokeObjectURL(backgroundImageRef.current.src);
        }
        backgroundImageRef.current = img;
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        await faceMeshRef.current?.send({ image: canvas });
        console.log("Image sent to FaceMesh for processing.");
      };

      img.onerror = (error) => {
        console.error("Error loading image:", error);
      };
    };

    loadImageAndRunDetection();

    return () => {
      if (backgroundImageRef.current && backgroundImageRef.current.src) {
        URL.revokeObjectURL(backgroundImageRef.current.src);
        backgroundImageRef.current = null;
      }
      setLastDetectionResults(null);
    };
  }, [file, isFaceMeshLoaded]);

  useEffect(() => {
    if (
      loading &&
      lastDetectionResults &&
      backgroundImageRef.current &&
      !animationFrameId.current
    ) {
      console.log("Starting animation loop due to loading state change.");
      animationStartTimeRef.current = performance.now();
      animationFrameId.current = requestAnimationFrame(animateMesh);
    } else if (!loading && animationFrameId.current) {
      if (lastDetectionResults && backgroundImageRef.current) {
        requestAnimationFrame(animateMesh);
      }
      console.log("Loading is false, animation should be stopping soon.");
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
        animationStartTimeRef.current = 0;
      }
    };
  }, [loading, lastDetectionResults, animateMesh, backgroundImageRef]);

  if (!file || !isFaceMeshLoaded) {
    return <LeafLoader />;
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "auto",
        transition: "width 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          position: "relative",
          marginTop: "1rem",
          transition: "width 1s ease-in-out",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "relative",
            width: "100%",
            height: "auto",
            display: "block",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
};

export default FaceAnalyzer;

"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw } from "lucide-react";

export type GameLauncherProps = {
  gameUrl?: string | null; // full URL from backend to load into iframe
  title?: string; // display title
  className?: string;
};

export const GameLauncher = ({ gameUrl, title = "Game", className }: GameLauncherProps) => {
  const [loading, setLoading] = useState<boolean>(!!gameUrl);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const src = useMemo(() => (gameUrl && typeof gameUrl === "string" ? gameUrl : null), [gameUrl]);

  useEffect(() => {
    setError(null);
    setLoading(!!src);
  }, [src]);

  const retry = () => {
    setError(null);
    setLoading(!!src);
    // try to reload iframe
    if (iframeRef.current && src) {
      try {
        iframeRef.current.src = src;
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className={"w-full rounded-lg border border-border bg-card " + (className || "")}> 
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
        </div>
        {!!src && (
          <Button size="sm" variant="ghost" onClick={retry} className="text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {!src && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="text-foreground text-lg font-medium">Game area ready</div>
            <p className="max-w-md text-sm text-muted-foreground">
              Connect your backend gaming API to provide a playable URL. Once available, we will render the game securely in this space.
            </p>
            <div className="rounded-md border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              Expected: iframe URL via props
            </div>
          </div>
        )}

        {!!src && (
          <>
            {loading && !error && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading game…</span>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/60 p-6 text-center">
                <div className="text-destructive">{error}</div>
                <Button size="sm" onClick={retry}>
                  Retry
                </Button>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={src}
              className="absolute inset-0 h-full w-full"
              onLoad={() => setLoading(false)}
              onError={() => setError("Failed to load the game. Please try again.")}
              allow="autoplay; fullscreen; clipboard-read; clipboard-write; encrypted-media"
              allowFullScreen
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              title={title}
            />
          </>
        )}
      </div>

      {/* Integration hint footer */}
      {!src && (
        <div className="border-t border-border p-3 text-xs text-muted-foreground">
          To integrate: fetch a launch URL from your backend and pass it to <code>GameLauncher</code> via the <code>gameUrl</code> prop.
        </div>
      )}
    </div>
  );
};
"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedImage, cacheImage } from "@/lib/storage";
import { toast } from "sonner";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  title: string;
}

export default function ImageModal({ isOpen, onClose, prompt, title }: ImageModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadedPromptRef = useRef<string>("");

  useEffect(() => {
    if (isOpen && prompt && loadedPromptRef.current !== prompt) {
      loadImage();
    }
  }, [isOpen, prompt]);

  const loadImage = async () => {
    // Check cache first
    const cached = getCachedImage(prompt);
    if (cached) {
      setImageUrl(cached);
      loadedPromptRef.current = prompt;
      return;
    }

    // Only generate if we don't have it cached
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate image");

      const data = await response.json();
      if (data.success && data.data.imageUrl) {
        setImageUrl(data.data.imageUrl);
        cacheImage(prompt, data.data.imageUrl);
        loadedPromptRef.current = prompt;
      }
    } catch (error) {
      console.error("Error loading image:", error);
      toast.error("Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoading ? (
            <Skeleton className="w-full h-96" />
          ) : imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-auto rounded-lg" />
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-muted rounded-lg">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

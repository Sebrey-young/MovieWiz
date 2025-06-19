import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResultCardProps {
  movieTitle: string;
  rating: number;
}

export default function ResultCard({ movieTitle, rating }: ResultCardProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(true);

  const [confidencePct, setConfidencePct] = useState<string | null>(null);
  const [confLoading, setConfLoading] = useState<boolean>(true);

  const ratingColor =
    rating >= 8 ? "text-green-600" : rating >= 6 ? "text-amber-600" : "text-red-600";

  // === 1. Fetch "Rating Analysis" from our new Next.js API route ===
  useEffect(() => {
    async function fetchAnalysis() {
      setAnalysisLoading(true);
      try {
        const prompt = `
You are a movie critic.
Given a movie named "${movieTitle}" with a predicted IMDb rating of ${rating.toFixed(
          1
        )}, write a short "rating analysis" paragraph that:
• Uses the movie name in the text.
• Places that rating in context of its genre's typical range.
• Mentions whether it will have weak/strong audience appeal.
Make sure to keep it short and concise (1–2 sentences).
        `.trim();

        const response = await fetch("/api/ai-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            mode: "analysis",
          }),
        });

        if (!response.ok) {
          throw new Error(`Google Gemini API error: ${response.status}`);
        }

        const json = await response.json();
        // Updated: Google Generative AI API returns: { candidates: [ { content: { parts: [ { text: "..." } ] } } ] }
        const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        setAnalysis(aiText.trim());
      } catch (err) {
        console.error("Failed to fetch rating analysis:", err);
        setAnalysis("Could not generate analysis at this time.");
      } finally {
        setAnalysisLoading(false);
      }
    }

    fetchAnalysis();
  }, [movieTitle, rating]);

  // === 2. Fetch "Confidence %" from our new Next.js route ===
  useEffect(() => {
    async function fetchConfidence() {
      setConfLoading(true);
      try {
        const prompt = `
You are a data scientist.
Given a predicted IMDb rating of ${rating.toFixed(
          1
        )} for a movie called "${movieTitle}", compare that rating to typical IMDb ratings of movies in the same genre released around the same year (± 2 years). Return a confidence percentage (0–100%) indicating how likely that rating is accurate. Output ONLY the percentage as "XX% confidence".
        `.trim();

        const response = await fetch("/api/ai-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            mode: "confidence",
          }),
        });

        if (!response.ok) {
          throw new Error(`Google Gemini API error: ${response.status}`);
        }

        const json = await response.json();
        // Updated: Google Generative AI API returns: { candidates: [ { content: { parts: [ { text: "..." } ] } } ] }
        const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        // Expect something like "75% confidence\nBecause…"
        const lines = aiText.trim().split("\n");
        setConfidencePct(lines[0]?.trim() ?? "0%"); // e.g. "75% confidence"
      } catch (err) {
        console.error("Failed to fetch confidence:", err);
        setConfidencePct("N/A");
      } finally {
        setConfLoading(false);
      }
    }

    fetchConfidence();
  }, [movieTitle, rating]);

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader className="bg-slate-50 dark:bg-gray-700 border-b dark:border-gray-600">
        <CardTitle className="flex items-center justify-between">
          <span>Prediction Result</span>
          <Badge variant="outline" className="font-normal">
            {confLoading ? "…" : confidencePct}
          </Badge>
        </CardTitle>
        <CardDescription className="dark:text-gray-300">
          AI-predicted rating for "{movieTitle}"
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="text-5xl font-bold flex items-center gap-2">
            <Star className={`h-8 w-8 fill-current ${ratingColor}`} />
            <span className={ratingColor}>{rating.toFixed(1)}</span>
          </div>
          <p className="text-gray-500 mt-1 dark:text-gray-400">
            Predicted IMDb Rating
          </p>
        </div>

        {/* === Rating Analysis Section === */}
        <div>
          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-slate-500" />
            Rating Analysis
          </h4>
          {analysisLoading ? (
            <p className="text-gray-500 italic dark:text-gray-400">
              Generating analysis…
            </p>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {analysis}
            </p>
          )}
        </div>

        {/* ======================================= */}
        {/* You can uncomment & implement "Similar Movies" here later */}
        {/* ======================================= */}
      </CardContent>
    </Card>
  );
}
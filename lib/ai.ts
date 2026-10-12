/**
 * Aetheria AI Reasoning Client
 * Calls the backend /api/ai/reasoning proxy endpoint to avoid exposing API keys in public frontend code.
 */

export interface AiStreamOptions {
  model?: string;
  systemPrompt: string;
  userPrompt: string;
  onChunk: (text: string) => void;
  onError?: (err: string) => void;
  onDone?: () => void;
}

export async function streamAiReasoning({
  model = "openai/gpt-oss-120b",
  systemPrompt,
  userPrompt,
  onChunk,
  onError,
  onDone
}: AiStreamOptions): Promise<void> {
  const API_BASE = typeof window !== 'undefined' ? '' : 'http://127.0.0.1:8089';

  try {
    const resp = await fetch(`${API_BASE}/api/ai/reasoning`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        systemPrompt,
        userPrompt
      })
    });

    if (!resp.ok) {
      throw new Error(`AI Gateway responded with HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const content = data.content || "No reasoning generated.";
    onChunk(content);

    if (onDone) onDone();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (onError) onError(msg);
  }
}

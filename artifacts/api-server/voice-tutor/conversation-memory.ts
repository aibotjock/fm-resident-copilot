export type ConversationTurn = { role: "user" | "assistant"; content: string };
const bytes = (value: unknown) =>
  new TextEncoder().encode(JSON.stringify(value)).length;
export const ARCHIVE_BYTES = 1_800_000;
export const CONTEXT_BYTES = 384_000;

/** Verbatim, bounded transcripts. Never summarize or turn old answers into evidence. */
export function retainConversation(
  input: { role: string; content: string }[],
  budget = ARCHIVE_BYTES,
): ConversationTurn[] {
  const turns = input.filter(
    (t): t is ConversationTurn =>
      (t.role === "user" || t.role === "assistant") &&
      typeof t.content === "string" &&
      !!t.content.trim(),
  );
  let total = 2;
  let start = turns.length;
  while (start > Math.max(0, turns.length - 5000)) {
    const size = bytes(turns[start - 1]) + 1;
    if (total + size > budget) break;
    total += size;
    start--;
  }
  // Do not begin the retained transcript with the answer to a dropped question.
  if (start > 0 && turns[start]?.role === "assistant") start++;
  return turns.slice(start);
}

/** Keep recent conversation plus matching older exchanges in chronological order. */
export function conversationContext(
  input: { role: string; content: string }[],
  query: string,
  budget = CONTEXT_BYTES,
): ConversationTurn[] {
  const turns = retainConversation(input);
  if (bytes(turns) <= budget) return turns;
  const selected = new Set<number>();
  let used = 2;
  const add = (i: number) => {
    if (i < 0 || i >= turns.length || selected.has(i)) return;
    const size = bytes(turns[i]) + 1;
    if (used + size <= budget) {
      selected.add(i);
      used += size;
    }
  };
  // Preserve the opening case and recent dialogue without cutting individual messages.
  for (let i = 0; i < Math.min(4, turns.length); i++) add(i);
  for (let i = turns.length - 1; i >= 0 && used < budget * 0.65; i--) add(i);
  const stop = new Set(
    "what which how why did does do have has was were is are the this that with from about and for please tell said say earlier remember".split(
      " ",
    ),
  );
  const terms = [
    ...new Set(
      (query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter(
        (t) => t.length > 2 && !stop.has(t),
      ),
    ),
  ];
  const ranked = turns
    .map((turn, i) => ({
      i,
      score: terms.reduce(
        (n, t) => n + (turn.content.toLowerCase().includes(t) ? 1 : 0),
        0,
      ),
    }))
    .filter((item) => item.score > 0 && !selected.has(item.i))
    .sort((a, b) => b.score - a.score || b.i - a.i);
  for (const { i } of ranked) {
    const first = turns[i]!.role === "assistant" ? i - 1 : i;
    // Older snippets remain complete user/assistant exchanges.
    const pair = [first, first + 1].filter(
      (n) => n >= 0 && n < turns.length && !selected.has(n),
    );
    if (
      used + pair.reduce((n, index) => n + bytes(turns[index]) + 1, 0) <=
      budget
    )
      pair.forEach(add);
  }
  return [...selected].sort((a, b) => a - b).map((i) => turns[i]!);
}

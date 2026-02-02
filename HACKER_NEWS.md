# Hacker News Submission - RLMs Visualizer

**Copy-paste ready for Show HN**

---

## Submission Title

```
Show HN: Interactive visualizer for Recursive Language Models (RLMs) paper
```

**Alternative titles:**
- Show HN: I made the RLMs paper interactive — explore recursion trees, REPL flows
- Show HN: Visualizer for MIT's RLMs research — 110%+ gains over GPT-5
- Show HN: Making AI research playable — interactive RLMs paper explorer

---

## Submission Text (Full Version)

```
I built an interactive web application to explore the Recursive Language Models paper by Alex Zhang et al. from MIT CSAIL (arXiv:2512.24601).

RLMs introduce a paradigm where LLMs handle massive contexts (10M+ tokens) through recursive decomposition in REPL environments. Key results: 110%+ performance gains over GPT-5 on long-context benchmarks, 100x context scaling, cheaper inference using smaller models.

The visualizer features:
- Interactive recursion trees (React Flow) — see query decomposition
- REPL execution simulator — step through Read-Eval-Print-Loop flows  
- Code playground (Monaco Editor) — experiment with paper examples
- Context heatmap — visualize token distribution and chunking

Built with Next.js 14, TypeScript, Tailwind, shadcn/ui. Terminal aesthetic design — no generic AI startup tropes, just information-dense academic tooling.

Live demo: [YOUR_URL]
Code: github.com/[YOUR_USERNAME]/rlms-visualizer

Would love feedback from the HN community!
```

---

## Submission Text (Short Version)

```
Interactive visualizer for the RLMs paper (arXiv:2512.24601) — MIT CSAIL research showing 110%+ performance gains over GPT-5 on long-context tasks through recursive decomposition in REPL environments.

Features recursion trees, REPL simulator, code playground, context visualizer. Built with Next.js + TypeScript + shadcn/ui.

Demo: [YOUR_URL]
Code: github.com/[YOUR_USERNAME]/rlms-visualizer
```

---

## Best Practices for HN

### Timing
- **Best days:** Tuesday-Thursday
- **Best time:** 8:00-10:00 AM PST (11:00 AM-1:00 PM EST)
- **Avoid:** Weekends, late evenings, major news days

### Title Optimization
- Start with "Show HN:" (required for projects)
- Keep it under 80 characters if possible
- Mention the specific technology/paper
- Include a compelling metric if space allows

### Engagement Strategy

**First hour (critical):**
- Reply to every comment immediately
- Upvote thoughtful comments
- Answer technical questions in depth
- Acknowledge bugs/issues reported

**Common HN concerns & responses:**

**"How is this different from just reading the paper?"**
```
Great question! The visualizer doesn't replace the paper — it makes the concepts approachable.

The paper is 20+ pages of dense research. This tool lets you:
- Click through recursion trees to see how queries decompose
- Step through REPL execution to understand the flow
- Visualize 10M token chunking strategies
- Edit code examples and see how they work

Think of it as "playable research" — you explore concepts interactively, then dive into the paper with context.
```

**"Is the RLM implementation included?"**
```
No, this is purely a visualization/education tool. For the actual RLM implementation, see the official repo: github.com/alexzhang13/rlm

The paper authors also have a minimal implementation: github.com/alexzhang13/rlm-minimal

This visualizer helps you understand the architecture before diving into the code.
```

**"Why Next.js for this?"**
```
Good question! A few reasons:

1. Static export — deploys anywhere (Vercel, Netlify, GitHub Pages)
2. TypeScript — type safety for complex data structures
3. shadcn/ui — excellent base components (heavily customized)
4. React ecosystem — React Flow for trees, Monaco for editor
5. Performance — SSG means fast load times

Could have been vanilla React or Vue, but Next.js 14's App Router + static export is perfect for this use case.
```

**"The design looks like a terminal"**
```
Intentional! The goal was "zero AI fingerprint" — no generic gradients, glassmorphism, or startup tropes.

Wanted it to look like MIT researchers built it: information-dense, terminal aesthetic, purposeful animations only.

Inspired by the paper authors' official visualizer + tools like Linear, Obsidian, and Stripe's docs.
```

**"What are the performance results again?"**
```
From the paper:

OOLONG benchmark (132k tokens):
- RLM with GPT-5-mini: +114% over GPT-5
- That's more than 2x the correct answers
- Cheaper per query than GPT-5

BrowseComp-Plus (1000 docs, ~5M tokens):
- Only method maintaining perfect performance at scale
- GPT-5's performance degrades significantly
- RLM handles 10M+ tokens without degradation

The key insight: smaller models (GPT-5-mini) with RLM architecture outperform frontier models (GPT-5) on long-context tasks.
```

---

## Comment Templates

**Thank you comment (if it hits front page):**
```
Thanks for the interest everyone! Happy to answer questions.

Quick links:
- Paper: arxiv.org/abs/2512.24601
- Original blog: alexzhang13.github.io/blog/2025/rlm/
- Official RLM repo: github.com/alexzhang13/rlm

Built this for the OpenCode × Fireworks AI showcase to make AI research more accessible. Open source — contributions welcome!
```

**Technical deep-dive (if asked):**
```
The core RLM architecture:

1. User query + massive context (10M tokens)
2. Context stored as Python variable in REPL (not in LLM context window)
3. Root LM writes code to explore: context[:1000], grep, partition
4. Sub-queries delegated to recursive LM instances (depth=1)
5. Results aggregated and returned

Key advantages:
- Root LM's context grows slowly (just code + truncated output)
- Recursive calls use smaller models (GPT-5-mini)
- Strategies emerge: peeking, grepping, map/reduce, summarization

The paper shows recursive depth of 1 is sufficient for most tasks.
```

---

## What to Expect

**Good signs:**
- Hits front page within 2 hours
- Technical questions about implementation
- Suggestions for improvements
- "This is actually useful" comments

**Challenging comments (handle gracefully):**
- "Why not just read the paper?" → Explain accessibility mission
- "This is just a wrapper" → Clarify it's educational, not implementation
- "Next.js is overkill" → Explain static export benefits
- "The design is too dark" → Explain terminal aesthetic choice

**HN etiquette:**
- Never ask for upvotes
- Don't get defensive
- Admit when you're wrong
- Update the post with fixes
- Thank people for feedback

---

## Post-Submission Checklist

- [ ] Submit at optimal time (Tuesday-Thursday, 8-10 AM PST)
- [ ] Monitor first hour closely
- [ ] Reply to all comments within 30 minutes
- [ ] Update Show HN text if major bugs found
- [ ] Post follow-up comment with additional resources
- [ ] Track metrics (upvotes, comments, traffic)
- [ ] Cross-post to relevant subreddits 6 hours later

---

## Success Metrics

- [ ] Front page of Show HN (top 30)
- [ ] 50+ upvotes
- [ ] 20+ comments
- [ ] 1,000+ visits from HN
- [ ] 10+ GitHub stars from HN traffic

---

*Last updated: February 2026*

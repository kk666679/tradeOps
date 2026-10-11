---
description: Run RAG over cargo documents for a question
allowed-tools: [Task, "mcp__ai-layer__rag.search"]
argument-hint: "<question>"
---

# /analyze_vector $ARGUMENTS

Delegate to `vector-analyst`. Require at least one above-threshold source;
otherwise return "no answer".

# Core Concepts

This section explains the fundamental concepts and data model of Mudipu. Understanding these atomic components will help you effectively instrument, trace, and analyze your LLM applications.

## Data Model Hierarchy

Mudipu's data model follows a hierarchical structure that mirrors how LLM applications naturally operate:

```
Session (Trace)
  └── Turn 1
      ├── Span: LLM Call
      ├── Span: Tool Call A
      └── Span: Tool Call B
  └── Turn 2
      └── Span: LLM Call
  └── Turn 3
      ├── Span: LLM Call
      └── Span: Tool Call C
```

## Atomic Components

### [Session](./session.md)
The highest-level container representing a complete user interaction or workflow. A session contains multiple turns and represents the full context of a conversation or task.

**Key characteristics:**
- Has a unique `session_id` and `trace_id`
- Contains metadata (name, tags, custom properties)
- Aggregates statistics (total tokens, duration, costs)
- Lifecycle: created → turns added → ended

**Use cases:**
- A complete customer support conversation
- A multi-step agent workflow
- A batch processing job

---

### [Turn](./turn.md)
A single request-response cycle with an LLM within a session. Each turn captures a discrete interaction including the prompt, response, and any tool calls.

**Key characteristics:**
- Sequential `turn_number` within a session
- Contains request messages and response
- Tracks token usage and duration
- Can trigger multiple tool calls

**Use cases:**
- User asks a question → LLM responds
- Agent makes a decision based on previous context
- System prompt + user input → structured output

---

### [Span](./span.md)
A discrete unit of work that represents a specific operation within a turn. Spans provide granular visibility into individual operations.

**Key characteristics:**
- Typed operations (LLM call, tool execution, custom)
- Tracks start/end time and duration
- Can be nested (parent-child relationships)
- Contains operation-specific metadata

**Use cases:**
- LLM API call span
- Database query span within a tool
- External API call span
- Custom business logic span

---

### [Trace](./trace.md)
The complete, immutable record of a session including all turns, spans, and metadata. A trace is what gets exported and analyzed.

**Key characteristics:**
- Complete snapshot of a session
- Includes all timing and usage data
- Can be exported to multiple formats
- Enables replay and analysis

**Use cases:**
- Post-session analysis
- Debugging conversation flows
- Cost attribution
- Performance optimization

---

### [Tool Call](./tool-call.md)
Represents an LLM-initiated function or tool invocation. Tool calls are special spans that bridge LLM outputs to external actions.

**Key characteristics:**
- Contains function name and arguments
- Tracks execution results
- Links to parent turn
- Supports parallel tool calls

**Use cases:**
- Function calling with OpenAI
- Tool use with Anthropic Claude
- Custom agent tool execution
- External API integrations

---

### [Event](./event.md)
System events published during trace capture for real-time monitoring and integration.

**Key characteristics:**
- Typed event system
- Published via NATS messaging
- Enables real-time reactions
- Platform integration hook

**Use cases:**
- Real-time monitoring dashboards
- Alerting on anomalies
- Triggering workflows
- Platform synchronization

---

## Relationships

Understanding how these components relate to each other:

```
Session (1) ──has many──> Turn (N)
Turn (1) ──has many──> Span (N)
Turn (1) ──has many──> ToolCall (N)
Session (1) ──produces──> Trace (1)
Trace Capture ──emits──> Event (N)
```

## Next Steps

Explore each component in detail:

1. **[Session](./session.md)** - Learn about session lifecycle and management
2. **[Turn](./turn.md)** - Understand turn structure and tracking
3. **[Span](./span.md)** - Dive into span types and instrumentation
4. **[Trace](./trace.md)** - Learn about trace export and analysis
5. **[Tool Call](./tool-call.md)** - Understand tool invocation tracking
6. **[Event](./event.md)** - Explore the event system

Or jump to the **[SDK Guide](../sdk/index.md)** to start implementing these concepts in your application.

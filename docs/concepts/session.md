# Session

A **Session** is the highest-level container in Mudipu's data model, representing a complete user interaction, conversation, or workflow. It serves as the logical boundary for grouping related LLM interactions.

## Overview

A session encapsulates everything that happens during a distinct period of user engagement or task execution. It contains multiple [turns](./turn.md), aggregated statistics, and metadata that provides context for the entire interaction.

## Core Properties

### Identifiers

```python
session_id: UUID           # Unique identifier for the session
trace_id: UUID            # Identifier for the complete trace
```

- **`session_id`**: Uniquely identifies this session across the system
- **`trace_id`**: Links the session to its exported trace (often same as session_id)

### Timestamps

```python
created_at: str           # ISO 8601 timestamp when session started
ended_at: Optional[str]   # ISO 8601 timestamp when session ended
```

Sessions have a clear lifecycle with start and end times, enabling duration calculations and temporal analysis.

### Metadata

```python
name: Optional[str]       # Human-readable session name
tags: list[str]          # Categorization tags
metadata: dict[str, Any] # Custom key-value properties
```

**Examples:**
```python
name = "customer-support-2024-03-21"
tags = ["production", "high-priority", "enterprise"]
metadata = {
    "user_id": "user_123",
    "org_id": "org_456",
    "environment": "production",
    "version": "2.1.0"
}
```

### Turns

```python
turns: list[Turn]         # Ordered list of conversation turns
turn_count: int          # Total number of turns
```

Sessions contain an ordered sequence of [turns](./turn.md), each representing a single LLM interaction.

### Aggregated Statistics

```python
total_duration_ms: float  # Total execution time across all turns
total_tokens: int        # Sum of tokens used in all turns
```

These statistics are automatically calculated as turns are added to the session.

## Lifecycle

### 1. Creation

```python
from mudipu import MudipuTracer

# Create a new session
tracer = MudipuTracer(
    session_name="customer-inquiry",
    tags=["production", "support"]
)

# Start the session
tracer.start_session()
```

When created, a session receives unique IDs and a `created_at` timestamp.

### 2. Active Use

```python
# Add turns to the session
with tracer.trace_session():
    # Turn 1
    response1 = call_llm("What is your return policy?")
    
    # Turn 2
    response2 = call_llm("When will it arrive?")
    
    # Turn 3
    response3 = call_llm("Thank you!")
```

During the active phase, turns are added as LLM interactions occur. Statistics are updated automatically.

### 3. Completion

```python
# End the session
session = tracer.end_session()

# Session is now complete with ended_at timestamp
print(f"Session duration: {session.total_duration_ms}ms")
print(f"Total turns: {session.turn_count}")
print(f"Total tokens: {session.total_tokens}")
```

Ending a session:
- Sets the `ended_at` timestamp
- Finalizes statistics
- Makes the session ready for export
- Returns the complete `Session` object

## Session Methods

### `add_turn(turn: Turn) -> None`

Adds a turn to the session and updates statistics.

```python
from mudipu.models import Session, Turn

session = Session(name="my-session")

# Create and add a turn
turn = Turn(
    turn_number=1,
    model="gpt-4",
    duration_ms=1500,
    usage={"total_tokens": 250}
)

session.add_turn(turn)

# Statistics are automatically updated
assert session.turn_count == 1
assert session.total_duration_ms == 1500
assert session.total_tokens == 250
```

### `end_session() -> None`

Marks the session as complete by setting `ended_at`.

```python
session.end_session()
assert session.ended_at is not None
```

## Use Cases

### Customer Support Conversation

```python
tracer = MudipuTracer(
    session_name="support-ticket-12345",
    tags=["support", "tier-2", "billing"],
    metadata={
        "ticket_id": "12345",
        "customer_id": "cust_789",
        "agent_id": "agent_42"
    }
)
```

A complete support interaction from first message to resolution.

### Agent Workflow

```python
tracer = MudipuTracer(
    session_name="data-analysis-task",
    tags=["agent", "analysis"],
    metadata={
        "task_type": "data_analysis",
        "dataset": "sales_2024_q1"
    }
)
```

Multi-step agent task involving planning, execution, and reporting.

### Batch Processing

```python
tracer = MudipuTracer(
    session_name="email-classification-batch",
    tags=["batch", "classification"],
    metadata={
        "batch_id": "batch_001",
        "email_count": 1000
    }
)
```

Processing multiple items in a single logical operation.

## Session Boundaries

**When to create a new session:**
- New user conversation starts
- New agent task begins
- New batch job launches
- After significant time gap (e.g., > 30 minutes)
- Context reset occurs

**When to continue a session:**
- User sends follow-up messages
- Agent continues multi-step task
- Batch processes next item
- Context is maintained

## Best Practices

### Naming Conventions

```python
# Good: Descriptive and consistent
"customer-support-2024-03-21-session-001"
"agent-research-wikipedia-task"
"batch-email-classification-20240321"

# Avoid: Generic or unclear
"session1"
"test"
"debug"
```

### Tagging Strategy

```python
# Use tags for:
# - Environment
tags = ["production"]  # or "staging", "development"

# - Application area
tags = ["customer-support", "analytics", "content-generation"]

# - Quality indicators
tags = ["high-priority", "experimental", "production-ready"]

# - User segments
tags = ["free-tier", "enterprise", "beta-tester"]
```

### Metadata Usage

```python
# Include relevant context for later analysis
metadata = {
    # User context
    "user_id": "user_123",
    "user_tier": "enterprise",
    
    # Application context
    "app_version": "2.1.0",
    "feature_flag": "new_ui_enabled",
    
    # Business context
    "transaction_id": "txn_456",
    "campaign_id": "campaign_789"
}
```

## Analytics

Sessions enable powerful analytics:

**Session-level metrics:**
- Average session duration
- Tokens per session
- Cost per session
- Turns per session

**Segmentation:**
- Compare sessions by tags
- Analyze by user segment
- Track performance over time

**Cost attribution:**
- Per-user costs
- Per-feature costs
- Per-environment costs

## Related Concepts

- **[Turn](./turn.md)** - Individual interactions within a session
- **[Trace](./trace.md)** - The exported snapshot of a session
- **[Span](./span.md)** - Granular operations within turns
- **[Event](./event.md)** - Events emitted during session capture

## Next Steps

- Learn about [Turns](./turn.md) within sessions
- Explore [Session management in the SDK](../sdk/sessions.md)
- See [Session examples](../examples/sessions.md)

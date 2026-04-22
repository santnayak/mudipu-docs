# Turn

A **Turn** represents a single request-response cycle with an LLM within a [session](./session.md). It captures everything about one discrete interaction: the input prompt, the model's response, token usage, timing, and any tool calls initiated.

## Overview

Turns are the fundamental unit of LLM interaction tracking. Each turn corresponds to one call to an LLM API, capturing both the request sent and the response received, along with metadata about the interaction.

## Core Properties

### Identifiers

```python
id: UUID                  # Unique identifier for this turn
turn_number: int         # Sequential position within the session (1-indexed)
```

- **`id`**: Globally unique identifier
- **`turn_number`**: Position in the session (1, 2, 3, ...)

### Timestamp

```python
timestamp: str           # ISO 8601 timestamp when turn started
```

Marks the exact moment the LLM call was initiated.

### Request Data

```python
request_messages: list[dict]    # Messages sent to the LLM
request_tools: list[dict]       # Tools/functions made available
model: Optional[str]            # Model identifier (e.g., "gpt-4")
```

**Example request messages:**
```python
request_messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."},
    {"role": "user", "content": "What about Spain?"}
]
```

**Example request tools:**
```python
request_tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
                }
            }
        }
    }
]
```

### Response Data

```python
response_message: Optional[dict]   # The LLM's response message
```

**Example response message:**
```python
response_message = {
    "role": "assistant",
    "content": "The capital of Spain is Madrid.",
    "tool_calls": None  # or list of tool calls if any
}
```

### Performance Metrics

```python
duration_ms: Optional[float]      # Execution time in milliseconds
usage: Optional[dict]             # Token usage statistics
```

**Example usage:**
```python
usage = {
    "prompt_tokens": 45,
    "completion_tokens": 12,
    "total_tokens": 57
}
```

### Tool Calls

```python
tool_calls_detected: list[ToolCall]   # Tool calls initiated by the LLM
has_tool_calls: bool                  # Quick check if tools were used
```

Captures when the LLM requests to execute tools/functions. See [Tool Call](./tool-call.md) for details.

## Turn Lifecycle

### 1. Initiation

```python
from mudipu import trace_llm
from openai import OpenAI

client = OpenAI()

@trace_llm(model="gpt-4")
def ask_question(question: str):
    return client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": question}]
    )
```

When the decorated function is called, a new turn is created.

### 2. Request Capture

The decorator captures:
- All messages in the request
- Available tools/functions
- Model configuration
- Start timestamp

### 3. LLM Execution

The actual LLM API call is made. Duration is tracked.

### 4. Response Capture

The decorator captures:
- Response message and content
- Any tool calls requested
- Token usage
- End timestamp (for duration calculation)

### 5. Turn Completion

The complete turn is added to the active session.

## Turn Structure Examples

### Simple Question-Answer

```python
{
    "id": "turn_abc123",
    "turn_number": 1,
    "timestamp": "2024-03-21T10:30:00Z",
    "model": "gpt-4",
    "request_messages": [
        {"role": "user", "content": "What is 2+2?"}
    ],
    "response_message": {
        "role": "assistant",
        "content": "2+2 equals 4."
    },
    "duration_ms": 850.5,
    "usage": {
        "prompt_tokens": 12,
        "completion_tokens": 8,
        "total_tokens": 20
    },
    "has_tool_calls": false
}
```

### Turn with Tool Calls

```python
{
    "id": "turn_def456",
    "turn_number": 2,
    "timestamp": "2024-03-21T10:31:00Z",
    "model": "gpt-4-turbo",
    "request_messages": [
        {"role": "user", "content": "What's the weather in Paris?"}
    ],
    "request_tools": [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get current weather"
            }
        }
    ],
    "response_message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
            {
                "id": "call_123",
                "type": "function",
                "function": {
                    "name": "get_weather",
                    "arguments": "{\"location\": \"Paris\"}"
                }
            }
        ]
    },
    "tool_calls_detected": [
        {
            "id": "call_123",
            "type": "function",
            "function_name": "get_weather",
            "function_arguments": "{\"location\": \"Paris\"}"
        }
    ],
    "has_tool_calls": true,
    "duration_ms": 1200.3,
    "usage": {
        "prompt_tokens": 85,
        "completion_tokens": 25,
        "total_tokens": 110
    }
}
```

### Multi-Message Context

```python
{
    "id": "turn_ghi789",
    "turn_number": 3,
    "timestamp": "2024-03-21T10:32:00Z",
    "model": "gpt-4",
    "request_messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is Python?"},
        {"role": "assistant", "content": "Python is a programming language."},
        {"role": "user", "content": "Who created it?"}
    ],
    "response_message": {
        "role": "assistant",
        "content": "Python was created by Guido van Rossum."
    },
    "duration_ms": 950.0,
    "usage": {
        "prompt_tokens": 65,
        "completion_tokens": 15,
        "total_tokens": 80
    }
}
```

## Turn Analysis

### Performance Metrics

**Duration analysis:**
```python
# Fast turns: < 500ms
# Normal turns: 500-2000ms
# Slow turns: > 2000ms

if turn.duration_ms > 2000:
    print(f"Slow turn detected: {turn.duration_ms}ms")
```

**Token efficiency:**
```python
if turn.usage:
    efficiency = turn.usage["completion_tokens"] / turn.usage["prompt_tokens"]
    print(f"Response ratio: {efficiency:.2f}")
```

### Quality Indicators

**Check for tool calls:**
```python
if turn.has_tool_calls:
    print(f"Turn {turn.turn_number} initiated {len(turn.tool_calls_detected)} tool calls")
```

**Message length:**
```python
if turn.response_message:
    content_length = len(turn.response_message.get("content", ""))
    print(f"Response length: {content_length} characters")
```

## Use Cases

### Conversational Turns

Sequential user-assistant exchanges in a chatbot.

```python
# Turn 1: Initial question
# Turn 2: Follow-up question
# Turn 3: Clarification
# Turn 4: Final answer
```

### Function Calling Flow

```python
# Turn 1: User asks about weather → LLM requests get_weather()
# Turn 2: Tool result provided → LLM synthesizes answer
```

### Context Building

```python
# Turn 1: System prompt + task description
# Turn 2: User provides data
# Turn 3: LLM analyzes data
# Turn 4: User asks follow-up
```

## Best Practices

### Message Management

```python
# Keep context relevant - don't include unnecessary history
request_messages = [
    {"role": "system", "content": system_prompt},
    *recent_history[-5:],  # Only last 5 messages
    {"role": "user", "content": current_question}
]
```

### Model Selection

```python
# Simple tasks: gpt-3.5-turbo (faster, cheaper)
# Complex reasoning: gpt-4 (slower, more expensive)
# Function calling: gpt-4-turbo (optimized)

model = "gpt-4" if requires_reasoning else "gpt-3.5-turbo"
```

### Error Handling

```python
@trace_llm(model="gpt-4")
def safe_llm_call(prompt: str):
    try:
        return client.chat.completions.create(...)
    except Exception as e:
        # Error is still traced
        print(f"LLM call failed: {e}")
        return None
```

## Turn vs. Span

**Turns** are LLM interactions, while **[Spans](./span.md)** are any operations.

```
Turn 1
  ├── Span: LLM Call (the turn itself)
  ├── Span: Database lookup (tool execution)
  └── Span: Response formatting

Turn 2
  └── Span: LLM Call
```

## Related Concepts

- **[Session](./session.md)** - Container for multiple turns
- **[Span](./span.md)** - Granular operations within turns
- **[Tool Call](./tool-call.md)** - Function invocations within turns
- **[Trace](./trace.md)** - Complete record including all turns

## Next Steps

- Explore [Tool Calls](./tool-call.md) within turns
- Learn about [Span tracking](./span.md)
- See [Turn examples](../examples/turns.md)

# Span

A **Span** represents a discrete unit of work or operation within your application. Spans provide granular visibility into individual operations like LLM calls, tool executions, database queries, API calls, or any custom logic.

## Overview

While [turns](./turn.md) capture LLM request-response cycles, spans track any operation that takes measurable time. Spans can be nested to represent hierarchical operations and provide detailed performance insights.

## Core Properties

### Identifiers

```python
span_id: str              # Unique identifier for this span
parent_span_id: Optional[str]  # Parent span ID if nested
trace_id: str             # Links to the overall trace
```

### Type & Name

```python
span_type: str            # Type of operation (llm, tool, custom, etc.)
name: str                 # Human-readable operation name
```

**Common span types:**
- `llm` - LLM API call
- `tool` - Tool or function execution
- `database` - Database query
- `http` - HTTP request
- `custom` - Application-specific operation

### Timing

```python
start_time: str           # ISO 8601 timestamp when span started
end_time: str            # ISO 8601 timestamp when span ended
duration_ms: float       # Duration in milliseconds
```

### Data & Metadata

```python
attributes: dict[str, Any]     # Span-specific attributes
events: list[dict]             # Events that occurred during span
status: str                    # "ok", "error", or "cancelled"
```

## Span Types

### LLM Span

Tracks an LLM API call.

```python
{
    "span_id": "span_llm_001",
    "span_type": "llm",
    "name": "gpt-4-completion",
    "start_time": "2024-03-21T10:30:00.000Z",
    "end_time": "2024-03-21T10:30:01.250Z",
    "duration_ms": 1250.0,
    "attributes": {
        "model": "gpt-4",
        "prompt_tokens": 45,
        "completion_tokens": 12,
        "total_tokens": 57,
        "temperature": 0.7,
        "max_tokens": 150
    },
    "status": "ok"
}
```

### Tool Span

Tracks tool or function execution.

```python
{
    "span_id": "span_tool_001",
    "span_type": "tool",
    "name": "get_weather",
    "parent_span_id": "span_llm_001",
    "start_time": "2024-03-21T10:30:01.300Z",
    "end_time": "2024-03-21T10:30:01.850Z",
    "duration_ms": 550.0,
    "attributes": {
        "tool_name": "get_weather",
        "arguments": {"location": "Paris", "unit": "celsius"},
        "result": {"temperature": 18, "conditions": "sunny"}
    },
    "status": "ok"
}
```

### Database Span

Tracks database operations.

```python
{
    "span_id": "span_db_001",
    "span_type": "database",
    "name": "query_user_preferences",
    "parent_span_id": "span_tool_002",
    "start_time": "2024-03-21T10:30:02.000Z",
    "end_time": "2024-03-21T10:30:02.150Z",
    "duration_ms": 150.0,
    "attributes": {
        "query": "SELECT * FROM user_preferences WHERE user_id = ?",
        "database": "postgresql",
        "rows_returned": 1
    },
    "status": "ok"
}
```

### HTTP Span

Tracks external API calls.

```python
{
    "span_id": "span_http_001",
    "span_type": "http",
    "name": "GET /api/v1/weather",
    "start_time": "2024-03-21T10:30:03.000Z",
    "end_time": "2024-03-21T10:30:03.450Z",
    "duration_ms": 450.0,
    "attributes": {
        "method": "GET",
        "url": "https://api.weather.com/v1/weather",
        "status_code": 200,
        "response_size_bytes": 1024
    },
    "status": "ok"
}
```

### Custom Span

Tracks application-specific operations.

```python
{
    "span_id": "span_custom_001",
    "span_type": "custom",
    "name": "process_user_input",
    "start_time": "2024-03-21T10:30:04.000Z",
    "end_time": "2024-03-21T10:30:04.100Z",
    "duration_ms": 100.0,
    "attributes": {
        "operation": "input_validation",
        "input_length": 256,
        "validation_passed": true
    },
    "status": "ok"
}
```

## Nested Spans

Spans can be nested to represent parent-child relationships:

```
Turn 1
  └── Span: LLM Call (parent)
      ├── Span: Tool Execution (child)
      │   └── Span: Database Query (grandchild)
      └── Span: Result Processing (child)
```

**Example hierarchy:**
```python
# Parent span
llm_span = {
    "span_id": "span_001",
    "span_type": "llm",
    "duration_ms": 2500
}

# Child spans
tool_span = {
    "span_id": "span_002",
    "parent_span_id": "span_001",  # References parent
    "span_type": "tool",
    "duration_ms": 1500
}

db_span = {
    "span_id": "span_003",
    "parent_span_id": "span_002",  # References tool span
    "span_type": "database",
    "duration_ms": 800
}
```

## Creating Spans

### Using Decorators

```python
from mudipu import trace_tool

@trace_tool("data_lookup")
def fetch_user_data(user_id: str):
    # This function execution becomes a span
    # Automatically tracks duration and errors
    return database.query(f"SELECT * FROM users WHERE id = '{user_id}'")
```

### Manual Span Creation

```python
from mudipu import MudipuTracer

tracer = MudipuTracer()

# Start a custom span
with tracer.span("custom_operation", span_type="custom"):
    # Your operation here
    result = perform_complex_calculation()
```

### Nested Span Pattern

```python
@trace_tool("parent_operation")
def parent_function():
    # Parent span created automatically
    
    @trace_tool("child_operation")
    def child_function():
        # Child span created, linked to parent
        pass
    
    child_function()
```

## Span Events

Add events to spans for additional context:

```python
span.add_event("cache_miss", {
    "key": "user_123",
    "timestamp": "2024-03-21T10:30:05.000Z"
})

span.add_event("retry_attempt", {
    "attempt": 2,
    "reason": "timeout"
})
```

## Span Status

Spans have three possible statuses:

### OK (Success)

```python
{
    "status": "ok",
    "attributes": {
        "result": "success"
    }
}
```

### Error (Failure)

```python
{
    "status": "error",
    "attributes": {
        "error_type": "ValueError",
        "error_message": "Invalid input parameter",
        "stack_trace": "..."
    }
}
```

### Cancelled

```python
{
    "status": "cancelled",
    "attributes": {
        "reason": "timeout exceeded"
    }
}
```

## Performance Analysis

### Duration Analysis

```python
# Identify slow spans
if span.duration_ms > 1000:
    print(f"Slow operation: {span.name} took {span.duration_ms}ms")

# Calculate total vs self time
total_time = span.duration_ms
child_time = sum(child.duration_ms for child in child_spans)
self_time = total_time - child_time
```

### Bottleneck Detection

```python
# Find the slowest operation in a chain
spans = [llm_span, tool_span, db_span, http_span]
slowest = max(spans, key=lambda s: s.duration_ms)
print(f"Bottleneck: {slowest.name} ({slowest.duration_ms}ms)")
```

## Use Cases

### LLM Agent Workflow

```
Span: agent_execute (2500ms)
  ├── Span: llm_planning (800ms)
  ├── Span: tool_web_search (1200ms)
  │   └── Span: http_request (1100ms)
  └── Span: llm_synthesis (500ms)
```

### Multi-Step Processing

```
Span: process_document (5000ms)
  ├── Span: extract_text (1000ms)
  ├── Span: llm_analyze (2500ms)
  ├── Span: db_save_results (500ms)
  └── Span: notify_user (1000ms)
      └── Span: http_send_email (900ms)
```

### Function Calling Flow

```
Span: llm_call (1500ms)
  └── Span: tool_calls (parallel)
      ├── Span: get_weather (400ms)
      ├── Span: get_news (600ms)
      └── Span: get_stock_price (500ms)
```

## Best Practices

### Meaningful Names

```python
# Good: Descriptive and specific
"llm_summarize_document"
"db_fetch_user_preferences"
"http_call_weather_api"

# Avoid: Generic or vague
"operation_1"
"function"
"call"
```

### Appropriate Granularity

```python
# Too coarse - no detail
span("process_everything")

# Too fine - too much overhead
span("add_numbers")
span("check_if_null")

# Just right - meaningful operations
span("validate_input")
span("call_llm")
span("save_to_database")
```

### Rich Attributes

```python
# Include relevant context
span.attributes = {
    "model": "gpt-4",
    "input_length": 500,
    "output_length": 200,
    "cache_hit": True,
    "retry_count": 0
}
```

### Error Context

```python
try:
    result = risky_operation()
    span.status = "ok"
except Exception as e:
    span.status = "error"
    span.attributes["error_type"] = type(e).__name__
    span.attributes["error_message"] = str(e)
    raise
```

## Span vs. Turn

**Turns** are specifically LLM interactions within a session.
**Spans** are any measurable operations, including turns.

```
Session
  └── Turn 1 (is also a Span)
      ├── Span: Tool execution
      ├── Span: Database query
      └── Span: API call
```

## Related Concepts

- **[Turn](./turn.md)** - LLM interaction (special type of span)
- **[Session](./session.md)** - Container for turns and spans
- **[Tool Call](./tool-call.md)** - Tool execution spans
- **[Trace](./trace.md)** - Complete record of all spans

## Next Steps

- Learn about [Tool Call spans](./tool-call.md)
- Explore [Trace analysis](./trace.md)
- See [Span instrumentation examples](../examples/spans.md)

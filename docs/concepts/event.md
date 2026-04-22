# Event

An **Event** represents a system event published during trace capture for real-time monitoring, integration, and platform synchronization. Events enable reactive workflows and real-time observability.

## Overview

While [traces](./trace.md) provide post-session analysis, events enable real-time reactions to LLM interactions. Events are published as operations occur, allowing external systems to monitor, alert, and respond immediately.

## Core Properties

### Event Type

```python
event_type: str          # Type of event (turn_complete, session_end, error, etc.)
```

**Common event types:**
- `session_start` - Session begins
- `turn_start` - Turn begins
- `turn_complete` - Turn finishes successfully
- `turn_error` - Turn fails
- `tool_call` - Tool execution occurs
- `session_end` - Session completes
- `trace_export` - Trace exported

### Identifiers

```python
session_id: UUID         # Session that generated this event
trace_id: UUID          # Associated trace ID
turn_id: Optional[UUID] # Turn ID if turn-specific event
event_id: UUID          # Unique event identifier
```

### Timestamp

```python
timestamp: str           # ISO 8601 timestamp when event occurred
```

### Payload

```python
data: dict[str, Any]     # Event-specific data
metadata: dict[str, Any] # Additional context
```

## Event Types

### Session Events

#### session_start

Published when a new session begins.

```python
{
    "event_type": "session_start",
    "event_id": "evt_abc123",
    "session_id": "session_xyz789",
    "trace_id": "session_xyz789",
    "timestamp": "2024-03-21T10:00:00.000Z",
    "data": {
        "session_name": "customer-support",
        "tags": ["production", "support"],
        "metadata": {
            "user_id": "user_456"
        }
    }
}
```

#### session_end

Published when a session completes.

```python
{
    "event_type": "session_end",
    "event_id": "evt_def456",
    "session_id": "session_xyz789",
    "trace_id": "session_xyz789",
    "timestamp": "2024-03-21T10:15:00.000Z",
    "data": {
        "turn_count": 5,
        "total_duration_ms": 15000.0,
        "total_tokens": 2500,
        "session_name": "customer-support"
    }
}
```

### Turn Events

#### turn_start

Published when a turn begins.

```python
{
    "event_type": "turn_start",
    "event_id": "evt_ghi789",
    "session_id": "session_xyz789",
    "trace_id": "session_xyz789",
    "turn_id": "turn_001",
    "timestamp": "2024-03-21T10:01:00.000Z",
    "data": {
        "turn_number": 1,
        "model": "gpt-4",
        "message_count": 2
    }
}
```

#### turn_complete

Published when a turn finishes successfully.

```python
{
    "event_type": "turn_complete",
    "event_id": "evt_jkl012",
    "session_id": "session_xyz789",
    "trace_id": "session_xyz789",
    "turn_id": "turn_001",
    "timestamp": "2024-03-21T10:01:01.250Z",
    "data": {
        "turn_number": 1,
        "model": "gpt-4",
        "duration_ms": 1250.0,
        "usage": {
            "prompt_tokens": 45,
            "completion_tokens": 12,
            "total_tokens": 57
        },
        "has_tool_calls": false
    }
}
```

#### turn_error

Published when a turn fails.

```python
{
    "event_type": "turn_error",
    "event_id": "evt_mno345",
    "session_id": "session_xyz789",
    "trace_id": "session_xyz789",
    "turn_id": "turn_002",
    "timestamp": "2024-03-21T10:02:00.000Z",
    "data": {
        "turn_number": 2,
        "error_type": "APIError",
        "error_message": "Rate limit exceeded",
        "error_details": {...}
    }
}
```

### Tool Events

#### tool_call_start

Published when tool execution begins.

```python
{
    "event_type": "tool_call_start",
    "event_id": "evt_pqr678",
    "session_id": "session_xyz789",
    "turn_id": "turn_003",
    "timestamp": "2024-03-21T10:03:00.000Z",
    "data": {
        "tool_name": "get_weather",
        "arguments": {"location": "Paris"}
    }
}
```

#### tool_call_complete

Published when tool execution finishes.

```python
{
    "event_type": "tool_call_complete",
    "event_id": "evt_stu901",
    "session_id": "session_xyz789",
    "turn_id": "turn_003",
    "timestamp": "2024-03-21T10:03:00.450Z",
    "data": {
        "tool_name": "get_weather",
        "duration_ms": 450.0,
        "result": {
            "temperature": 18,
            "conditions": "sunny"
        }
    }
}
```

### Export Events

#### trace_export

Published when a trace is exported.

```python
{
    "event_type": "trace_export",
    "event_id": "evt_vwx234",
    "session_id": "session_xyz789",
    "trace_id": "session_xyz789",
    "timestamp": "2024-03-21T10:15:01.000Z",
    "data": {
        "export_format": "json",
        "file_path": ".mudipu/traces/session_xyz789.json",
        "file_size_bytes": 15360
    }
}
```

## Event Publishing

### NATS Messaging

Events are published via NATS for real-time distribution.

```python
# Events published to NATS topics
mudipu.events.session_start
mudipu.events.turn_complete
mudipu.events.tool_call
mudipu.events.session_end
```

### Event Configuration

```python
from mudipu import MudipuConfig

config = MudipuConfig(
    # Enable platform events
    platform_enabled=True,
    platform_url="nats://platform.mudipu.dev:4222",
    api_key="your-api-key"
)
```

### Event Filtering

Subscribe to specific event types:

```python
# Subscribe to turn completion events only
nats_client.subscribe("mudipu.events.turn_complete", handler=handle_turn_complete)

# Subscribe to all session events
nats_client.subscribe("mudipu.events.session_*", handler=handle_session_events)

# Subscribe to errors
nats_client.subscribe("mudipu.events.*_error", handler=handle_errors)
```

## Event Consumers

### Real-Time Dashboard

```python
async def update_dashboard(event: dict):
    """Update real-time dashboard with event data."""
    if event["event_type"] == "turn_complete":
        dashboard.add_turn_metrics({
            "tokens": event["data"]["usage"]["total_tokens"],
            "duration": event["data"]["duration_ms"]
        })
```

### Alerting System

```python
async def check_alerts(event: dict):
    """Alert on anomalies."""
    if event["event_type"] == "turn_complete":
        # Alert on slow turns
        if event["data"]["duration_ms"] > 5000:
            alert.send(f"Slow turn: {event['data']['duration_ms']}ms")
        
        # Alert on high token usage
        if event["data"]["usage"]["total_tokens"] > 1000:
            alert.send(f"High token usage: {event['data']['usage']['total_tokens']}")
```

### Cost Tracking

```python
async def track_costs(event: dict):
    """Track real-time costs."""
    if event["event_type"] == "turn_complete":
        usage = event["data"]["usage"]
        cost = calculate_cost(usage)
        
        cost_tracker.add({
            "timestamp": event["timestamp"],
            "session_id": event["session_id"],
            "cost": cost
        })
```

### Audit Logging

```python
async def audit_log(event: dict):
    """Log all events for compliance."""
    audit_db.insert({
        "event_type": event["event_type"],
        "timestamp": event["timestamp"],
        "session_id": event["session_id"],
        "user_id": event.get("metadata", {}).get("user_id"),
        "data": json.dumps(event["data"])
    })
```

## Event Handling Patterns

### Event Aggregation

```python
class EventAggregator:
    def __init__(self):
        self.events = []
    
    async def handle_event(self, event: dict):
        self.events.append(event)
        
        # Aggregate by session
        session_events = self.get_session_events(event["session_id"])
        
        if len(session_events) >= 5:
            await self.analyze_session(session_events)
    
    def get_session_events(self, session_id: str):
        return [e for e in self.events if e["session_id"] == session_id]
```

### Event Replay

```python
async def replay_events(events: list[dict]):
    """Replay events for testing or analysis."""
    for event in sorted(events, key=lambda e: e["timestamp"]):
        await process_event(event)
        await asyncio.sleep(0.1)  # Simulate timing
```

### Event Filtering

```python
def filter_events(events: list[dict], **filters):
    """Filter events by criteria."""
    filtered = events
    
    if "event_type" in filters:
        filtered = [e for e in filtered if e["event_type"] == filters["event_type"]]
    
    if "session_id" in filters:
        filtered = [e for e in filtered if e["session_id"] == filters["session_id"]]
    
    return filtered
```

## Use Cases

### Real-Time Monitoring

Monitor LLM application health in real-time:
- Track token usage trends
- Monitor response times
- Detect errors immediately
- Alert on anomalies

### Cost Control

Implement real-time cost management:
- Track spending per session
- Set budget alerts
- Throttle expensive operations
- Generate cost reports

### Quality Assurance

Ensure response quality:
- Monitor tool call success rates
- Track response times
- Detect degraded performance
- Trigger human review

### Workflow Automation

Trigger automated workflows:
- Start follow-up tasks after session end
- Escalate on errors
- Queue analysis jobs
- Update external systems

## Best Practices

### Event Design

```python
# Include enough context
event = {
    "event_type": "turn_complete",
    "session_id": session_id,  # Essential
    "turn_id": turn_id,        # Essential
    "data": {
        # Sufficient for immediate decisions
        "duration_ms": duration,
        "tokens": tokens,
        "has_tool_calls": has_tools
    },
    "metadata": {
        # Additional context
        "user_id": user_id,
        "environment": "production"
    }
}
```

### Idempotent Handlers

```python
async def idempotent_handler(event: dict):
    """Handle events idempotently."""
    event_id = event["event_id"]
    
    # Check if already processed
    if await processed_events.exists(event_id):
        return
    
    # Process event
    await process(event)
    
    # Mark as processed
    await processed_events.add(event_id)
```

### Error Recovery

```python
async def resilient_handler(event: dict):
    """Handle events with retry logic."""
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            await process_event(event)
            break
        except Exception as e:
            if attempt == max_retries - 1:
                await dead_letter_queue.add(event)
            else:
                await asyncio.sleep(2 ** attempt)
```

### Performance

```python
# Use async for high throughput
async def fast_handler(event: dict):
    # Non-blocking operations
    await asyncio.gather(
        update_metrics(event),
        log_event(event),
        notify_subscribers(event)
    )
```

## Event vs. Trace

**Events** are real-time, pushed as operations occur.
**Traces** are complete records, created after session ends.

```
Session Active:
  Turn 1 → turn_complete event → Real-time dashboard updates
  Turn 2 → turn_complete event → Cost tracker updates
  Turn 3 → turn_complete event → Metrics updated

Session Ends:
  → session_end event
  → Trace exported
  → Complete analysis available
```

## Related Concepts

- **[Session](./session.md)** - Sessions generate events
- **[Turn](./turn.md)** - Turn events are most common
- **[Trace](./trace.md)** - Traces complement events
- **[Tool Call](./tool-call.md)** - Tool events track execution

## Next Steps

- Learn about [Platform integration](../platform/events.md)
- Explore [Event handlers](../sdk/events.md)
- See [Event streaming examples](../examples/events.md)

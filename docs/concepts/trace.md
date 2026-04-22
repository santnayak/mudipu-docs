# Trace

A **Trace** is the complete, immutable record of a [session](./session.md) including all [turns](./turn.md), [spans](./span.md), metadata, and statistics. It represents the final, exportable snapshot of an LLM interaction workflow.

## Overview

When a session ends, it becomes a trace - a comprehensive record that can be exported, analyzed, stored, and shared. Traces enable post-session analysis, debugging, cost attribution, and performance optimization.

## Trace Structure

A trace contains the complete session data:

```python
{
    # Session identifiers
    "session_id": "uuid-123",
    "trace_id": "uuid-123",
    
    # Metadata
    "name": "customer-support-session",
    "tags": ["production", "support"],
    "metadata": {
        "user_id": "user_456",
        "environment": "production"
    },
    
    # Timestamps
    "created_at": "2024-03-21T10:00:00Z",
    "ended_at": "2024-03-21T10:15:30Z",
    
    # Complete turn history
    "turns": [
        {
            "turn_number": 1,
            "timestamp": "2024-03-21T10:00:05Z",
            "model": "gpt-4",
            "request_messages": [...],
            "response_message": {...},
            "duration_ms": 1250.0,
            "usage": {...}
        },
        {
            "turn_number": 2,
            # ... turn 2 data
        }
    ],
    
    # Aggregated statistics
    "turn_count": 5,
    "total_duration_ms": 15250.0,
    "total_tokens": 2500,
    
    # Export metadata
    "export_metadata": {
        "exported_at": "2024-03-21T10:15:31Z",
        "sdk_version": "0.1.0",
        "format_version": "1.0",
        "exporter_type": "json"
    }
}
```

## Trace Lifecycle

### 1. Session Active

While the session is active, turns are being added and statistics updated in real-time.

```python
from mudipu import MudipuTracer

tracer = MudipuTracer(session_name="my-session")

with tracer.trace_session():
    # Turns are added as operations occur
    response1 = call_llm("Question 1")
    response2 = call_llm("Question 2")
    # Session is still active
```

### 2. Session End

When the session ends, it becomes a complete trace ready for export.

```python
# End the session
session = tracer.end_session()

# Session is now a complete trace
print(f"Trace complete: {session.turn_count} turns")
```

### 3. Trace Export

The trace is exported to one or more formats.

```python
from mudipu.exporters import JSONExporter, HTMLExporter

# Export to JSON
json_exporter = JSONExporter()
json_path = json_exporter.export(session)
# Saved to: .mudipu/traces/session_abc123.json

# Export to HTML
html_exporter = HTMLExporter()
html_path = html_exporter.export(session)
# Saved to: .mudipu/traces/session_abc123.html
```

### 4. Trace Analysis

Exported traces can be loaded and analyzed.

```python
from mudipu.analyzer import TraceAnalyzer
from mudipu.exporters import JSONExporter

# Load a trace
exporter = JSONExporter()
session = exporter.load(Path(".mudipu/traces/session_abc123.json"))

# Analyze
analyzer = TraceAnalyzer(session)
stats = analyzer.get_statistics()
costs = analyzer.get_cost_estimate()
```

## Export Formats

### JSON Export

Machine-readable format for programmatic analysis.

**Use cases:**
- Long-term storage
- Programmatic analysis
- Integration with other tools
- Version control tracking

**Example:**
```json
{
  "session_id": "abc-123",
  "turns": [...],
  "total_tokens": 1500
}
```

### HTML Export

Human-readable format with visual presentation.

**Use cases:**
- Manual review and debugging
- Sharing with non-technical stakeholders
- Documentation and reports
- Quick visual inspection

**Features:**
- Syntax-highlighted messages
- Collapsible turn details
- Token usage charts
- Duration timelines

### Platform Export

Real-time streaming to Mudipu Platform via NATS.

**Use cases:**
- Centralized monitoring
- Team collaboration
- Real-time alerts
- Cross-application analytics

**Note:** Requires `mudipu[platform]` package.

```python
from mudipu.exporters import PlatformExporter

exporter = PlatformExporter(
    platform_url="nats://platform.mudipu.dev:4222",
    api_key="your-api-key"
)
exporter.export(session)
```

## Trace Analysis

### Statistics

```python
from mudipu.analyzer import TraceAnalyzer

analyzer = TraceAnalyzer(session)
stats = analyzer.get_statistics()

print(f"Turn count: {stats['turn_count']}")
print(f"Total tokens: {stats['total_tokens']}")
print(f"Average duration: {stats['avg_duration_ms']}ms")
print(f"Prompt tokens: {stats['prompt_tokens']}")
print(f"Completion tokens: {stats['completion_tokens']}")
```

### Cost Estimation

```python
costs = analyzer.get_cost_estimate()

print(f"Total cost: ${costs['total']:.4f}")
print(f"Prompt cost: ${costs['prompt_cost']:.4f}")
print(f"Completion cost: ${costs['completion_cost']:.4f}")

# Per-turn breakdown
for turn_cost in costs['per_turn']:
    print(f"Turn {turn_cost['turn_number']}: ${turn_cost['cost']:.4f}")
```

### Summary Generation

```python
from mudipu.analyzer import SummaryGenerator

summary_gen = SummaryGenerator(session)
text_summary = summary_gen.generate_text_summary()

print(text_summary)
# Output:
# Session: customer-support
# Duration: 15.25s
# Turns: 5
# Total tokens: 2,500
# Estimated cost: $0.0375
```

### Performance Insights

```python
# Find slowest turns
slow_turns = [t for t in session.turns if t.duration_ms > 2000]

# Find expensive turns
expensive_turns = [
    t for t in session.turns 
    if t.usage and t.usage['total_tokens'] > 500
]

# Identify tool usage patterns
tool_heavy_turns = [
    t for t in session.turns 
    if t.has_tool_calls
]
```

## Trace Comparison

Compare multiple traces to identify patterns:

```python
def compare_traces(trace1, trace2):
    """Compare two traces for analysis."""
    return {
        "turn_count_diff": trace2.turn_count - trace1.turn_count,
        "token_diff": trace2.total_tokens - trace1.total_tokens,
        "duration_diff": trace2.total_duration_ms - trace1.total_duration_ms
    }

# Compare before/after optimization
comparison = compare_traces(before_trace, after_trace)
print(f"Token reduction: {-comparison['token_diff']} tokens")
```

## Trace Storage

### Local Storage

Default storage location:
```
.mudipu/
  └── traces/
      ├── session_abc123.json
      ├── session_abc123.html
      ├── session_def456.json
      └── session_def456.html
```

### Custom Storage Location

```python
from mudipu import MudipuConfig, set_config
from pathlib import Path

config = MudipuConfig(
    trace_dir=Path("/custom/trace/directory")
)
set_config(config)
```

### Cloud Storage Integration

```python
# Export to JSON first
json_path = json_exporter.export(session)

# Upload to S3, GCS, etc.
upload_to_cloud(json_path)
```

## Trace Replay

Replay a trace to reproduce session behavior:

```python
from mudipu.exporters import JSONExporter

# Load trace
exporter = JSONExporter()
session = exporter.load(Path(".mudipu/traces/session_abc123.json"))

# Replay each turn
for turn in session.turns:
    print(f"\nTurn {turn.turn_number}")
    print(f"Model: {turn.model}")
    
    # Show request
    for msg in turn.request_messages:
        print(f"{msg['role']}: {msg['content']}")
    
    # Show response
    if turn.response_message:
        print(f"assistant: {turn.response_message.get('content')}")
```

## Trace Retention

### Automatic Cleanup

```python
from datetime import datetime, timedelta
from pathlib import Path

def cleanup_old_traces(trace_dir: Path, days: int = 30):
    """Delete traces older than specified days."""
    cutoff = datetime.now() - timedelta(days=days)
    
    for trace_file in trace_dir.glob("*.json"):
        if trace_file.stat().st_mtime < cutoff.timestamp():
            trace_file.unlink()
            print(f"Deleted old trace: {trace_file.name}")
```

### Selective Retention

```python
# Keep important traces longer
if session.tags and "production" in session.tags:
    retention_days = 90
elif "experimental" in session.tags:
    retention_days = 7
else:
    retention_days = 30
```

## Use Cases

### Debugging Issues

```python
# Load trace from production issue
session = exporter.load(Path("traces/problematic_session.json"))

# Inspect each turn
for turn in session.turns:
    if turn.duration_ms > 5000:
        print(f"Slow turn found: {turn.turn_number}")
        print(f"Messages: {turn.request_messages}")
```

### Cost Analysis

```python
# Analyze costs across multiple sessions
total_cost = 0
for trace_file in Path(".mudipu/traces").glob("*.json"):
    session = exporter.load(trace_file)
    analyzer = TraceAnalyzer(session)
    costs = analyzer.get_cost_estimate()
    total_cost += costs['total']

print(f"Total cost across all sessions: ${total_cost:.2f}")
```

### Performance Benchmarking

```python
# Compare different models
gpt4_sessions = [s for s in sessions if s.turns[0].model == "gpt-4"]
gpt35_sessions = [s for s in sessions if s.turns[0].model == "gpt-3.5-turbo"]

avg_gpt4_duration = sum(s.total_duration_ms for s in gpt4_sessions) / len(gpt4_sessions)
avg_gpt35_duration = sum(s.total_duration_ms for s in gpt35_sessions) / len(gpt35_sessions)
```

### Quality Assurance

```python
# Review traces with specific tags
production_traces = [
    s for s in sessions 
    if "production" in s.tags
]

# Check for errors or anomalies
for session in production_traces:
    if session.turn_count < 2:
        print(f"Short session detected: {session.session_id}")
```

## Best Practices

### Consistent Naming

```python
# Use descriptive session names
tracer = MudipuTracer(
    session_name=f"support-{ticket_id}-{date}"
)
```

### Meaningful Tags

```python
# Tag for easy filtering
tags = [
    "production",           # Environment
    "customer-support",     # Application area
    f"user-{user_tier}"    # User segment
]
```

### Export Configuration

```python
# Configure auto-export
config = MudipuConfig(
    auto_export=True,
    export_format="both"  # JSON and HTML
)
```

### Regular Analysis

```python
# Schedule regular trace analysis
def daily_trace_analysis():
    yesterday_traces = get_traces_from_yesterday()
    
    total_tokens = sum(t.total_tokens for t in yesterday_traces)
    total_cost = sum(analyze_cost(t) for t in yesterday_traces)
    
    send_daily_report(total_tokens, total_cost)
```

## Related Concepts

- **[Session](./session.md)** - Active state that becomes a trace
- **[Turn](./turn.md)** - Individual interactions within a trace
- **[Span](./span.md)** - Granular operations in a trace
- **[Event](./event.md)** - Real-time events during tracing

## Next Steps

- Learn about [Trace analysis tools](../sdk/analysis.md)
- Explore [Export formats](../sdk/exporters.md)
- See [Trace analysis examples](../examples/analysis.md)

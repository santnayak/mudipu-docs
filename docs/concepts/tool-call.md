# Tool Call

A **Tool Call** represents an LLM-initiated function or tool invocation. When an LLM decides it needs to execute external code, access data, or perform an action, it generates a tool call that bridges the language model to real-world operations.

## Overview

Modern LLMs (like GPT-4, Claude) support function calling - the ability to request specific tool executions with structured arguments. Tool calls are captured as special [spans](./span.md) within [turns](./turn.md), providing visibility into how LLMs interact with external systems.

## Core Properties

### Identifiers

```python
id: str                          # Unique identifier for this tool call
type: str                        # Call type (usually "function")
```

### Function Details

```python
function_name: Optional[str]     # Name of the function to call
function_arguments: Optional[str] # JSON-encoded function arguments
```

### Execution Context

```python
parent_turn_id: UUID             # Turn that initiated this tool call
execution_result: Optional[Any]  # Result returned by the tool
status: str                      # "pending", "completed", "failed"
```

## Tool Call Structure

### Basic Tool Call

```python
{
    "id": "call_abc123",
    "type": "function",
    "function_name": "get_weather",
    "function_arguments": "{\"location\": \"Paris\", \"unit\": \"celsius\"}"
}
```

### With Execution Result

```python
{
    "id": "call_abc123",
    "type": "function",
    "function_name": "get_weather",
    "function_arguments": "{\"location\": \"Paris\", \"unit\": \"celsius\"}",
    "execution_result": {
        "temperature": 18,
        "conditions": "sunny",
        "humidity": 65
    },
    "status": "completed",
    "duration_ms": 450.0
}
```

### Failed Tool Call

```python
{
    "id": "call_def456",
    "type": "function",
    "function_name": "database_query",
    "function_arguments": "{\"query\": \"SELECT * FROM users\"}",
    "execution_result": null,
    "status": "failed",
    "error": {
        "type": "DatabaseError",
        "message": "Connection timeout",
        "details": "..."
    },
    "duration_ms": 5000.0
}
```

## Tool Call Lifecycle

### 1. LLM Decision

The LLM determines it needs to call a tool based on the prompt and available tools.

```python
# User asks a question requiring external data
messages = [
    {"role": "user", "content": "What's the weather in Paris?"}
]

# LLM decides to call get_weather()
```

### 2. Tool Call Generation

The LLM generates a structured tool call in its response.

```python
response = {
    "role": "assistant",
    "content": null,  # No text content
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
}
```

### 3. Tool Execution

Your application executes the requested tool.

```python
@trace_tool("get_weather")
def get_weather(location: str) -> dict:
    """Fetch current weather for a location."""
    # Tool execution is automatically traced
    api_response = weather_api.get_current(location)
    return {
        "temperature": api_response.temp,
        "conditions": api_response.conditions
    }

# Execute the tool
result = get_weather(location="Paris")
```

### 4. Result Return

The tool result is sent back to the LLM in a subsequent turn.

```python
messages.append({
    "role": "tool",
    "tool_call_id": "call_123",
    "content": json.dumps(result)
})

# LLM synthesizes final response
final_response = client.chat.completions.create(
    model="gpt-4",
    messages=messages
)
```

## Tool Call Patterns

### Single Tool Call

```python
# Turn 1: User asks question
# LLM responds with tool call

# Turn 2: Tool result provided
# LLM synthesizes answer

messages = [
    {"role": "user", "content": "What's the weather?"},
    {"role": "assistant", "tool_calls": [...]},
    {"role": "tool", "tool_call_id": "call_123", "content": "{...}"},
    {"role": "assistant", "content": "It's 18°C and sunny in Paris."}
]
```

### Parallel Tool Calls

```python
# LLM requests multiple tools simultaneously
tool_calls = [
    {"id": "call_1", "function": {"name": "get_weather"}},
    {"id": "call_2", "function": {"name": "get_news"}},
    {"id": "call_3", "function": {"name": "get_stock_price"}}
]

# Execute in parallel
results = await asyncio.gather(
    get_weather(),
    get_news(),
    get_stock_price()
)
```

### Sequential Tool Calls

```python
# Turn 1: Initial tool call to get user ID
# Turn 2: Second tool call using the user ID result
# Turn 3: Final synthesis

# This creates a chain of tool-assisted turns
```

### Conditional Tool Calls

```python
# LLM decides whether to call a tool based on context

# If user asks factual question → call knowledge_base()
# If user asks for calculation → call calculator()
# If user asks for current data → call api()
# Otherwise → respond directly
```

## Tool Definition

### OpenAI Function Calling

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name, e.g., 'Paris'"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Temperature unit"
                    }
                },
                "required": ["location"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=messages,
    tools=tools
)
```

### Anthropic Tool Use

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string"}
            },
            "required": ["location"]
        }
    }
]

response = client.messages.create(
    model="claude-3-opus-20240229",
    messages=messages,
    tools=tools
)
```

## Instrumentation

### Automatic Tool Tracing

```python
from mudipu import trace_tool

@trace_tool("database_lookup")
def fetch_user_data(user_id: str):
    """Fetch user data from database."""
    # Execution is automatically traced
    result = db.query(f"SELECT * FROM users WHERE id = '{user_id}'")
    return result

# Usage
user = fetch_user_data("user_123")
# Creates a tool call span with duration, result, etc.
```

### Manual Tool Span

```python
from mudipu import MudipuTracer

tracer = MudipuTracer()

with tracer.tool_span("custom_operation") as span:
    result = perform_custom_operation()
    span.set_attribute("operation_type", "custom")
    span.set_attribute("result_size", len(result))
```

## Tool Call Analysis

### Execution Statistics

```python
# Analyze tool usage in a session
tool_calls = []
for turn in session.turns:
    tool_calls.extend(turn.tool_calls_detected)

print(f"Total tool calls: {len(tool_calls)}")

# Most frequent tools
from collections import Counter
tool_names = [tc.function_name for tc in tool_calls]
most_common = Counter(tool_names).most_common(5)
```

### Performance Metrics

```python
# Find slow tool calls
slow_tools = [
    tc for tc in tool_calls 
    if tc.duration_ms and tc.duration_ms > 1000
]

# Calculate average duration per tool
tool_durations = {}
for tc in tool_calls:
    name = tc.function_name
    if name not in tool_durations:
        tool_durations[name] = []
    tool_durations[name].append(tc.duration_ms)

# Average per tool
for name, durations in tool_durations.items():
    avg = sum(durations) / len(durations)
    print(f"{name}: {avg:.2f}ms average")
```

### Success Rate

```python
# Calculate tool success rate
successful = [tc for tc in tool_calls if tc.status == "completed"]
failed = [tc for tc in tool_calls if tc.status == "failed"]

success_rate = len(successful) / len(tool_calls) * 100
print(f"Tool success rate: {success_rate:.1f}%")
```

## Common Tool Types

### Data Retrieval

```python
@trace_tool("database_query")
def query_database(query: str):
    return db.execute(query)

@trace_tool("api_fetch")
def fetch_from_api(endpoint: str):
    return requests.get(endpoint).json()

@trace_tool("file_read")
def read_file(path: str):
    return Path(path).read_text()
```

### Computation

```python
@trace_tool("calculator")
def calculate(expression: str):
    return eval(expression)  # Use safely!

@trace_tool("data_analysis")
def analyze_data(data: list):
    return {
        "mean": statistics.mean(data),
        "median": statistics.median(data)
    }
```

### External Services

```python
@trace_tool("send_email")
def send_email(to: str, subject: str, body: str):
    return email_service.send(to, subject, body)

@trace_tool("web_search")
def search_web(query: str):
    return search_engine.search(query)
```

### System Operations

```python
@trace_tool("execute_command")
def run_command(command: str):
    return subprocess.run(command, capture_output=True)

@trace_tool("file_write")
def write_file(path: str, content: str):
    return Path(path).write_text(content)
```

## Error Handling

### Graceful Degradation

```python
@trace_tool("external_api_call")
def call_external_api(params: dict):
    try:
        return api.call(params)
    except Timeout:
        return {"error": "Service timeout", "fallback": True}
    except Exception as e:
        return {"error": str(e)}
```

### Retry Logic

```python
@trace_tool("resilient_api_call")
def call_with_retry(endpoint: str, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            return requests.get(endpoint).json()
        except RequestException:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)  # Exponential backoff
```

## Best Practices

### Clear Tool Names

```python
# Good: Descriptive and action-oriented
"get_weather"
"send_email"
"query_database"
"calculate_total"

# Avoid: Vague or unclear
"tool1"
"function"
"do_thing"
```

### Comprehensive Descriptions

```python
{
    "name": "get_weather",
    "description": "Get current weather conditions and forecast for a specific location. Returns temperature, conditions, humidity, and wind speed. Use city name or coordinates.",
    # Not: "Gets weather"
}
```

### Validate Arguments

```python
@trace_tool("get_user")
def get_user(user_id: str):
    # Validate before execution
    if not user_id or not user_id.startswith("user_"):
        raise ValueError("Invalid user_id format")
    
    return db.users.get(user_id)
```

### Return Structured Data

```python
@trace_tool("analyze_sentiment")
def analyze_sentiment(text: str):
    # Return structured, parseable data
    return {
        "sentiment": "positive",
        "confidence": 0.92,
        "details": {
            "positive": 0.92,
            "neutral": 0.05,
            "negative": 0.03
        }
    }
```

## Related Concepts

- **[Turn](./turn.md)** - Tool calls occur within turns
- **[Span](./span.md)** - Tool calls are special spans
- **[Session](./session.md)** - Context for tool call sequences
- **[Trace](./trace.md)** - Complete record of tool usage

## Next Steps

- Learn about [Tool instrumentation](../sdk/tools.md)
- Explore [Tool call patterns](../examples/tool-calling.md)
- See [Advanced tool usage](../best-practices/tools.md)

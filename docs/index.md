# Mudipu Documentation

Welcome to the official **Mudipu** documentation. Mudipu is a developer-facing instrumentation platform for tracking, analyzing, and optimizing LLM interactions in AI agents and applications.

## What is Mudipu?

Mudipu provides a comprehensive observability solution for Large Language Model (LLM) applications, enabling developers to:

- **Track interactions** - Capture every LLM call, tool invocation, and conversation turn
- **Analyze performance** - Monitor token usage, costs, latency, and quality metrics
- **Debug issues** - Replay sessions and inspect detailed trace data
- **Optimize costs** - Identify expensive patterns and reduce unnecessary token usage
- **Ensure quality** - Monitor response quality and detect anomalies

## Architecture Overview

Mudipu consists of three main components:

### 1. **Mudipu SDK** (Python)
Developer-facing instrumentation package that integrates directly into your application code with minimal friction.

- Decorator-based instrumentation
- Zero-config setup with sensible defaults
- Local-first privacy model
- Multiple export formats (JSON, HTML)

### 2. **Mudipu Platform**
Centralized platform for aggregating, analyzing, and visualizing traces across multiple applications.

- Real-time trace ingestion via NATS
- Advanced analytics and dashboards
- Team collaboration features
- Custom alerting and monitoring

### 3. **Mudipu Gateway**
API gateway that handles authentication, rate limiting, and routing between SDKs and the platform.

## Key Concepts

Understanding Mudipu's data model is essential for effective instrumentation and analysis:

- **[Session](./concepts/session.md)** - A logical grouping of interactions, typically representing a user conversation or task
- **[Turn](./concepts/turn.md)** - A single request-response cycle with an LLM
- **[Span](./concepts/span.md)** - A discrete unit of work within a turn (LLM call, tool execution, etc.)
- **[Trace](./concepts/trace.md)** - The complete record of a session with all its turns and spans
- **[Tool Call](./concepts/tool-call.md)** - An LLM-initiated function or tool invocation
- **[Event](./concepts/event.md)** - System events published during trace capture

## Getting Started

### Quick Start

```bash
# Install the Python SDK
pip install mudipu

# Add to your code
from mudipu import MudipuTracer, trace_llm

tracer = MudipuTracer(session_name="my-app")

with tracer.trace_session():
    # Your LLM code here
    pass
```

### Documentation Sections

- **[Core Concepts](./concepts/index.md)** - Understand Mudipu's data model and architecture
- **[SDK Guide](./sdk/index.md)** - Python SDK installation, configuration, and usage
- **[Platform Guide](./platform/index.md)** - Platform setup and features
- **[API Reference](./api/index.md)** - Complete API documentation
- **[Examples](./examples/index.md)** - Real-world usage examples
- **[Best Practices](./best-practices/index.md)** - Patterns and recommendations

## Use Cases

**Chatbots & Assistants**
- Track multi-turn conversations
- Monitor response quality
- Analyze user satisfaction

**AI Agents**
- Debug complex tool chains
- Optimize execution paths
- Monitor agent behavior

**LLM Applications**
- Cost monitoring and optimization
- Performance benchmarking
- Error tracking and debugging

## Community & Support

- **GitHub**: [https://github.com/santnayak/mudipu](https://github.com/santnayak/mudipu)
- **Issues**: [Report bugs or request features](https://github.com/santnayak/mudipu/issues)
- **Email**: support@mudipu.dev
- **Discord**: Join our community (coming soon)

## License

Mudipu is open source software licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

**Ready to get started?** Head over to the [Core Concepts](./concepts/index.md) to understand Mudipu's foundation, or jump straight to the [SDK Quick Start](./sdk/quickstart.md).

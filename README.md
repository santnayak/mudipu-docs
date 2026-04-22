# Mudipu Documentation

This directory contains the comprehensive public-facing documentation for Mudipu, a developer-facing instrumentation platform for tracking and analyzing LLM interactions.

## 📁 Documentation Structure

```
mudipu-docs/
├── index.md                    # Main landing page
├── sidebars.js                 # Docusaurus navigation configuration
├── README.md                   # This file
│
├── concepts/                   # Core concepts and data model
│   ├── index.md               # Concepts overview
│   ├── session.md             # Session documentation
│   ├── turn.md                # Turn documentation
│   ├── span.md                # Span documentation
│   ├── trace.md               # Trace documentation
│   ├── tool-call.md           # Tool Call documentation
│   └── event.md               # Event documentation
│
├── sdk/                       # Python SDK documentation (to be created)
│   ├── index.md               # SDK overview
│   ├── quickstart.md          # Quick start guide
│   ├── installation.md        # Installation instructions
│   ├── configuration.md       # Configuration options
│   ├── sessions.md            # Session management
│   ├── decorators.md          # Decorator usage
│   ├── tools.md               # Tool instrumentation
│   ├── exporters.md           # Export formats
│   ├── analysis.md            # Trace analysis
│   ├── integrations.md        # LLM integrations
│   └── cli.md                 # CLI reference
│
├── platform/                  # Platform documentation (to be created)
│   ├── index.md               # Platform overview
│   ├── setup.md               # Platform setup
│   ├── events.md              # Event streaming
│   ├── dashboard.md           # Dashboard usage
│   ├── analytics.md           # Analytics features
│   └── collaboration.md       # Team collaboration
│
├── api/                       # API reference (to be created)
│   ├── index.md               # API overview
│   ├── tracer.md              # MudipuTracer API
│   ├── decorators.md          # Decorator reference
│   ├── models.md              # Data models
│   ├── exporters.md           # Exporter API
│   ├── analyzer.md            # Analyzer API
│   └── config.md              # Configuration API
│
├── examples/                  # Usage examples (to be created)
│   ├── index.md               # Examples overview
│   ├── sessions.md            # Session examples
│   ├── turns.md               # Turn examples
│   ├── spans.md               # Span examples
│   ├── tool-calling.md        # Tool calling examples
│   ├── analysis.md            # Analysis examples
│   ├── events.md              # Event handling examples
│   ├── chatbot.md             # Chatbot example
│   ├── agent.md               # AI agent example
│   └── batch-processing.md    # Batch processing example
│
├── best-practices/            # Best practices (to be created)
│   ├── index.md               # Best practices overview
│   ├── instrumentation.md     # Instrumentation patterns
│   ├── session-management.md  # Session management
│   ├── cost-optimization.md   # Cost optimization
│   ├── performance.md         # Performance optimization
│   ├── security.md            # Security considerations
│   └── error-handling.md      # Error handling
│
└── advanced/                  # Advanced topics (to be created)
    ├── custom-exporters.md    # Building custom exporters
    ├── custom-analyzers.md    # Building custom analyzers
    ├── event-handlers.md      # Advanced event handling
    ├── multi-agent.md         # Multi-agent systems
    └── scaling.md             # Scaling considerations
```

## ✅ Completed Documentation

### Core Concepts (100% Complete)
All atomic components are now fully documented:
- ✅ **Index**: Overview of data model and relationships
- ✅ **Session**: Logical grouping of interactions
- ✅ **Turn**: Single LLM request-response cycle
- ✅ **Span**: Discrete unit of work
- ✅ **Trace**: Complete session record
- ✅ **Tool Call**: LLM-initiated function execution
- ✅ **Event**: Real-time system events

Each concept document includes:
- Overview and purpose
- Core properties and structure
- Lifecycle and usage patterns
- Code examples
- Analysis patterns
- Use cases
- Best practices
- Related concepts

## 🚧 Work in Progress

The following sections are planned and need to be created:

### High Priority
- [ ] SDK Guide (quickstart, installation, configuration)
- [ ] Examples (chatbot, agent, tool calling)
- [ ] API Reference (core classes and methods)

### Medium Priority
- [ ] Platform Guide (setup, events, dashboard)
- [ ] Best Practices (instrumentation, optimization)
- [ ] Troubleshooting guide
- [ ] FAQ

### Low Priority
- [ ] Advanced topics (custom exporters, scaling)
- [ ] Changelog
- [ ] Migration guides

## 🎨 Documentation Style

### Docusaurus Format
This documentation is designed for Docusaurus, a modern static site generator. Key features:

- **Markdown-based**: All docs written in Markdown
- **Sidebar navigation**: Configured via `sidebars.js`
- **Search**: Built-in search functionality
- **Versioning**: Support for multiple versions
- **Dark mode**: Automatic dark/light theme support

### Content Structure

Each document follows this structure:

1. **Title**: Clear, descriptive H1 heading
2. **Overview**: Brief introduction (1-2 paragraphs)
3. **Core Properties/Structure**: Detailed explanation
4. **Examples**: Code examples and use cases
5. **Analysis/Patterns**: How to work with the concept
6. **Best Practices**: Recommendations
7. **Related Concepts**: Links to related docs
8. **Next Steps**: Suggested reading

### Writing Guidelines

- **Clarity**: Use simple, clear language
- **Examples**: Include practical code examples
- **Structure**: Use consistent headings and formatting
- **Links**: Cross-reference related concepts
- **Code**: Syntax-highlighted, runnable examples
- **Diagrams**: ASCII art or mermaid diagrams where helpful

## 🚀 Using This Documentation

### For Developers

If you're building with Mudipu:
1. Start with [index.md](./index.md) for overview
2. Read [Core Concepts](./concepts/index.md) to understand the data model
3. Follow SDK Guide for implementation (coming soon)
4. Check Examples for real-world patterns (coming soon)

### For Documentation Contributors

To add or update documentation:

1. **Create/Edit Markdown files** in appropriate directories
2. **Update sidebars.js** to include new pages in navigation
3. **Follow existing patterns** for consistency
4. **Include code examples** with proper syntax highlighting
5. **Cross-reference** related concepts using relative links
6. **Test locally** with Docusaurus if possible

### File Naming Conventions

- Use lowercase with hyphens: `tool-call.md`, not `ToolCall.md`
- Use descriptive names: `session-management.md`, not `sessions.md` (for guides)
- Index files: `index.md` for section overviews
- Match sidebar IDs to file paths

## 🔗 Integration with Docusaurus

### Configuration

This documentation is designed to work with Docusaurus 2.x. Key configuration:

```js
// docusaurus.config.js
module.exports = {
  title: 'Mudipu Documentation',
  tagline: 'Instrumentation for LLM Applications',
  url: 'https://docs.mudipu.dev',
  baseUrl: '/',
  organizationName: 'santnayak',
  projectName: 'mudipu',
  
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/santnayak/mudipu-docs/edit/main/',
        },
      },
    ],
  ],
};
```

### Deployment

The documentation should be deployed to:
- **Primary**: https://docs.mudipu.dev
- **GitHub Pages**: https://santnayak.github.io/mudipu-docs/
- **Vercel/Netlify**: For preview deployments

## 📊 Progress Tracking

### Completion Status

- Core Concepts: **100%** (7/7 complete)
- SDK Guide: **0%** (0/10 complete)
- Platform Guide: **0%** (0/6 complete)
- API Reference: **0%** (0/7 complete)
- Examples: **0%** (0/10 complete)
- Best Practices: **0%** (0/7 complete)
- Advanced: **0%** (0/5 complete)

**Overall Progress: ~12%** (7/59 planned documents)

### Next Steps

1. Create SDK quickstart guide
2. Create basic examples (chatbot, tool calling)
3. Document core API classes (MudipuTracer, decorators)
4. Create troubleshooting guide
5. Add FAQ section



## 📝 License

This documentation is part of the Mudipu project and is licensed under the GPL-3.0 License.

---

**Need help?** Open an issue at https://github.com/santnayak/mudipu/issues

# PersonaFlow

**Design Multi-Agent Systems with Precision**

PersonaFlow is a visual workspace for designing, validating, and documenting multi-agent architectures—before you write or run a single line of agent code. It runs entirely in your browser, stores designs locally, and requires no accounts or API keys.

![PersonaFlow Editor](src/assets/PersonaFlowEditor.png)

## Features

- **Visual Canvas Editor**: Drag-and-drop interface built with React Flow for designing agent architectures
- **Template Library**: Browse industry-standard patterns (Sequential Planner, Agentic RAG, Multi-Agent Debate, Human-in-the-Loop, and more) with filters, pagination, and a read-only graph preview
- **Multiple Agent Types**: Planners, Executors, Critics/Verifiers, and Routers
- **System Components**: Tools, Memory stores, and Human Checkpoints
- **Design-Time Analysis**: Real-time warnings for:
  - Unverified Executors (no downstream Critic or Human Checkpoint)
  - Unused Memory (read-only or write-only memory nodes)
  - Unbounded Loops (cycle detection in the graph)
- **Export**: Generate LangGraph-ready Python code from your designs
- **Layout Control**: Reflow graphs (top-to-bottom, left-to-right) with a single click
- **Dark Theme**: Modern, developer-friendly UI

## Non-Goals

PersonaFlow is intentionally **not**:

- An agent runtime or execution engine
- A chat UI or conversational interface
- An AI/LLM API integration tool

This app is about **design and reasoning**, not execution.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/harshabikkavilli/personaflow.git
cd personaflow

npm install
npm run dev
```

The app runs at **http://localhost:5173**.

### Build for Production

```bash
npm run build
npm run preview
```

## Routes

| Route       | Description          |
| ----------- | -------------------- |
| `/`         | Landing page         |
| `/editor`   | Visual canvas editor |
| `/examples` | Template library     |

## Project Structure

```
src/
├── analysis/          # Static analysis engine (warnings)
├── atoms/             # Jotai atoms (graph state, UI state, examples)
├── components/
│   ├── editor/        # Canvas, sidebar, panels, export, edges, nodes
│   ├── examples/      # Template library, cards, modal, pagination, preview
│   ├── layout/        # App layout, header, nav
│   └── ui/            # Reusable UI components (Panel, Modal, Badge, Button, etc.)
├── constants/         # Node constants, example filters, etc.
├── data/              # Example graphs and templates
├── hooks/             # Custom React hooks (canvas interactions, export, pagination, etc.)
├── pages/             # LandingPage, EditorPage, ExamplesPage
├── types/             # TypeScript definitions
└── utils/             # Business logic utilities (export, layout, LangGraph codegen)
```

## Usage

### Editor

1. **Add nodes**: Drag a component from the left sidebar onto the canvas
2. **Connect nodes**: Drag from a node’s bottom handle to another node’s top handle
3. **Edit edges**: Click an edge to add or change its label
4. **View details**: Click a node to see and edit its properties in the right panel
5. **Layout**: Use the layout control to reflow the graph
6. **Export**: Use “Export” in the top strip to generate LangGraph code

### Node Types

**Agents:** Planner, Executor, Critic/Verifier, Router

**System:** Tool, Memory, Human Checkpoint

### Understanding Warnings

- **Unverified Executor**: Add a downstream Critic or Human Checkpoint
- **Unused Memory**: Connect memory with both incoming (write) and outgoing (read) edges
- **Possible Loop**: Remove or rethink cycles to avoid unbounded recursion

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

MIT License

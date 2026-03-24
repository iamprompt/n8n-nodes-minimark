# n8n-nodes-minimark

This is an n8n community node. It lets you use [Minimark](https://www.npmjs.com/package/minimark) utilities in your n8n workflows.

Minimark is a minimal representation of Abstract Syntax Trees (AST) for Markdown.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- **Stringify**: Convert Minimark AST (JSON) back to Markdown.
- **Get Text Content**: Extract plain text from Minimark AST.

## Compatibility

- n8n version 1.0.0 and above.

## Usage

### Stringify

Convert a Minimark AST JSON structure to a Markdown string.

**Input AST:**
```json
[
  ["h1", {}, "Hello World"],
  ["p", {}, "This is a ", ["strong", {}, "Minimark"], " test."]
]
```

**Output Markdown:**
```markdown
# Hello World

This is a **Minimark** test.
```

### Get Text Content

Extract all text from a Minimark AST and join it into a single string.

**Input AST:**
```json
[
  ["h1", {}, "Hello World"],
  ["p", {}, "This is a ", ["strong", {}, "Minimark"], " test."]
]
```

**Output Text:**
```text
Hello World This is a Minimark test.
```

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Minimark npm package](https://www.npmjs.com/package/minimark)

## Version history

### 1.0.0
- Initial release with Stringify and Text Content operations.

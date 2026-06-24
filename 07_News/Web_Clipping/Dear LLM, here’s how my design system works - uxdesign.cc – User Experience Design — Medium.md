# Dear LLM, here’s how my design system works

**Author:** Oleksandra Huba

**Source:** uxdesign.cc – User Experience Design — Medium

**Published:** 2025-11-19T07:19:25+00:00

**URL:** <https://uxdesign.cc/dear-llm-heres-how-my-design-system-
works-b59fb9a342b7?source=rss----138adf9c44c---4>

* * *

## 記事本文

How to get production-ready code from AI by structuring Figma file, connecting
your design system with Figma MCP, and writing better prompts.Image by the
author, overview of Ivy Design System componentsRight, pull up a chair, grab
your coffee. We need to talk about the new team member. They’re brilliant,
frankly, work all hours and can write boilerplate code in their sleep. They’re
also a bit… literal. This new team member is an AI agent, and it’s changing
how we go from design to code.But here’s the reality check as Figma’s recent
AI report ↗ found that while 68% of developers are using AI to write code,
only 32% actually trust the output. The problem isn’t the AI’s ability to
write code, it’s the AI’s ability to understand context.Now, we could spend a
whole other coffee chat talking about how brilliant AI is for spinning up
quick interactive prototypes for stakeholders and testing. And, indeed, it’s a
valid way to work. But to grow trust in AI to write real, production-ready
code, we have to give it clean data with clear context to work with in the
first place.So, how does this happen? Until recently, we could only give an AI
a screenshot and hope for the best. That’s changing with something called the
Model Context Protocol (MCP) ↗. Think of the new Figma MCP server as an
interpreter for your Figma files that sends rich, structured information to
the LLM. The process looks simple: Figma file → Figma MCP → LLM. But for it to
work, every step needs to be packed with meaning. Simply throwing a prompt and
a Figma link at an AI agent and hoping for the best is not going to work.Build
foundation in FigmaThe foundation of any good design-to-code workflow, whether
for a human or an AI, is a Figma file that clearly communicates its own
intent. Every decision you make in how you structure your file can either
bring clarity or create confusion.First things first, master your structure
hygiene. An AI reads your layer tree to understand your design’s structure, so
a messy tree leads to a messy DOM. Name everything with purpose. Instead of
Frame 74, use names that describe what something is or what it does, like
CreateProjectModal or ProjectForm. This directly influences the names of the
components and elements the AI generates. While you’re at it, try to keep your
structure as flat as possible. Avoid deep, unnecessary nesting. If a group
isn’t serving a specific layout purpose, get rid of it. A flatter hierarchy is
simply easier for everyone to understand.Image by the author, showing the
improvement from generic layer structure to a clean, semantically-named
oneNext think and build components like a developer defining their API. Your
layer order should reflect the visual hierarchy or, for the web, the DOM
order. This is a massive help for accessibility and logical code output.Use
variants for states like State: Default | Hover | Disabled. This maps directly
to CSS pseudo-classes or state props.Use a boolean property (Icon: True |
False) to show or hide an element. It’s cleaner than separate variants and
translates perfectly to a prop like showIcon={true}.Use the new slots ↗
feature from Figma to define flexible content areas. This is a massive
improvement over simple instance swaps because it directly maps to the concept
of “slots” or the children prop in code.Let’s be honest, Auto Layout should be
your default for almost everything. It’s the clearest way to communicate
layout intent. Use absolute positioning sparingly, keeping it for specific
cases like notification badges or modal overlays. We’ve all seen the mess that
older design-to-code tools made by sprinkling position: absolute
everywhere.Move beyond primitive names like blue-500 and embrace semantic
tokens that describe purpose. For example, color-button-background-brand tells
the AI not just what color this is, but why it exists. This tells the AI why
this color exists. For a masterclass on this, check out the article series by
Nate Baldwin ↗Image by author, Visual breakdown of how to move from primitive
color values to a purpose-driven semantic token systemWhen some context can’t
be built, use Figma’s annotation tools or plugins like Annotate It! ↗ to
explicitly call out interaction details, accessibility requirements, or
behavior. These notes will become part of the prompt eventually.Screenshot by
the author, demonstrating component annotation in FigmaWhile this may feel
like a demanding level of detail, this very precision is a huge efficiency
gain. By giving the LLM clear context from your designs, you help it use far
fewer tokens to get the right answer.Map designs to codebaseThe gold standard
is to explicitly map designs to code, and creating your own codebase. An AI
should consume your existing components, not generate new ones. Without a
direct link to your codebase, the AI relies on inaccurate searches that result
in redundant code. Tools like Figma’s Code Connect ↗ or third-party
integrations with Storybook create this essential link, turning your Figma
components into pointers to the real components in your repository.A
screenshot of the Code Connect UI feature linking a Figma component to its
corresponding React code. Image from the official Figma developer
documentationBut what if you don’t have a codebase yet?You can absolutely use
these tools without a connected codebase. The AI will analyze your Figma file
and generate new code from scratch that is great for quick prototypes or
iterating on ideas. However, understand the trade-offs: you get generated
code, not system code; it’s less efficient; and it creates technical debt that
a developer will have to refactor later.A practical middle ground is to use
the AI to create a “scaffold.” Let it generate the initial components, then
treat that output as the first version of your design system’s codebase. From
there, you refine it, connect it back to Figma, and build a sustainable
system.Extra: The ultimate source of truth with components as dataThe ultimate
source of truth is defining components as structured data (JSON), not as Figma
drawings. For a deeper dive into this architectural approach, Nathan Curtis’
article “Components as Data” ↗ is an essential read. LLMs thrive on structured
data, whereas the standard MCP workflow provides an “incomplete and imprecise”
interpretation of your visual design. Tools like the Anova plugin for Figma ↗
can help you get started. This data-first approach is the future of building
AI-ready design systems.Give your AI a “cheat sheet”Whether you’re connecting
to code or defining components as data, you still need to guide the AI’s
behavior. This involves two skills: writing better prompts and creating a set
of rules for the AI to follow. On more in-depthWrite context-rich promptsYour
prompt is your direct instruction. The more specific, the better.Instead of:
“Make this a component.”Try: “Generate a React component for the selected
frame using our design system library. Place the new file in
src/components/ui/ and name it PricingCard.tsx.”Split your work into
consumable bites: the nav bar, then the sidebar, then a content card. If you
give them too much at once, AI agents can “choke” on the context and create a
mess. Build your UI gradually.Set custom rulesWhile one-off prompts are great
for specific tasks, the real power comes from creating a permanent “cheat
sheet” that the AI can reference every single time.In your project root,
create a dedicated folder like .docs/ or .ai/. Inside, create your three core
rules files: README.md file (for foundational rules), design-system-rules.md
(for how to use our components), figma-mcp-rules.md (for the specific Figma
MCP workflow).Screenshot by the author of Cursor IDE with project structure
and dedicated folder for AI rulesIn your IDE settings or at the start of every
prompt, you now reference README.md file that instruct the AI on how to use
them together.README.mdThis file acts as the primary entry point. It defines
the core tech stack and file structure, and most importantly, it instructs the
AI to use the other two files as part of its context.# AI Coding Guidelines:
This repo uses Figma MCP. For instructions, for styles, mappings and design of
components you MUST read and strictly apply the rules from all three of the
following files:1. This `README.md` file (for foundational rules).2. `design-
system-rules.md` (for how to use our components).3. `figma-mcp-rules.md` (for
the specific Figma-to-code process).---## Core Principles & Best Practices-
Expert Persona: Act as an expert senior frontend developer writing clean,
accessible, and maintainable TypeScript and React.- Accessibility: All
components must meet WCAG 2.1 AA standards.- Performance: Optimize for
performance. Code should have linear time/space complexity where possible.-
Testing: Suggest testable code.---## Core Technologies (React & Tailwind)-
Framework: React- Language: TypeScript- Styling:Tailwind CSS, configured via
`tailwind.config.js`.---## File Structure & Naming Conventions- Components:
Place all new components in `src/components/`. - Reusable UI
Primitives:`src/components/ui/` (e.g., Button, Input). - Feature-Specific
Components: `src/components/feature/` (e.g., `UserProfileCard`).- Component
Files: Use PascalCase for filenames. Each component must be in its own folder.
(e.g., `src/components/ui/Button/Button.tsx`)- Hooks: Custom hooks go in
`src/hooks/` and should be named with the `use` prefix (e.g.,
`useUserData.ts`).design-system-rules.mdThis is the detailed guide on how to
correctly use your custom components from your-design-system.# Design System
Usage RulesThis document outlines how to correctly implement components and
styles from `your-design-system`.---## Component Architecture & Styling-
Design System First: Always use existing components from the `your-design-
system` package. Do not rebuild them.- Layout Primitives: Always use layout
components from `your-design-system` (e.g., ``, ``). Do not use raw `div`s
with custom flexbox CSS.- Styling with Tokens: Use Tailwind utility classes
that are configured in our `tailwind.config.js`. Prefer our custom theme
utilities (e.g., `bg-brand-primary`) over default Tailwind colors.- Icons: Use
the `` component from `your-design-system`, passing the appropriate icon name.
Do not import raw SVGs.- Props: Component props must be defined with a
TypeScript `interface`.---## What to Avoid- No Hardcoded Values: Do not use
hardcoded strings (use translation files), URLs (use config files), or styling
values (use tokens).- No Inconsistent Naming: Follow the project's naming
conventions.- No Ignoring Errors: Do not ignore TypeScript errors.- No
Unnecessary DOM: Avoid unnecessary `div` wrappers.figma-mcp-rules.mdThis file
is a specific, process-oriented set of instructions for the AI to follow
whenever it’s translating a design from Figma.# Figma to Code Workflow
RulesWhen generating code from a Figma design, follow this specific process:1.
Get Context First: Run `get_design_context` to fetch the structured
representation of the Figma node.2. Get Visual Reference: Run `get_screenshot`
for a visual reference.3. Implement: Only after you have both, begin
implementation.4. Translate the MCP output (React + Tailwind) into our
project's conventions, strictly following the rules defined in `README.md` and
`design-system-rules.md`.5. Validate: Ensure the final UI has 1:1 visual
parity with the Figma screenshot before completing.For a technical starting
point, Figma’s developer documentation provides an excellent guide on how to
add custom rules ↗, including example prompts you can use to generate a
baseline for these files.Putting it all togetherFeeling overwhelmed? Don’t be.
Start small. Pick one component and make it “agent-ready.”Name everything
semantically: Are your layers and components named for their purpose?Use auto
layout and variables: Is your design intent baked into the file?Annotate: Have
you documented behaviors and states?*Connect your components (if possible) :
Link every system component to its code counterpart.Write a simple rules file:
Can you create a basic README.md to guide the AI?Prompt with generous
contextThe teams that do this groundwork now are building the foundation for a
future where design and development are in a constant, seamless loop. By
treating our design systems as living sources of truth for both humans and
machines, we can finally spend less time on tedious translation and more time
building what matters.Thanks for reading! I hope this sparked some ideas.
Happy building 🪴Dear LLM, here’s how my design system works was originally
published in UX Collective on Medium, where people are continuing the
conversation by highlighting and responding to this story.

* * *

## Additional Details

**Tags:** #01_ServiceDesign,service_design,review_pending

**Inoreader URL:** [View in
Inoreader](https://www.inoreader.com/article/3a9c6e7745bb7f72)

#05_NewsCollection
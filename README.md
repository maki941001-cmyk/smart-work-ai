# Smart Work AI

Build a modern, responsive SaaS web application called AI Workplace Productivity Assistant.

Core Requirement

This must be a real AI-powered frontend application. All generated emails, schedules, summaries, insights and recommendations must be dynamically generated from the user's input using AI.

Do not use generic, hard-coded, predefined or placeholder AI responses. Every output must be specific to the information entered by the user.

Design

Modern professional SaaS dashboard

Light grey and dark charcoal/black colour palette

Clean cards, subtle borders and rounded corners

Responsive desktop, tablet and mobile design

Left sidebar navigation

Sidebar

Dashboard

Smart Email Generator

AI Task Planner

AI Research Assistant

Settings

Smart Email Generator

User enters:

Email purpose

Recipient

Key points

Tone: Formal, Friendly or Persuasive

AI generates a complete, personalised professional email based on the user's input.

Output must be editable and include:

Copy

Edit

Regenerate

AI Task Planner

User enters their actual tasks and selects:

Daily or Weekly schedule

Priority: High, Medium or Low

AI analyses the submitted tasks and generates a personalised schedule with:

Task

Priority

Suggested time

Recommended order

Brief reasoning where useful

The schedule must be editable.

AI Research Assistant

Allow users to:

Enter a research topic/question, OR

Paste a URL to an article or publicly accessible online content

AI should generate content specifically based on the submitted topic or accessible URL, including:

Summary

Key insights

Important findings

Practical recommendations

Do not display generic research responses unrelated to the user's input.

AI Output

Show a clear loading state while AI is generating

Make all AI outputs editable

Include Regenerate functionality

Clearly distinguish user input from AI-generated output

Handle empty, invalid or unsupported input gracefully

Technical Scope

Create a frontend-only application with no custom backend, database, authentication or persistent data storage.

Do not create hard-coded AI responses. Use Lovable's available AI functionality/integration to generate responses dynamically from user input.

Do not store user prompts or generated results after the session.

Responsible AI Disclaimer

Display:
“AI-generated content may contain errors. Review and verify important information before using or sharing it.”

Focus on a polished, functional AI productivity experience rather than a static mockup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c21d5bc7-3dd6-485c-a320-3e94a6441c8f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

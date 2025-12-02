Matthaeus Wolff  
matthaeuswolff@pm.me • 408-372-7884 • [linkedin.com/in/mw5](https://linkedin.com/in/mw5)

# Profile

Engineer with 10+ years of experience delivering scalable systems across data platforms, UI infrastructure, and AI tooling. Currently pivoting into applied AI engineering, with proven experience in ML evaluation, fine-tuning, and AI pipeline tooling. Passionate about making models reliable, observable, and usable by real teams.

Currently focused on:

- ML evaluation infrastructure and prompt benchmarking
- LLM fine-tuning (LoRA, embedding memory, context chaining)
- Building reliable, interpretable AI systems at scale

# Education

**University of Massachusetts Amherst**  
B.A. in Computer Science and Economics

# Technical Skills

**Languages:** Python, C++, Typescript, JavaScript, C#, SQL, Kusto, Scope  
**ML & AI Tools:** PyTorch, LoRA, HuggingFace Transformers, OpenAI APIs, Stable Diffusion, Whisper, LangChain, Weaviate, Azure AI Studio, ComfyUI, Groq, scikit-learn, K-means, memory chains  
**Deployment & Infra:** Azure DevOps, Data Factory, Application Insights, Synapse, Databricks, Docker, CI/CD for ML, GitHub Actions  
**Web & UI:** React, Redux, Next.js, Office Fabric, Node.js, WebSockets  
**Data & Viz:** Pandas, Numpy, Plotly, Seaborn, Power BI, SQL Server, Geneva  
**Monitoring & Evaluation:** Custom dashboards, prompt X/Y benchmarking, anomaly detection, alerting pipelines  
**Collaboration:** Git, DevExpress, WAVE, Perforce, EntraID

# Relevant AI Experience

Built ML evaluation pipelines and model observability tools across LLMs, image generation, and transcription models. Excited to apply these techniques to real-world perception systems and physical-world robustness problems in safety-critical contexts.

### ML Evaluation & Prompt Benchmarking

- Designed scalable evaluation pipelines to compare LLMs and image/audio models (GPT-4, SDXL, Whisper) across output quality, inference stability, and degradation scenarios. Included prompt benchmarking, hallucination detection, and structured metric logging to drive model iteration decisions.
- Created image generation benchmarks using Stable Diffusion (SDXL, Flux, ChatGPT image gen) with X/Y grid scripts to optimize prompt, sampler, and workflow steps.
- Developed perception-adjacent evaluation techniques using Whisper audio pipelines and Stable Diffusion generations, focusing on input-output consistency, feature coverage, and mode collapse scenarios.
- Deployed AI tools for personal and team use, including prompt diagnostics and model switching logic.

### Fine-tuning & Embedding-Based Memory

- Fine-tuned LoRA models for Stable Diffusion to enable consistent character rendering; published on CivitAI and HuggingFace.
- Integrated vector database memory with summarization chains to combat context rot and provide continuity in AI chat workflows.
- Designed custom retrieval strategies and memory chaining for persistent, long-form interaction via Discord bot and CLI tools.

### Evaluation Feedback & Model Observability

- Built telemetry dashboards and alerting pipelines for model-in-the-loop tools, tracking output quality over time and surfacing regressions. Designed tools to help teams interpret noisy outputs and guide data collection and labeling efforts.

### Teaching, Leadership, and Knowledge Sharing

- Regularly mentored coworkers on AI use, prompting, deployment strategies, and compliance usage within enterprise tools.
- Led AI best practices sessions within Microsoft engineering teams to accelerate adoption and safe experimentation.
- Taught evaluation techniques and chaining workflows to non-ML colleagues for use in test and telemetry environments.

### Light ML Applications

- Applied clustering (K-means) to telemetry tagging systems to infer parent relationships in work item graphs.
- Built structured and unstructured models for classification and tagging inside secure enterprise environments at Microsoft.

# Experience

### Microsoft — Software Engineer 2

_Apr 2018 – Present_  
**Azure DevOps & UI (Level 62)**

- Designed and shipped a unified pipeline portal used by ~200 orgs, reducing feedback cycles from months to days and cutting deployment errors by 80%.
- Led rollout of policy enforcement on ~13K repositories, deprecating legacy tools and reducing policy management overhead.
- Designed and deployed evaluation dashboards for internal telemetry pipelines, integrating anomaly detection and regression metrics across ~25K daily builds. Enabled rapid root cause detection and improved test robustness at org scale.
- Created telemetry and compliance solutions processing ~100TB/day using ADF/Databricks with alerting and anomaly detection.

**Windows DevOps & UI (Level 61)**

- Migrated .NET/PowerShell tools to distributed Azure-native architecture, cutting onboarding latency from 8 days to 5 hours.
- Rebuilt internal Codeflow tooling with a React + Azure DevOps extension used by 4,000+ developers.
- Boosted Windows dev tool API uptime from 71% to 99.9% with telemetry and health monitoring improvements.

**Data Engineering & Business Intelligence (Level 59–60)**

- Partnered with teams to build data pipelines, dashboards, and telemetry tools reducing build waste (e.g., 381 nightly builds → 268).
- Productized data ingestion/reporting templates and published via internal extension hubs.

### Charles River Systems — Software Engineer

_Jun 2016 – Mar 2018_

- Migrated 6 enterprise clients to SaaS delivery via custom deployment patches.
- Reduced test runtime by 30% by redesigning automation with JUnit + Silk4Net.
- Drove cross-team performance optimizations reducing load time of key modules by up to 70%.

# Projects

**[Discord Chatbot: Checkmage](https://github.com/WolffM/checkmage-bot)**  
AI-powered chatbot using llama3-70b via Groq API with memory and context. Handles reminders, dice rolls, tournaments.

**[TTRPG Session Summarizer](https://github.com/WolffM/TTRPGSessionSummarizer)**  
Evaluates TTRPG sessions using Whisper transcription + GPT summarization. Demonstrates pipeline design, robustness, evaluation.

**[AnimeGo (Next.js + Cursor)](https://github.com/WolffM/upcominganimego)**  
Prompt-coded live anime recommendation engine built in 48 hours.

**[Riot Rank Visualizer](https://github.com/WolffM/seaborn-ranked-animated)**  
League of Legends match data visualized with Plotly + Seaborn. Emphasizes experience with telemetry and data viz.

**[Web Comic Hosting App](https://github.com/WolffM/webcomicreact)**  
Custom React frontend for managing and navigating image-heavy webcomic chapters with keyboard navigation.

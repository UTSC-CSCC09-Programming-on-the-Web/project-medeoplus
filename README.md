# 🩺 Project Proposal: Medeo plus ✨

## 👥 Team Members

| Name | UTORid | Email |
| :--- | :--- | :--- |
| Mianli Wang | `wangm246` | `mianli.wang@mail.utoronto.ca` |
| Steve Nguyen | `nguy3671` | `st.nguyen@mail.utoronto.ca` |

---

## 🚀 Project Overview

**Medeo plus** is a modern web application that streamlines patient–provider communication and mental‑health support. Users can book **Appointments**, exchange **Messages**, and share **Documents** with their clinicians in a single, secure workspace.

The platform adopts a **micro‑service architecture**, separating core business logic from compute‑heavy AI workloads. A **Light Retrieval‑Augmented Generation (LightRAG)** server—running in its own Python container—provides hybrid **knowledge‑graph + vector** retrieval, source citation, multi‑modal parsing (PDF / images), and an Ollama‑compatible REST API. This enables truly personalized, evidence‑grounded responses based on each user’s history and uploads.

---

## 🏗️ System Architecture

*Paste the Mermaid snippet below into the [**Mermaid Live Editor**](https://mermaid.live) for a visual diagram.*

```mermaid
---
config:
  layout: elk
  theme: neo-dark
  look: neo
---
flowchart TD
  subgraph client["🖥️ User Client"]
    User["💻 Browser"]
  end

  subgraph nuxt["✨ Nuxt 3 SPA (3000)"]
    NuxtNode["OAuth ↔️ Google<br/>Stripe Checkout<br/>Video UI (Daily iframe)"]
  end

  subgraph nodeSvc["🟢 Node.js Ecosystem"]
    Express["🚀 Express.js API (8080)<br/>/auth /payments /files /rag"]
    SocketIO["🔌 Socket.IO<br/>Real‑time channel"]
    BullMQ["🐎 BullMQ Worker<br/>Async jobs<br/>(transcribe → embed)"]
    Prisma["📦 Prisma ORM"]
  end

  subgraph pySvc["🐍 Python AI Service"]
    LightRAG["🧠 LightRAG (FastAPI 5000)<br/>Hybrid KG + vector retrieval"]
  end

  subgraph core["🛠️ Core Services"]
    Postgres["🐘 PostgreSQL"]
    Redis["🧰 Redis<br/>BullMQ queue"]
  end

  subgraph infra["☁️ Docker Compose / Nginx"]
    Nginx["⚙️ Nginx<br/>SSL / Reverse Proxy"]
    nodeSvc
    pySvc
    core
  end

  subgraph third["🌐 Third‑Party Cloud"]
    Supa["📦 Supabase Storage<br/>S3‑compatible (JWT RLS)"]
    Qdrant["🧠 Qdrant Cloud"]
    Stripe["💳 Stripe Checkout"]
    OpenAI["🤖 OpenAI API"]
    AssemblyAI["🎙️ AssemblyAI"]
    Daily["🎥 Daily.co"]
  end

  %% client paths
  User -- "HTTPS" --> NuxtNode
  NuxtNode -- "HTTPS (Nginx)" --> Express
  NuxtNode -- "WSS (Nginx)" --> SocketIO
  NuxtNode -- "iframe" --> Daily

  %% node paths
  Express -- "Prisma" --> Postgres
  Express -- "Upload metadata" --> Supa
  Express -- "REST /rag/query" --> LightRAG
  Express -- "Add job" --> BullMQ
  Express -- "Webhook" --> Stripe
  BullMQ -- "R/W" --> Redis

  %% py paths
  LightRAG -- "Query vectors" --> Qdrant
  LightRAG -- "Embeddings / LLM" --> OpenAI

  %% transcription
  Express -- "WS proxy" --> AssemblyAI
````

---

## 🛠️ Tech Stack

| Layer                      | Technology                                                                     |
| :------------------------- | :----------------------------------------------------------------------------- |
| 🖼️ **Frontend**           | Nuxt 3 (Vue 3) • TypeScript • TailwindCSS                                      |
| 🎨 **UI Kit**              | DaisyUI                                                                        |
| 🚪 **Backend API Gateway** | Express.js (TypeScript)                                                        |
| 💾 **ORM**                 | Prisma (PostgreSQL adapter)                                                    |
| ⚡ **Real‑time**            | Socket.IO                                                                      |
| 🔐 **Auth (OAuth 2.0)**    | Supabase OAuth ( Google )                                                      |
| 💳 **Payments**            | Stripe Checkout (test)                                                         |
| 🧠 **LLM / RAG**           | LightRAG (FastAPI) • OpenAI GPT‑4o • LangChain.js *(optional post‑processing)* |
| 🌌 **Vector DB**           | Qdrant Cloud                                                                   |
| 🔄 **Queue**               | BullMQ + Redis                                                                 |
| 🗄️ **Object Storage**     | Supabase Storage (S3‑compatible, RLS protected)                                |
| 📹 **Video**               | Daily.co                                                                       |
| 🎤 **Speech‑to‑Text**      | AssemblyAI Streaming API                                                       |
| 🐳 **Deployment**          | DigitalOcean VM • Docker Compose • Nginx                                       |
| 🚀 **DevOps**              | GitHub Actions (lint / CI)                                                     |

---

## ✨ Core Features & Implementation

### a. Hybrid LightRAG Dialogue

1. **Express API** receives a user prompt and forwards it via **REST** to `light-rag:5000`.
2. **LightRAG** performs hybrid KG + vector retrieval from **Qdrant**, assembles citations and context, calls **OpenAI** for generation, and streams tokens back to Express.
3. Express emits the answer to the browser over **Socket.IO** (with streaming).

### b. Asynchronous Pipeline

* Document uploads are streamed to **Supabase Storage**.
* Express enqueues a **“process‑doc”** job (BullMQ).
* Worker → downloads file, transcribes (AssemblyAI if audio), segments text, embeds (OpenAI), and upserts vectors into **Qdrant**.
* Non‑blocking: the user UI instantly shows “processing…” and updates via a queue event.

### c. Live Video + Transcription

* **Daily.co** iframe handles video.
* Browser captures audio → **WebSocket** to Express → proxied to **AssemblyAI** for real‑time captions/translation.
* Captions are pushed back through the Socket.IO overlay.

---

## 🗓️ Project Milestones
### Alpha Version

  * Architecture Validation: Achieve a stable local launch of all services using Docker Compose. 
  * Debug the inter-service communication between Express and FastAPI.
  * Core Workflow: Implement the complete user flow from OAuth registration to a successful Stripe subscription payment.
  * Basic Features: Build the foundational UI and APIs for the Messages, Appointments, and Documents modules.

### Beta Version

  * LightRAG Implementation: Complete the RAG data indexing and retrieval pipeline, enabling personalized AI conversations.
  * Asynchronous Pipeline: Successfully implement the document processing pipeline powered by BullMQ and Redis.
  * Feature Completion: Integrate the real-time video transcription/translation feature and deploy the full application to a DigitalOcean VM.

### Final Version

  * Optimization & Bug Fixes: Resolve all identified bugs based on beta testing feedback. Optimize RAG retrieval efficiency and front-end performance.
  * Security Hardening: Conduct a thorough review of all authentication, payment, and data-handling processes.
  * Documentation & Submission: Finalize all code and documentation for submission to Gradescope.

---

## ⚙️ Local Development

```bash
# 1 Clone
git clone https://github.com/UTSC-CSCC09-Programming-on-the-Web/project-medeoplus
cd medeo-plus

# 2 Env
cp backend/.env.example backend/.env
cp rag-service/.env.example rag-service/.env
# — fill POSTGRES_URL, SUPABASE_JWT_SECRET, STRIPE_KEY, OPENAI_KEY, etc.

# 3 Run
docker compose up --build  # new Docker CLI

# URLs
# • Frontend  http://localhost:3000
# • API       http://localhost:8080
# • LightRAG  http://localhost:5000
```

---

## ⚖️ Legal & Ethical

*This academic prototype is **not** a certified medical device. All AI output is informational only and must not replace professional advice.*

* No real PHI or live payment credentials should be used.
* Secrets are injected **only** via GitHub Secrets or Docker secrets—no keys are committed to the repo.

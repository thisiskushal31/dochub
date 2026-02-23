# Vector Database

Vector databases store **high-dimensional vectors** (embeddings) and support **similarity search** (e.g., k-NN, approximate nearest neighbor). They are the backbone of semantic search and AI-powered retrieval.

## What it is

- **Vectors** — Dense embeddings from models (e.g., text, image encoders)
- **Similarity search** — Find nearest vectors by distance (cosine, L2, dot product)
- **Indexes** — HNSW, IVF, PQ, etc., for approximate nearest neighbor (ANN) at scale
- Often support metadata filtering (e.g., filter by category then similarity)

## Examples

- **Pinecone** — Managed vector database, serverless option
- **Weaviate** — Open-source, graphql and vector search
- **Milvus** — Open-source, scalable vector search
- **pgvector** — PostgreSQL extension for vector similarity

## Why you use it (use cases)

- **Semantic search** — Find by meaning, not just keywords; RAG over documents
- **Recommendations** — “Similar items” or “similar users” via embedding similarity
- **AI and RAG** — Storing and retrieving embeddings for LLM context, retrieval-augmented generation
- **Deduplication and clustering** — Group similar content, detect near-duplicates
- **Image/audio similarity** — Visual search, fingerprinting, content matching

## In this repo

- **Overview:** [Database types & use cases](../README.md#database-types--use-cases)
- **Concepts:** [Storage & indexing](../concepts/README.md) (general indexing concepts)
- **Relational:** [PostgreSQL](../relational/postgresql/README.md) — pgvector extension for vector search inside PostgreSQL

## Databases (we're going to cover these)

- **[Pinecone](./pinecone/README.md)** — deep dive planned
- **[Weaviate](./weaviate/README.md)** — deep dive planned
- **[Milvus](./milvus/README.md)** — deep dive planned
- **[pgvector](./pgvector/README.md)** — deep dive planned (PostgreSQL extension)

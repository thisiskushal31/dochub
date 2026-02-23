# Elasticsearch Overview & Getting Started

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide) blog posts.**

[← Back to Elasticsearch Deep Dive](../README.md)

## Overview

Elasticsearch is a distributed, RESTful search and analytics engine built on Apache Lucene. It provides a distributed, multitenant-capable full-text search engine with an HTTP web interface and schema-free JSON documents.

According to the [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html), "Elasticsearch is a distributed, RESTful search and analytics engine capable of solving a growing number of use cases." Elasticsearch is at the heart of the Elastic Stack (Elasticsearch, Logstash, Kibana, and Beats), providing real-time search and analytics capabilities.

### Key Features

- **Distributed Architecture**: Built to scale horizontally across multiple nodes
- **Real-time Search**: Near real-time search capabilities with sub-second latency
- **Full-Text Search**: Powerful full-text search built on Apache Lucene
- **RESTful API**: Simple HTTP/REST API for all operations
- **Schema-Free**: JSON documents with dynamic mapping
- **Analytics**: Rich aggregation framework for data analysis
- **High Availability**: Built-in replication and failover capabilities

### Architecture Components

- **Cluster**: Collection of one or more nodes
- **Node**: Single Elasticsearch instance
- **Index**: Collection of documents (similar to a database in RDBMS)
- **Type**: Category/partition of an index (deprecated in 7.0+)
- **Document**: Basic unit of information (similar to a row in RDBMS)
- **Shard**: Horizontal partition of an index
- **Replica**: Copy of a shard for redundancy and high availability

### Use Cases

- **Search Engines**: Full-text search for websites, applications, and content
- **Log Analytics**: Centralized logging and log analysis (ELK Stack)
- **Business Intelligence**: Real-time analytics and reporting
- **Security Analytics**: SIEM and security event analysis
- **Application Performance Monitoring (APM)**: Performance metrics and tracing
- **Time-Series Data**: Metrics, monitoring, and IoT data

## Table of Contents

### Getting Started
- [Adding more nodes to the cluster (for development)](#adding-more-nodes-to-the-cluster-for-development)
- [Inspecting the cluster](#inspecting-the-cluster)
- [Overview of node roles](#overview-of-node-roles)
- [Sending queries with cURL](#sending-queries-with-curl)
- [Setting up Elasticsearch & Kibana on macOS & Linux](#setting-up-elasticsearch--kibana-on-macos--linux)
- [Setting up Elasticsearch & Kibana on Windows](#setting-up-elasticsearch--kibana-on-windows)
- [Sharding and scalability](#sharding-and-scalability)
- [Understanding replication](#understanding-replication)

### Managing Documents
- [Batch processing](#batch-processing)
- [Creating & Deleting Indices](#creating--deleting-indices)
- [Delete by query](#delete-by-query)
- [Deleting documents](#deleting-documents)
- [Importing data with cURL](#importing-data-with-curl)
- [Indexing documents](#indexing-documents)
- [Optimistic concurrency control](#optimistic-concurrency-control)
- [Replacing documents](#replacing-documents)
- [Retrieving documents by ID](#retrieving-documents-by-id)
- [Scripted updates](#scripted-updates)
- [Update by query](#update-by-query)
- [Updating documents](#updating-documents)
- [Upserts](#upserts)

### Mapping & Analysis
- [Adding analyzers to existing indices](#adding-analyzers-to-existing-indices)
- [Adding explicit mappings](#adding-explicit-mappings)
- [Adding mappings to existing indices](#adding-mappings-to-existing-indices)
- [Combining explicit and dynamic mapping](#combining-explicit-and-dynamic-mapping)
- [Configuring dynamic mapping](#configuring-dynamic-mapping)
- [Creating custom analyzers](#creating-custom-analyzers)
- [Defining field aliases](#defining-field-aliases)
- [Dynamic templates](#dynamic-templates)
- [How dates work in Elasticsearch](#how-dates-work-in-elasticsearch)
- [How the `keyword` data type works](#how-the-keyword-data-type-works)
- [Index templates](#index-templates)
- [Multi-field mappings](#multi-field-mappings)
- [Reindexing documents with the Reindex API](#reindexing-documents-with-the-reindex-api)
- [Retrieving mappings](#retrieving-mappings)
- [Understanding arrays](#understanding-arrays)
- [Understanding type coercion](#understanding-type-coercion)
- [Updating analyzers](#updating-analyzers)
- [Updating existing mappings](#updating-existing-mappings)
- [Using dot notation in field names](#using-dot-notation-in-field-names)
- [Using the Analyze API](#using-the-analyze-api)

### Searching for Data
- [Boosting query](#boosting-query)
- [Disjunction max (`dis_max`)](#disjunction-max-dismax)
- [Introduction to relevance scoring](#introduction-to-relevance-scoring)
- [Nested inner hits](#nested-inner-hits)
- [Phrase searches](#phrase-searches)
- [Prefixes, wildcards & regular expressions](#prefixes-wildcards--regular-expressions)
- [Querying by field existence](#querying-by-field-existence)
- [Querying nested objects](#querying-nested-objects)
- [Querying with boolean logic](#querying-with-boolean-logic)
- [Range searches](#range-searches)
- [Retrieving documents by IDs](#retrieving-documents-by-ids)
- [Searching for terms](#searching-for-terms)
- [Searching multiple fields](#searching-multiple-fields)
- [The match query](#the-match-query)

### Joining Queries
- [Add departments test data](#add-departments-test-data)
- [Adding documents](#adding-documents)
- [Mapping document relationships](#mapping-document-relationships)
- [Multi-level relations](#multi-level-relations)
- [Parent/child inner hits](#parentchild-inner-hits)
- [Querying by parent](#querying-by-parent)
- [Querying child documents by parent](#querying-child-documents-by-parent)
- [Querying parent by child documents](#querying-parent-by-child-documents)
- [Terms lookup mechanism](#terms-lookup-mechanism)

### Controlling Query Results
- [Filters](#filters)
- [Sorting by multi-value fields](#sorting-by-multi-value-fields)
- [Sorting results](#sorting-results)
- [Source filtering](#source-filtering)
- [Specifying an offset](#specifying-an-offset)
- [Specifying the result format](#specifying-the-result-format)
- [Specifying the result size](#specifying-the-result-size)

### Aggregations
- [Aggregating nested objects](#aggregating-nested-objects)
- [Defining bucket rules with filters](#defining-bucket-rules-with-filters)
- [Filtering out documents](#filtering-out-documents)
- [`global` aggregation](#global-aggregation)
- [Histograms](#histograms)
- [Introduction to aggregations](#introduction-to-aggregations)
- [Introduction to bucket aggregations](#introduction-to-bucket-aggregations)
- [Metric aggregations](#metric-aggregations)
- [Missing field values](#missing-field-values)
- [Nested aggregations](#nested-aggregations)
- [Range aggregations](#range-aggregations)

### Improving Search Results
- [Adding synonyms from file](#adding-synonyms-from-file)
- [Adding synonyms](#adding-synonyms)
- [Affecting relevance scoring with proximity](#affecting-relevance-scoring-with-proximity)
- [Fuzzy `match` query](#fuzzy-match-query)
- [`fuzzy` query](#fuzzy-query)
- [Highlighting matches in fields](#highlighting-matches-in-fields)
- [Proximity searches](#proximity-searches)
- [Stemming](#stemming)

---

## Getting Started

### Adding more nodes to the cluster (for development)

## Checking the cluster's health

```
GET /_cluster/health
```

## Checking the shard distribution

```
GET /_cat/shards?v
```

## Generating an enrollment token
When adding a new node to an existing Elasticsearch cluster, we first need to generate an enrollment token.

```
# macOS & Linux
bin/elasticsearch-create-enrollment-token --scope node

# Windows
bin\elasticsearch-create-enrollment-token.bat -s node
```

## Adding a new node to the cluster
To add a new node to an existing cluster, run the following command. Remember to have the working 
directory set to the new node's `$ES_HOME` directory (use the `cd` command for this).

```
# macOS & Linux
bin/elasticsearch --enrollment-token [INSERT_ENROLLMENT_TOKEN_HERE]

# Windows
bin\elasticsearch.bat --enrollment-token [INSERT_ENROLLMENT_TOKEN_HERE]
```

Once the node has been added, starting up the node again in the future is as simple as 
running `bin/elasticsearch` (macOS & Linux) or `bin\elasticsearch.bat` (Windows).

---

### Inspecting the cluster

## Checking the cluster's health

```
GET /_cluster/health
```

## Listing the cluster's nodes

```
GET /_cat/nodes?v
```

## Listing the cluster's indices

```
GET /_cat/indices?v&expand_wildcards=all
```

---

### Overview of node roles

## Listing the cluster's nodes (and their roles)

```
GET /_cat/nodes?v
```

---

### Sending queries with cURL

## Handling self signed certificates

Local deployments of Elasticsearch are protected with a self signed certificate by default, which HTTP clients do not trust. 
Sending a request will therefore fail with a certificate error. To fix this, we have a couple of options. 
For cloud deployments, simply skip this step.

### 1. Skip certificate verification

One option is to entirely skip the verification of the certificate. This is not exactly best practice, 
but if you are just developing with a local cluster, then it might be just fine. To ignore the 
certificate, use either the `--insecure` flag or `-k`.

```
curl --insecure [...]
curl -k [...]
```

### 2. Provide the CA certificate

A better approach is to provide the CA certificate so that the TLS certificate is not just ignored. 
The path to the file can be supplied with the `--cacert` argument. The CA certificate is typically stored within 
the `config/certs` directory, although the `certs` directory may be at the root of your Elasticsearch 
home directory (`$ES_HOME`) depending on how you installed Elasticsearch.

```
# macOS & Linux
cd /path/to/elasticsearch
curl --cacert config/certs/http_ca.crt [...]

# Windows
cd C:\Path\To\Elasticsearch
curl --cacert config\certs\http_ca.crt [...]
```

Alternatively, you can specify the absolute path to the file.

## Authentication
All requests made to Elasticsearch must be authenticated by default.

### Local deployments
For local deployments, use the password that was generated for the `elastic` user the first time Elasticsearch started up.

```
curl -u elastic [...]
```

The above will prompt you to enter the password when running the command. Alternatively, you can enter 
the password directly within the command as follows (without the brackets).

```
curl -u elastic:[YOUR_PASSWORD_HERE] [...]
```

Note that this exposes your password within the terminal, so this is not best practice from a security perspective.

### Elastic Cloud
With Elastic Cloud, we should add an `Authorization` header to our requests and include an API key. API keys can be 
created within Kibana (Stack Management > Security > API keys). Replace `API_TOKEN` below with the base64 encoded API key.

```bash
curl -H "Authorization:ApiKey API_TOKEN" [...]
```

## Adding a request body & `Content-Type` header

To send data within the request, use the `-d` argument, e.g. for the `match_all` query. Note that using 
single quotes does not work on Windows, so each double quote within the JSON object must be escaped.

```
# macOS & Linux
curl [...] https://localhost:9200/products/_search -d '{ "query": { "match_all": {} } }'

# Windows
curl [...] https://localhost:9200/products/_search -d "{ \"query\": { \"match_all\": {} } }"
```

When sending data (typically JSON), we need to tell Elasticsearch which type of data we are sending. This 
can be done with the `Content-Type` HTTP header. Simply add it with cURL's `-H` argument.

```
curl -H "Content-Type:application/json" [...]
```

## Specifying the HTTP verb

You may also specify the HTTP verb (e.g. `POST`). This is necessary for some endpoints, such as when 
indexing documents. `GET` is assumed by default.

```
curl -X POST [...]
```

## All together now

```
# macOS & Linux
curl --cacert config/certs/http_ca.crt -u elastic https://localhost:9200/products/_search -d '{ "query": { "match_all": {} } }'

# Windows
curl --cacert config\certs\http_ca.crt -u elastic https://localhost:9200/products/_search -d "{ \"query\": { \"match_all\": {} } }"
```

---

### Setting up Elasticsearch & Kibana on macOS & Linux

## Extracting the archives

Both the Elasticsearch and Kibana archives can be extracted by using the below commands.
Alternatively, simply double-clicking them should do the trick.

```
cd /path/to/archive/directory
tar -zxf archive.tar.gz
```

## Starting up Elasticsearch

```
cd /path/to/elasticsearch
bin/elasticsearch
```

## Resetting the `elastic` user's password

If you lose the password for the `elastic` user, it can be reset with the following commands.

```
cd /path/to/elasticsearch
bin/elasticsearch-reset-password -u elastic
```

## Generating a new Kibana enrollment token

If you need to generate a new enrollment token for Kibana, this can be done with the following commands.

```
cd /path/to/elasticsearch
bin/elasticsearch-create-enrollment-token --scope kibana
```

## Disabling Gatekeeper for Kibana directory

macOS contains a security feature named Gatekeeper, which prevents Kibana from starting up.
We can disable it for just the Kibana directory, which allows Kibana to start up correctly.
Simply use the following command to do so.

```
xattr -d -r com.apple.quarantine /path/to/kibana
```

## Starting up Kibana

```
cd /path/to/kibana
bin/kibana
```

---

### Setting up Elasticsearch & Kibana on Windows

## Starting up Elasticsearch

```
cd path\to\elasticsearch
bin\elasticsearch.bat
```

## Resetting the `elastic` user's password

If you lose the password for the `elastic` user, it can be reset with the following commands.

```
cd path\to\elasticsearch
bin\elasticsearch-reset-password.bat -u elastic
```

## Generating a new Kibana enrollment token

If you need to generate a new enrollment token for Kibana, this can be done with the following commands.

```
cd path\to\elasticsearch
bin\elasticsearch-create-enrollment-token.bat -s kibana
```

## Starting up Kibana

```
cd path\to\kibana
bin\kibana.bat
```

---

### Sharding and scalability

## Listing the cluster's indices

```
GET /_cat/indices?v
```

---

### Understanding replication

## Creating a new index

```
PUT /pages
```

## Checking the cluster's health

```
GET /_cluster/health
```

## Listing the cluster's indices

```
GET /_cat/indices?v
```

## Listing the cluster's shards

```
GET /_cat/shards?v
```

---

## Managing Documents

### Batch processing

## Indexing documents

```
POST /_bulk
{ "index": { "_index": "products", "_id": 200 } }
{ "name": "Espresso Machine", "price": 199, "in_stock": 5 }
{ "create": { "_index": "products", "_id": 201 } }
{ "name": "Milk Frother", "price": 149, "in_stock": 14 }
```

## Updating and deleting documents

```
POST /_bulk
{ "update": { "_index": "products", "_id": 201 } }
{ "doc": { "price": 129 } }
{ "delete": { "_index": "products", "_id": 200 } }
```

## Specifying the index name in the request path

```
POST /products/_bulk
{ "update": { "_id": 201 } }
{ "doc": { "price": 129 } }
{ "delete": { "_id": 200 } }
```

## Retrieving all documents

```
GET /products/_search
{
  "query": {
    "match_all": {}
  }
}
```

---

### Creating & Deleting Indices

## Deleting an index

```
DELETE /pages
```

## Creating an index (with settings)

```
PUT /products
{
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 2
  }
}
```

---

### Delete by query

## Deleting documents that match a given query

```
POST /products/_delete_by_query
{
  "query": {
    "match_all": { }
  }
}
```

## Ignoring (counting) version conflicts

The `conflicts` key may be added as a query parameter instead, i.e. `?conflicts=proceed`.

```
POST /products/_delete_by_query
{
  "conflicts": "proceed",
  "query": {
    "match_all": { }
  }
}
```

---

### Deleting documents

```
DELETE /products/_doc/101
```

---

### Importing data with cURL

## Navigating to bulk file directory

```
cd /path/to/data/file/directory
```

### Examples
```
# macOS and Linux
cd ~/Desktop

# Windows
cd C:\Users\[your_username]\Desktop
```

## Importing data into local clusters

```
# Without CA certificate validation. This is fine for development clusters, but don't do this in production!
curl -k -u elastic -H "Content-Type:application/x-ndjson" -XPOST https://localhost:9200/products/_bulk --data-binary "@products-bulk.json"

# With CA certificate validation. The certificate is located at $ES_HOME/config/certs/http_ca.crt
curl --cacert /path/to/http_ca.crt -u elastic -H "Content-Type:application/x-ndjson" -XPOST https://localhost:9200/products/_bulk --data-binary "@products-bulk.json"
```

## Importing data into Elastic Cloud 

First, create an API key within Kibana (Stack Management > Security > API keys). Replace `API_TOKEN` below with the base64 encoded API key.

```bash
curl -H "Content-Type:application/x-ndjson" -H "Authorization:ApiKey API_TOKEN" -XPOST https://elastic-cloud-endpoint.com/products/_bulk --data-binary "@products-bulk.json"
```

---

### Indexing documents

## Indexing document with auto generated ID:

```
POST /products/_doc
{
  "name": "Coffee Maker",
  "price": 64,
  "in_stock": 10
}
```

## Indexing document with custom ID:

```
PUT /products/_doc/100
{
  "name": "Toaster",
  "price": 49,
  "in_stock": 4
}
```

---

### Optimistic concurrency control

## Retrieve the document (and its primary term and sequence number)
```
GET /products/_doc/100
```

## Update the `in_stock` field only if the document has not been updated since retrieving it
```
POST /products/_update/100?if_primary_term=X&if_seq_no=X
{
  "doc": {
    "in_stock": 123
  }
}
```

---

### Replacing documents

```
PUT /products/_doc/100
{
  "name": "Toaster",
  "price": 79,
  "in_stock": 4
}
```

---

### Retrieving documents by ID

```
GET /products/_doc/100
```

---

### Scripted updates

## Reducing the current value of `in_stock` by one

```
POST /products/_update/100
{
  "script": {
    "source": "ctx._source.in_stock--"
  }
}
```

## Assigning an arbitrary value to `in_stock`

```
POST /products/_update/100
{
  "script": {
    "source": "ctx._source.in_stock = 10"
  }
}
```

## Using parameters within scripts

```
POST /products/_update/100
{
  "script": {
    "source": "ctx._source.in_stock -= params.quantity",
    "params": {
      "quantity": 4
    }
  }
}
```

## Conditionally setting the operation to `noop`

```
POST /products/_update/100
{
  "script": {
    "source": """
      if (ctx._source.in_stock == 0) {
        ctx.op = 'noop';
      }
      
      ctx._source.in_stock--;
    """
  }
}
```

## Conditionally update a field value

```
POST /products/_update/100
{
  "script": {
    "source": """
      if (ctx._source.in_stock > 0) {
        ctx._source.in_stock--;
      }
    """
  }
}
```

## Conditionally delete a document

```
POST /products/_update/100
{
  "script": {
    "source": """
      if (ctx._source.in_stock < 0) {
        ctx.op = 'delete';
      }
      
      ctx._source.in_stock--;
    """
  }
}
```

---

### Update by query

## Updating documents matching a query

Replace the `match_all` query with any query that you would like.

```
POST /products/_update_by_query
{
  "script": {
    "source": "ctx._source.in_stock--"
  },
  "query": {
    "match_all": {}
  }
}
```

## Ignoring (counting) version conflicts

The `conflicts` key may be added as a query parameter instead, i.e. `?conflicts=proceed`.

```
POST /products/_update_by_query
{
  "conflicts": "proceed",
  "script": {
    "source": "ctx._source.in_stock--"
  },
  "query": {
    "match_all": {}
  }
}
```

## Matches all of the documents within the `products` index

```
GET /products/_search
{
  "query": {
    "match_all": {}
  }
}
```

---

### Updating documents

## Updating an existing field

```
POST /products/_update/100
{
  "doc": {
    "in_stock": 3
  }
}
```

## Adding a new field

_Yes, the syntax is the same as the above. ;-)_

```
POST /products/_update/100
{
  "doc": {
    "tags": ["electronics"]
  }
}
```

---

### Upserts

```
POST /products/_update/101
{
  "script": {
    "source": "ctx._source.in_stock++"
  },
  "upsert": {
    "name": "Blender",
    "price": 399,
    "in_stock": 5
  }
}
```

---

---

**Next**: [2 Overview Getting Started](./2-overview-getting-started.md) | [Back to Elasticsearch Deep Dive](../README.md)
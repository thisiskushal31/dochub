# Elasticsearch Mapping & Analysis

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide) blog posts.**

[← Back to Elasticsearch Deep Dive](../README.md)

## Table of Contents

- [Mapping & Analysis](#mapping-analysis)
  - [Adding analyzers to existing indices](#adding-analyzers-to-existing-indices)
- [Close `analyzer_test` index](#close-analyzer_test-index)
- [Add new analyzer](#add-new-analyzer)
- [Open `analyzer_test` index](#open-analyzer_test-index)
- [Retrieve index settings](#retrieve-index-settings)
  - [Adding explicit mappings](#adding-explicit-mappings)
- [Add field mappings for `reviews` index](#add-field-mappings-for-reviews-index)
- [Index a test document](#index-a-test-document)
  - [Adding mappings to existing indices](#adding-mappings-to-existing-indices)
- [Add new field mapping to existing index](#add-new-field-mapping-to-existing-index)
- [Retrieve the mapping](#retrieve-the-mapping)
  - [Combining explicit and dynamic mapping](#combining-explicit-and-dynamic-mapping)
- [Create index with one field mapping](#create-index-with-one-field-mapping)
- [Index a test document with an unmapped field](#index-a-test-document-with-an-unmapped-field)
- [Retrieve mapping](#retrieve-mapping)
- [Clean up](#clean-up)
  - [Configuring dynamic mapping](#configuring-dynamic-mapping)
- [Disable dynamic mapping](#disable-dynamic-mapping)
- [Set dynamic mapping to `strict`](#set-dynamic-mapping-to-strict)
- [Index a test document](#index-a-test-document)
- [Retrieve mapping](#retrieve-mapping)
- [Search `first_name` field](#search-first_name-field)
- [Search `last_name` field](#search-last_name-field)
- [Inheritance for the `dynamic` parameter](#inheritance-for-the-dynamic-parameter)
  - [Mapping](#mapping)
  - [Example document (invalid)](#example-document-invalid)
  - [Example document (OK)](#example-document-ok)
- [Enabling numeric detection](#enabling-numeric-detection)
  - [Mapping](#mapping)
  - [Example document](#example-document)
- [Date detection](#date-detection)
  - [Disabling date detection](#disabling-date-detection)
  - [Configuring dynamic date formats](#configuring-dynamic-date-formats)
- [Clean up](#clean-up)
  - [Creating custom analyzers](#creating-custom-analyzers)
- [Remove HTML tags and convert HTML entities](#remove-html-tags-and-convert-html-entities)
- [Add the `standard` tokenizer](#add-the-standard-tokenizer)
- [Add the `lowercase` token filter](#add-the-lowercase-token-filter)
- [Add the `stop` token filter](#add-the-stop-token-filter)
- [Add the `asciifolding` token filter](#add-the-asciifolding-token-filter)
- [Create a custom analyzer named `my_custom_analyzer`](#create-a-custom-analyzer-named-my_custom_analyzer)
- [Configure the analyzer to remove Danish stop words](#configure-the-analyzer-to-remove-danish-stop-words)
- [Test the custom analyzer](#test-the-custom-analyzer)
  - [Defining field aliases](#defining-field-aliases)
- [Add `comment` alias pointing to the `content` field](#add-comment-alias-pointing-to-the-content-field)
- [Using the field alias](#using-the-field-alias)
- [Using the "original" field name still works](#using-the-original-field-name-still-works)
  - [Dynamic templates](#dynamic-templates)
- [Map whole numbers to `integer` instead of `long`](#map-whole-numbers-to-integer-instead-of-long)
- [Test the dynamic template](#test-the-dynamic-template)
- [Retrieve mapping (and dynamic template)](#retrieve-mapping-and-dynamic-template)
- [Modify default mapping for strings (set `ignore_above` to 512)](#modify-default-mapping-for-strings-set-ignore_above-to-512)
- [Using `match` and `unmatch`](#using-match-and-unmatch)
- [Setting `match_pattern` to `regex`](#setting-match_pattern-to-regex)
- [Using `path_match`](#using-path_match)
- [Using placeholders](#using-placeholders)
  - [How dates work in Elasticsearch](#how-dates-work-in-elasticsearch)
- [Supplying only a date](#supplying-only-a-date)
- [Supplying both a date and time](#supplying-both-a-date-and-time)
- [Specifying the UTC offset](#specifying-the-utc-offset)
- [Supplying a timestamp (milliseconds since the epoch)](#supplying-a-timestamp-milliseconds-since-the-epoch)
- [Retrieving documents](#retrieving-documents)
  - [How the `keyword` data type works](#how-the-keyword-data-type-works)
- [Testing the `keyword` analyzer](#testing-the-keyword-analyzer)
  - [Index templates](#index-templates)
- [Adding/updating an index template](#addingupdating-an-index-template)
- [Indexing a document into a new index](#indexing-a-document-into-a-new-index)
- [Manually creating an index](#manually-creating-an-index)
- [Inspecting the new indices](#inspecting-the-new-indices)
- [Retrieving an index template](#retrieving-an-index-template)
- [Deleting an index template](#deleting-an-index-template)
  - [Multi-field mappings](#multi-field-mappings)
- [Add `keyword` mapping to a `text` field](#add-keyword-mapping-to-a-text-field)
- [Index a test document](#index-a-test-document)
- [Retrieve documents](#retrieve-documents)
- [Querying the `text` mapping](#querying-the-text-mapping)
- [Querying the `keyword` mapping](#querying-the-keyword-mapping)
- [Clean up](#clean-up)
  - [Reindexing documents with the Reindex API](#reindexing-documents-with-the-reindex-api)
- [Add new index with new mapping](#add-new-index-with-new-mapping)
- [Retrieve mapping](#retrieve-mapping)
- [Reindex documents into `reviews_new`](#reindex-documents-into-reviews_new)
- [Delete all documents](#delete-all-documents)
- [Convert `product_id` values to strings](#convert-product_id-values-to-strings)
- [Retrieve documents](#retrieve-documents)
- [Reindex specific documents](#reindex-specific-documents)
- [Reindex only positive reviews](#reindex-only-positive-reviews)
- [Removing fields (source filtering)](#removing-fields-source-filtering)
- [Changing a field's name](#changing-a-fields-name)
- [Ignore reviews with ratings below 4.0](#ignore-reviews-with-ratings-below-40)
  - [Retrieving mappings](#retrieving-mappings)
- [Retrieving mappings for the `reviews` index](#retrieving-mappings-for-the-reviews-index)
- [Retrieving mapping for the `content` field](#retrieving-mapping-for-the-content-field)
- [Retrieving mapping for the `author.email` field](#retrieving-mapping-for-the-authoremail-field)
  - [Understanding arrays](#understanding-arrays)
- [Arrays of strings are concatenated when analyzed](#arrays-of-strings-are-concatenated-when-analyzed)
  - [Understanding type coercion](#understanding-type-coercion)
- [Supplying a floating point](#supplying-a-floating-point)
- [Supplying a floating point within a string](#supplying-a-floating-point-within-a-string)
- [Supplying an invalid value](#supplying-an-invalid-value)
- [Retrieve document](#retrieve-document)
- [Clean up](#clean-up)
  - [Updating analyzers](#updating-analyzers)
- [Add `description` mapping using `my_custom_analyzer`](#add-description-mapping-using-my_custom_analyzer)
- [Index a test document](#index-a-test-document)
- [Search query using `keyword` analyzer](#search-query-using-keyword-analyzer)
- [Close `analyzer_test` index](#close-analyzer_test-index)
- [Update `my_custom_analyzer` (remove `stop` token filter)](#update-my_custom_analyzer-remove-stop-token-filter)
- [Open `analyzer_test` index](#open-analyzer_test-index)
- [Retrieve index settings](#retrieve-index-settings)
- [Reindex documents](#reindex-documents)
  - [Updating existing mappings](#updating-existing-mappings)
- [Generally, field mappings cannot be updated](#generally-field-mappings-cannot-be-updated)
- [Some mapping parameters can be changed](#some-mapping-parameters-can-be-changed)
  - [Using dot notation in field names](#using-dot-notation-in-field-names)
- [Using dot notation for the `author` object](#using-dot-notation-for-the-author-object)
- [Retrieve mapping](#retrieve-mapping)
  - [Using the Analyze API](#using-the-analyze-api)
- [Analyzing a string with the `standard` analyzer](#analyzing-a-string-with-the-standard-analyzer)
- [Building the equivalent of the `standard` analyzer](#building-the-equivalent-of-the-standard-analyzer)

## Mapping & Analysis

### Adding analyzers to existing indices

## Close `analyzer_test` index
```
POST /analyzer_test/_close
```

## Add new analyzer
```
PUT /analyzer_test/_settings
{
  "analysis": {
    "analyzer": {
      "my_second_analyzer": {
        "type": "custom",
        "tokenizer": "standard",
        "char_filter": ["html_strip"],
        "filter": [
          "lowercase",
          "stop",
          "asciifolding"
        ]
      }
    }
  }
}
```

## Open `analyzer_test` index
```
POST /analyzer_test/_open
```

## Retrieve index settings
```
GET /analyzer_test/_settings
```

---

### Adding explicit mappings

## Add field mappings for `reviews` index
```
PUT /reviews
{
  "mappings": {
    "properties": {
      "rating": { "type": "float" },
      "content": { "type": "text" },
      "product_id": { "type": "integer" },
      "author": {
        "properties": {
          "first_name": { "type": "text" },
          "last_name": { "type": "text" },
          "email": { "type": "keyword" }
        }
      }
    }
  }
}
```

## Index a test document
```
PUT /reviews/_doc/1
{
  "rating": 5.0,
  "content": "Outstanding course! Bo really taught me a lot about Elasticsearch!",
  "product_id": 123,
  "author": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "johndoe123@example.com"
  }
}
```

---

### Adding mappings to existing indices

## Add new field mapping to existing index
```
PUT /reviews/_mapping
{
  "properties": {
    "created_at": {
      "type": "date"
    }
  }
}
```

## Retrieve the mapping
```
GET /reviews/_mapping
```

---

### Combining explicit and dynamic mapping

## Create index with one field mapping
```
PUT /people
{
  "mappings": {
    "properties": {
      "first_name": {
        "type": "text"
      }
    }
  }
}
```

## Index a test document with an unmapped field
```
POST /people/_doc
{
  "first_name": "Bo",
  "last_name": "Andersen"
}
```

## Retrieve mapping
```
GET /people/_mapping
```

## Clean up
```
DELETE /people
```

---

### Configuring dynamic mapping

## Disable dynamic mapping
```
PUT /people
{
  "mappings": {
    "dynamic": false,
    "properties": {
      "first_name": {
        "type": "text"
      }
    }
  }
}
```

## Set dynamic mapping to `strict`
```
PUT /people
{
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "first_name": {
        "type": "text"
      }
    }
  }
}
```

## Index a test document
```
POST /people/_doc
{
  "first_name": "Bo",
  "last_name": "Andersen"
}
```

## Retrieve mapping
```
GET /people/_mapping
```

## Search `first_name` field
```
GET /people/_search
{
  "query": {
    "match": {
      "first_name": "Bo"
    }
  }
}
```

## Search `last_name` field
```
GET /people/_search
{
  "query": {
    "match": {
      "last_name": "Andersen"
    }
  }
}
```

## Inheritance for the `dynamic` parameter
The following example sets the `dynamic` parameter to `"strict"` at the root level, but overrides it with a value of 
`true` for the `specifications.other` field mapping.

### Mapping
```
PUT /computers
{
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "name": {
        "type": "text"
      },
      "specifications": {
        "properties": {
          "cpu": {
            "properties": {
              "name": {
                "type": "text"
              }
            }
          },
          "other": {
            "dynamic": true,
            "properties": { ... }
          }
        }
      }
    }
  }
}
```

### Example document (invalid)
```
POST /computers/_doc
{
  "name": "Gamer PC",
  "specifications": {
    "cpu": {
      "name": "Intel Core i7-9700K",
      "frequency": 3.6
    }
  }
}
```

### Example document (OK)
```
POST /computers/_doc
{
  "name": "Gamer PC",
  "specifications": {
    "cpu": {
      "name": "Intel Core i7-9700K"
    },
    "other": {
      "security": "Kensington"
    }
  }
}
```

## Enabling numeric detection
When enabling numeric detection, Elasticsearch will check the contents of strings to see if they contain only numeric 
values - and map the fields accordingly as either `float` or `long`.

### Mapping
```
PUT /computers
{
  "mappings": {
    "numeric_detection": true
  }
}
```

### Example document
```
POST /computers/_doc
{
  "specifications": {
    "other": {
      "max_ram_gb": "32", # long
      "bluetooth": "5.2" # float
    }
  }
}
```

## Date detection

### Disabling date detection
```
PUT /computers
{
  "mappings": {
    "date_detection": false
  }
}
```

### Configuring dynamic date formats
```
PUT /computers
{
  "mappings": {
    "dynamic_date_formats": ["dd-MM-yyyy"]
  }
}
```

## Clean up
```
DELETE /people
```

---

### Creating custom analyzers

## Remove HTML tags and convert HTML entities
```
POST /_analyze
{
  "char_filter": ["html_strip"],
  "text": "I&apos;m in a <em>good</em> mood&nbsp;-&nbsp;and I <strong>love</strong> açaí!"
}
```

## Add the `standard` tokenizer
```
POST /_analyze
{
  "char_filter": ["html_strip"],
  "tokenizer": "standard",
  "text": "I&apos;m in a <em>good</em> mood&nbsp;-&nbsp;and I <strong>love</strong> açaí!"
}
```

## Add the `lowercase` token filter
```
POST /_analyze
{
  "char_filter": ["html_strip"],
  "tokenizer": "standard",
  "filter": [
    "lowercase"
  ],
  "text": "I&apos;m in a <em>good</em> mood&nbsp;-&nbsp;and I <strong>love</strong> açaí!"
}
```

## Add the `stop` token filter

This removes English stop words by default.
```
POST /_analyze
{
  "char_filter": ["html_strip"],
  "tokenizer": "standard",
  "filter": [
    "lowercase",
    "stop"
  ],
  "text": "I&apos;m in a <em>good</em> mood&nbsp;-&nbsp;and I <strong>love</strong> açaí!"
}
```

## Add the `asciifolding` token filter

Convert characters to their ASCII equivalent.
```
POST /_analyze
{
  "char_filter": ["html_strip"],
  "tokenizer": "standard",
  "filter": [
    "lowercase",
    "stop",
    "asciifolding"
  ],
  "text": "I&apos;m in a <em>good</em> mood&nbsp;-&nbsp;and I <strong>love</strong> açaí!"
}
```

## Create a custom analyzer named `my_custom_analyzer`
```
PUT /analyzer_test
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip"],
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "stop",
            "asciifolding"
          ]
        }
      }
    }
  }
}
```

## Configure the analyzer to remove Danish stop words

To run this query, change the index name to avoid a conflict. Remember to remove the comments. :wink:
```
PUT /analyzer_test
{
  "settings": {
    "analysis": {
      "filter": {
        "danish_stop": {
          "type": "stop",
          "stopwords": "_danish_"
        }
      },
      "char_filter": {
        # Add character filters here
      },
      "tokenizer": {
        # Add tokenizers here
      },
      "analyzer": {
        "my_custom_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip"],
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "danish_stop",
            "asciifolding"
          ]
        }
      }
    }
  }
}
```

## Test the custom analyzer
```
POST /analyzer_test/_analyze
{
  "analyzer": "my_custom_analyzer", 
  "text": "I&apos;m in a <em>good</em> mood&nbsp;-&nbsp;and I <strong>love</strong> açaí!"
}
```

---

### Defining field aliases

## Add `comment` alias pointing to the `content` field
```
PUT /reviews/_mapping
{
  "properties": {
    "comment": {
      "type": "alias",
      "path": "content"
    }
  }
}
```

## Using the field alias
```
GET /reviews/_search
{
  "query": {
    "match": {
      "comment": "outstanding"
    }
  }
}
```

## Using the "original" field name still works
```
GET /reviews/_search
{
  "query": {
    "match": {
      "content": "outstanding"
    }
  }
}
```

---

### Dynamic templates

## Map whole numbers to `integer` instead of `long`
```
PUT /dynamic_template_test
{
  "mappings": {
    "dynamic_templates": [
      {
        "integers": {
          "match_mapping_type": "long",
          "mapping": {
            "type": "integer"
          }
        }
      }
    ]
  }
}
```

## Test the dynamic template
```
POST /dynamic_template_test/_doc
{
  "in_stock": 123
}
```

## Retrieve mapping (and dynamic template)
```
GET /dynamic_template_test/_mapping
```

## Modify default mapping for strings (set `ignore_above` to 512)
```
PUT /test_index
{
  "mappings": {
    "dynamic_templates": [
      {
        "strings": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 512
              }
            }
          }
        }
      }
    ]
  }
}
```

## Using `match` and `unmatch`
```
PUT /test_index
{
  "mappings": {
    "dynamic_templates": [
      {
        "strings_only_text": {
          "match_mapping_type": "string",
          "match": "text_*",
          "unmatch": "*_keyword",
          "mapping": {
            "type": "text"
          }
        }
      },
      {
        "strings_only_keyword": {
          "match_mapping_type": "string",
          "match": "*_keyword",
          "mapping": {
            "type": "keyword"
          }
        }
      }
    ]
  }
}

POST /test_index/_doc
{
  "text_product_description": "A description.",
  "text_product_id_keyword": "ABC-123"
}
```

## Setting `match_pattern` to `regex`
```
PUT /test_index
{
  "mappings": {
    "dynamic_templates": [
      {
        "names": {
          "match_mapping_type": "string",
          "match": "^[a-zA-Z]+_name$",
          "match_pattern": "regex",
          "mapping": {
            "type": "text"
          }
        }
      }
    ]
  }
}

POST /test_index/_doc
{
  "first_name": "John",
  "middle_name": "Edward",
  "last_name": "Doe"
}
```

## Using `path_match`
```
PUT /test_index
{
  "mappings": {
    "dynamic_templates": [
      {
        "copy_to_full_name": {
          "match_mapping_type": "string",
          "path_match": "employer.name.*",
          "mapping": {
            "type": "text",
            "copy_to": "full_name"
          }
        }
      }
    ]
  }
}

POST /test_index/_doc
{
  "employer": {
    "name": {
      "first_name": "John",
      "middle_name": "Edward",
      "last_name": "Doe"
    }
  }
}
```

## Using placeholders
```
PUT /test_index
{
  "mappings": {
    "dynamic_templates": [
      {
        "no_doc_values": {
          "match_mapping_type": "*",
          "mapping": {
            "type": "{dynamic_type}",
            "index": false
          }
        }
      }
    ]
  }
}

POST /test_index/_doc
{
  "name": "John Doe",
  "age": 26
}
```

---

### How dates work in Elasticsearch

## Supplying only a date
```
PUT /reviews/_doc/2
{
  "rating": 4.5,
  "content": "Not bad. Not bad at all!",
  "product_id": 123,
  "created_at": "2015-03-27",
  "author": {
    "first_name": "Average",
    "last_name": "Joe",
    "email": "avgjoe@example.com"
  }
}
```

## Supplying both a date and time
```
PUT /reviews/_doc/3
{
  "rating": 3.5,
  "content": "Could be better",
  "product_id": 123,
  "created_at": "2015-04-15T13:07:41Z",
  "author": {
    "first_name": "Spencer",
    "last_name": "Pearson",
    "email": "spearson@example.com"
  }
}
```

## Specifying the UTC offset
```
PUT /reviews/_doc/4
{
  "rating": 5.0,
  "content": "Incredible!",
  "product_id": 123,
  "created_at": "2015-01-28T09:21:51+01:00",
  "author": {
    "first_name": "Adam",
    "last_name": "Jones",
    "email": "adam.jones@example.com"
  }
}
```

## Supplying a timestamp (milliseconds since the epoch)
```
# Equivalent to 2015-07-04T12:01:24Z
PUT /reviews/_doc/5
{
  "rating": 4.5,
  "content": "Very useful",
  "product_id": 123,
  "created_at": 1436011284000,
  "author": {
    "first_name": "Taylor",
    "last_name": "West",
    "email": "twest@example.com"
  }
}
```

## Retrieving documents
```
GET /reviews/_search
{
  "query": {
    "match_all": {}
  }
}
```

---

### How the `keyword` data type works

## Testing the `keyword` analyzer
```
POST /_analyze
{
  "text": "2 guys walk into   a bar, but the third... DUCKS! :-)",
  "analyzer": "keyword"
}
```

---

### Index templates

## Adding/updating an index template

This adds a new index template or updates an existing one.

```
PUT /_index_template/access-logs
{
  "index_patterns": ["access-logs-*"],
  "template": {
    "settings": {
      "number_of_shards": 2,
      "index.mapping.coerce": false
    },
    "mappings": {
      "properties": {
        "@timestamp": { "type": "date" },
        "url.original": { "type": "wildcard" },
        "url.path": { "type": "wildcard" },
        "url.scheme": { "type": "keyword" },
        "url.domain": { "type": "keyword" },
        "client.geo.continent_name": { "type": "keyword" },
        "client.geo.country_name": { "type": "keyword" },
        "client.geo.region_name": { "type": "keyword" },
        "client.geo.city_name": { "type": "keyword" },
        "user_agent.original": { "type": "keyword" },
        "user_agent.name": { "type": "keyword" },
        "user_agent.version": { "type": "keyword" },
        "user_agent.device.name": { "type": "keyword" },
        "user_agent.os.name": { "type": "keyword" },
        "user_agent.os.version": { "type": "keyword" }
      }
    }
  }
}
```

## Indexing a document into a new index

The index name matches the index pattern defined within the above index template. 
The index template's settings and mappings will be therefore be applied to the new index.

```
POST /access-logs-2023-01/_doc
{
  "@timestamp": "2023-01-01T00:00:00Z",
  "url.original": "https://example.com/products",
  "url.path": "/products",
  "url.scheme": "https",
  "url.domain": "example.com",
  "client.geo.continent_name": "Europe",
  "client.geo.country_name": "Denmark",
  "client.geo.region_name": "Capital City Region",
  "client.geo.city_name": "Copenhagen",
  "user_agent.original": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
  "user_agent.name": "Safari",
  "user_agent.version": "12.0",
  "user_agent.device.name": "iPhone",
  "user_agent.os.name": "iOS",
  "user_agent.os.version": "12.1.0"
}
```

## Manually creating an index

The index template's settings/mappings will also be applied to this index.

```
PUT /access-logs-2023-02
{
  "settings": {
    "number_of_shards": 1
  },
  "mappings": {
    "properties": {
      "url.query": {
        "type": "keyword"
      }
    }
  }
}
```

## Inspecting the new indices

```
GET /access-logs-2023-01
GET /access-logs-2023-02
```

## Retrieving an index template

```
GET /_index_template/access-logs
```

## Deleting an index template

```
DELETE /_index_template/access-logs
```

---

### Multi-field mappings

## Add `keyword` mapping to a `text` field
```
PUT /multi_field_test
{
  "mappings": {
    "properties": {
      "description": {
        "type": "text"
      },
      "ingredients": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```

## Index a test document
```
POST /multi_field_test/_doc
{
  "description": "To make this spaghetti carbonara, you first need to...",
  "ingredients": ["Spaghetti", "Bacon", "Eggs"]
}
```

## Retrieve documents
```
GET /multi_field_test/_search
{
  "query": {
    "match_all": {}
  }
}
```

## Querying the `text` mapping
```
GET /multi_field_test/_search
{
  "query": {
    "match": {
      "ingredients": "Spaghetti"
    }
  }
}
```

## Querying the `keyword` mapping
```
GET /multi_field_test/_search
{
  "query": {
    "term": {
      "ingredients.keyword": "Spaghetti"
    }
  }
}
```

## Clean up
```
DELETE /multi_field_test
```

---

### Reindexing documents with the Reindex API

## Add new index with new mapping
```
PUT /reviews_new
{
  "mappings" : {
    "properties" : {
      "author" : {
        "properties" : {
          "email" : {
            "type" : "keyword",
            "ignore_above" : 256
          },
          "first_name" : {
            "type" : "text"
          },
          "last_name" : {
            "type" : "text"
          }
        }
      },
      "content" : {
        "type" : "text"
      },
      "created_at" : {
        "type" : "date"
      },
      "product_id" : {
        "type" : "keyword"
      },
      "rating" : {
        "type" : "float"
      }
    }
  }
}
```

## Retrieve mapping
```
GET /reviews/_mappings
```

## Reindex documents into `reviews_new`
```
POST /_reindex
{
  "source": {
    "index": "reviews"
  },
  "dest": {
    "index": "reviews_new"
  }
}
```

## Delete all documents
```
POST /reviews_new/_delete_by_query
{
  "query": {
    "match_all": {}
  }
}
```

## Convert `product_id` values to strings
```
POST /_reindex
{
  "source": {
    "index": "reviews"
  },
  "dest": {
    "index": "reviews_new"
  },
  "script": {
    "source": """
      if (ctx._source.product_id != null) {
        ctx._source.product_id = ctx._source.product_id.toString();
      }
    """
  }
}
```

## Retrieve documents
```
GET /reviews_new/_search
{
  "query": {
    "match_all": {}
  }
}
```

## Reindex specific documents
```
POST /_reindex
{
  "source": {
    "index": "reviews",
    "query": {
      "match_all": { }
    }
  },
  "dest": {
    "index": "reviews_new"
  }
}
```

## Reindex only positive reviews
```
POST /_reindex
{
  "source": {
    "index": "reviews",
    "query": {
      "range": {
        "rating": {
          "gte": 4.0
        }
      }
    }
  },
  "dest": {
    "index": "reviews_new"
  }
}
```

## Removing fields (source filtering)
```
POST /_reindex
{
  "source": {
    "index": "reviews",
    "_source": ["content", "created_at", "rating"]
  },
  "dest": {
    "index": "reviews_new"
  }
}
```

## Changing a field's name
```
POST /_reindex
{
  "source": {
    "index": "reviews"
  },
  "dest": {
    "index": "reviews_new"
  },
  "script": {
    "source": """
      # Rename "content" field to "comment"
      ctx._source.comment = ctx._source.remove("content");
    """
  }
}
```

## Ignore reviews with ratings below 4.0
```
POST /_reindex
{
  "source": {
    "index": "reviews"
  },
  "dest": {
    "index": "reviews_new"
  },
  "script": {
    "source": """
      if (ctx._source.rating < 4.0) {
        ctx.op = "noop"; # Can also be set to "delete"
      }
    """
  }
}
```

---

### Retrieving mappings

## Retrieving mappings for the `reviews` index
```
GET /reviews/_mapping
```

## Retrieving mapping for the `content` field
```
GET /reviews/_mapping/field/content
```

## Retrieving mapping for the `author.email` field
```
GET /reviews/_mapping/field/author.email
```

---

### Understanding arrays

## Arrays of strings are concatenated when analyzed
```
POST /_analyze
{
  "text": ["Strings are simply", "merged together."],
  "analyzer": "standard"
}
```

---

### Understanding type coercion

## Supplying a floating point
```
PUT /coercion_test/_doc/1
{
  "price": 7.4
}
```

## Supplying a floating point within a string
```
PUT /coercion_test/_doc/2
{
  "price": "7.4"
}
```

## Supplying an invalid value
```
PUT /coercion_test/_doc/3
{
  "price": "7.4m"
}
```

## Retrieve document
```
GET /coercion_test/_doc/2
```

## Clean up
```
DELETE /coercion_test
```

---

### Updating analyzers

## Add `description` mapping using `my_custom_analyzer`
```
PUT /analyzer_test/_mapping
{
  "properties": {
    "description": {
      "type": "text",
      "analyzer": "my_custom_analyzer"
    }
  }
}
```

## Index a test document
```
POST /analyzer_test/_doc
{
  "description": "Is that Peter's cute-looking dog?"
}
```

## Search query using `keyword` analyzer
```
GET /analyzer_test/_search
{
  "query": {
    "match": {
      "description": {
        "query": "that",
        "analyzer": "keyword"
      }
    }
  }
}
```

## Close `analyzer_test` index
```
POST /analyzer_test/_close
```

## Update `my_custom_analyzer` (remove `stop` token filter)
```
PUT /analyzer_test/_settings
{
  "analysis": {
    "analyzer": {
      "my_custom_analyzer": {
        "type": "custom",
        "tokenizer": "standard",
        "char_filter": ["html_strip"],
        "filter": [
          "lowercase",
          "asciifolding"
        ]
      }
    }
  }
}
```

## Open `analyzer_test` index
```
POST /analyzer_test/_open
```

## Retrieve index settings
```
GET /analyzer_test/_settings
```

## Reindex documents
```
POST /analyzer_test/_update_by_query?conflicts=proceed
```

---

### Updating existing mappings

## Generally, field mappings cannot be updated

This query won't work.
```
PUT /reviews/_mapping
{
  "properties": {
    "product_id": {
      "type": "keyword"
    }
  }
}
```

## Some mapping parameters can be changed

The `ignore_above` mapping parameter _can_ be updated, for instance.
```
PUT /reviews/_mapping
{
  "properties": {
    "author": {
      "properties": {
        "email": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    }
  }
}
```

---

### Using dot notation in field names

## Using dot notation for the `author` object
```
PUT /reviews_dot_notation
{
  "mappings": {
    "properties": {
      "rating": { "type": "float" },
      "content": { "type": "text" },
      "product_id": { "type": "integer" },
      "author.first_name": { "type": "text" },
      "author.last_name": { "type": "text" },
      "author.email": { "type": "keyword" }
    }
  }
}
```

## Retrieve mapping
```
GET /reviews_dot_notation/_mapping
```

---

### Using the Analyze API

## Analyzing a string with the `standard` analyzer
```
POST /_analyze
{
  "text": "2 guys walk into   a bar, but the third... DUCKS! :-)",
  "analyzer": "standard"
}
```

## Building the equivalent of the `standard` analyzer
```
POST /_analyze
{
  "text": "2 guys walk into   a bar, but the third... DUCKS! :-)",
  "char_filter": [],
  "tokenizer": "standard",
  "filter": ["lowercase"]
}
```

---

---

**Previous**: [1 Mapping Analysis](./1-mapping-analysis.md)

**Next**: [3 Mapping Analysis](./3-mapping-analysis.md) | [Back to Elasticsearch Deep Dive](../README.md)
# Elasticsearch Aggregations

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide) blog posts.**

[← Back to Elasticsearch Deep Dive](../README.md)

## Table of Contents

- [Aggregations](#aggregations)
  - [Aggregating nested objects](#aggregating-nested-objects)
  - [Defining bucket rules with filters](#defining-bucket-rules-with-filters)
- [Placing documents into buckets based on criteria](#placing-documents-into-buckets-based-on-criteria)
- [Calculate average ratings for buckets](#calculate-average-ratings-for-buckets)
  - [Filtering out documents](#filtering-out-documents)
- [Filtering out documents with low `total_amount`](#filtering-out-documents-with-low-total_amount)
- [Aggregating on the bucket of remaining documents](#aggregating-on-the-bucket-of-remaining-documents)
  - [`global` aggregation](#global-aggregation)
- [Break out of the aggregation context](#break-out-of-the-aggregation-context)
- [Adding aggregation without global context](#adding-aggregation-without-global-context)
  - [Histograms](#histograms)
- [Distribution of `total_amount` with interval `25`](#distribution-of-total_amount-with-interval-25)
- [Requiring minimum 1 document per bucket](#requiring-minimum-1-document-per-bucket)
- [Specifying fixed bucket boundaries](#specifying-fixed-bucket-boundaries)
- [Aggregating by month with the `date_histogram` aggregation](#aggregating-by-month-with-the-date_histogram-aggregation)
  - [Introduction to aggregations](#introduction-to-aggregations)
- [Adding `orders` index with field mappings](#adding-orders-index-with-field-mappings)
- [Populating the `orders` index with test data](#populating-the-orders-index-with-test-data)
  - [Introduction to bucket aggregations](#introduction-to-bucket-aggregations)
- [Creating a bucket for each `status` value](#creating-a-bucket-for-each-status-value)
- [Including `20` terms instead of the default `10`](#including-20-terms-instead-of-the-default-10)
- [Aggregating documents with missing field (or `NULL`)](#aggregating-documents-with-missing-field-or-null)
- [Changing the minimum document count for a bucket to be created](#changing-the-minimum-document-count-for-a-bucket-to-be-created)
- [Ordering the buckets](#ordering-the-buckets)
  - [Metric aggregations](#metric-aggregations)
- [Calculating statistics with `sum`, `avg`, `min`, and `max` aggregations](#calculating-statistics-with-sum-avg-min-and-max-aggregations)
- [Retrieving the number of distinct values](#retrieving-the-number-of-distinct-values)
- [Retrieving the number of values](#retrieving-the-number-of-values)
- [Using `stats` aggregation for common statistics](#using-stats-aggregation-for-common-statistics)
  - [Missing field values](#missing-field-values)
- [Adding test documents](#adding-test-documents)
- [Aggregating documents with missing field value](#aggregating-documents-with-missing-field-value)
- [Combining `missing` aggregation with other aggregations](#combining-missing-aggregation-with-other-aggregations)
- [Deleting test documents](#deleting-test-documents)
  - [Nested aggregations](#nested-aggregations)
- [Retrieving statistics for each status](#retrieving-statistics-for-each-status)
- [Narrowing down the aggregation context](#narrowing-down-the-aggregation-context)
  - [Range aggregations](#range-aggregations)
- [`range` aggregation](#range-aggregation)
- [`date_range` aggregation](#date_range-aggregation)
- [Specifying the date format](#specifying-the-date-format)
- [Enabling keys for the buckets](#enabling-keys-for-the-buckets)
- [Defining the bucket keys](#defining-the-bucket-keys)
- [Adding a sub-aggregation](#adding-a-sub-aggregation)
- [Improving Search Results](#improving-search-results)
  - [Adding synonyms from file](#adding-synonyms-from-file)
- [Adding index with custom analyzer](#adding-index-with-custom-analyzer)
- [Synonyms file (`config/analysis/synonyms.txt`)](#synonyms-file-configanalysissynonymstxt)
- [Testing the analyzer](#testing-the-analyzer)
  - [Adding synonyms](#adding-synonyms)
- [Creating index with custom analyzer](#creating-index-with-custom-analyzer)
- [Testing the analyzer (with synonyms)](#testing-the-analyzer-with-synonyms)
- [Adding a test document](#adding-a-test-document)

## Aggregations

### Aggregating nested objects

```
GET /department/_search
{
  "size": 0,
  "aggs": {
    "employees": {
      "nested": {
        "path": "employees"
      }
    }
  }
}
```

```
GET /department/_search
{
  "size": 0,
  "aggs": {
    "employees": {
      "nested": {
        "path": "employees"
      },
      "aggs": {
        "minimum_age": {
          "min": {
            "field": "employees.age"
          }
        }
      }
    }
  }
}
```

---

### Defining bucket rules with filters

## Placing documents into buckets based on criteria

```
GET /recipes/_search
{
  "size": 0,
  "aggs": {
    "my_filter": {
      "filters": {
        "filters": {
          "pasta": {
            "match": {
              "title": "pasta"
            }
          },
          "spaghetti": {
            "match": {
              "title": "spaghetti"
            }
          }
        }
      }
    }
  }
}
```

## Calculate average ratings for buckets

```
GET /recipes/_search
{
  "size": 0,
  "aggs": {
    "my_filter": {
      "filters": {
        "filters": {
          "pasta": {
            "match": {
              "title": "pasta"
            }
          },
          "spaghetti": {
            "match": {
              "title": "spaghetti"
            }
          }
        }
      },
      "aggs": {
        "avg_rating": {
          "avg": {
            "field": "ratings"
          }
        }
      }
    }
  }
}
```

---

### Filtering out documents

## Filtering out documents with low `total_amount`

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "low_value": {
      "filter": {
        "range": {
          "total_amount": {
            "lt": 50
          }
        }
      }
    }
  }
}
```

## Aggregating on the bucket of remaining documents

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "low_value": {
      "filter": {
        "range": {
          "total_amount": {
            "lt": 50
          }
        }
      },
      "aggs": {
        "avg_amount": {
          "avg": {
            "field": "total_amount"
          }
        }
      }
    }
  }
}
```

---

### `global` aggregation

## Break out of the aggregation context

```
GET /orders/_search
{
  "query": {
    "range": {
      "total_amount": {
        "gte": 100
      }
    }
  },
  "size": 0,
  "aggs": {
    "all_orders": {
      "global": { },
      "aggs": {
        "stats_amount": {
          "stats": {
            "field": "total_amount"
          }
        }
      }
    }
  }
}
```

## Adding aggregation without global context

```
GET /orders/_search
{
  "query": {
    "range": {
      "total_amount": {
        "gte": 100
      }
    }
  },
  "size": 0,
  "aggs": {
    "all_orders": {
      "global": { },
      "aggs": {
        "stats_amount": {
          "stats": {
            "field": "total_amount"
          }
        }
      }
    },
    "stats_expensive": {
      "stats": {
        "field": "total_amount"
      }
    }
  }
}
```

---

### Histograms

## Distribution of `total_amount` with interval `25`

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "amount_distribution": {
      "histogram": {
        "field": "total_amount",
        "interval": 25
      }
    }
  }
}
```

## Requiring minimum 1 document per bucket

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "amount_distribution": {
      "histogram": {
        "field": "total_amount",
        "interval": 25,
        "min_doc_count": 1
      }
    }
  }
}
```

## Specifying fixed bucket boundaries

```
GET /orders/_search
{
  "size": 0,
  "query": {
    "range": {
      "total_amount": {
        "gte": 100
      }
    }
  },
  "aggs": {
    "amount_distribution": {
      "histogram": {
        "field": "total_amount",
        "interval": 25,
        "min_doc_count": 0,
        "extended_bounds": {
          "min": 0,
          "max": 500
        }
      }
    }
  }
}
```

## Aggregating by month with the `date_histogram` aggregation

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "orders_over_time": {
      "date_histogram": {
        "field": "purchased_at",
        "calendar_interval": "month"
      }
    }
  }
}
```

---

### Introduction to aggregations

## Adding `orders` index with field mappings

```
PUT /orders
{
  "mappings": {
    "properties": {
      "purchased_at": {
        "type": "date"
      },
      "lines": {
        "type": "nested",
        "properties": {
          "product_id": {
            "type": "integer"
          },
          "amount": {
            "type": "double"
          },
          "quantity": {
            "type": "short"
          }
        }
      },
      "total_amount": {
        "type": "double"
      },
      "status": {
        "type": "keyword"
      },
      "sales_channel": {
        "type": "keyword"
      },
      "salesman": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "name": {
            "type": "text"
          }
        }
      }
    }
  }
}
```

## Populating the `orders` index with test data

If you are using a cloud hosted Elasticsearch deployment, remove the `--cacert` argument.

```
# macOS & Linux
curl --cacert config/certs/http_ca.crt -u elastic -H "Content-Type:application/x-ndjson" -X POST https://localhost:9200/orders/_bulk --data-binary "@orders-bulk.json"

# Windows
curl --cacert config\certs\http_ca.crt -u elastic -H "Content-Type:application/x-ndjson" -X POST https://localhost:9200/orders/_bulk --data-binary "@orders-bulk.json"
```

---

### Introduction to bucket aggregations

## Creating a bucket for each `status` value

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "status_terms": {
      "terms": {
        "field": "status"
      }
    }
  }
}
```

## Including `20` terms instead of the default `10`

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "status_terms": {
      "terms": {
        "field": "status",
        "size": 20
      }
    }
  }
}
```

## Aggregating documents with missing field (or `NULL`)

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "status_terms": {
      "terms": {
        "field": "status",
        "size": 20,
        "missing": "N/A"
      }
    }
  }
}
```

## Changing the minimum document count for a bucket to be created

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "status_terms": {
      "terms": {
        "field": "status",
        "size": 20,
        "missing": "N/A",
        "min_doc_count": 0
      }
    }
  }
}
```

## Ordering the buckets

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "status_terms": {
      "terms": {
        "field": "status",
        "size": 20,
        "missing": "N/A",
        "min_doc_count": 0,
        "order": {
          "_key": "asc"
        }
      }
    }
  }
}
```

---

### Metric aggregations

## Calculating statistics with `sum`, `avg`, `min`, and `max` aggregations

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "total_sales": {
      "sum": {
        "field": "total_amount"
      }
    },
    "avg_sale": {
      "avg": {
        "field": "total_amount"
      }
    },
    "min_sale": {
      "min": {
        "field": "total_amount"
      }
    },
    "max_sale": {
      "max": {
        "field": "total_amount"
      }
    }
  }
}
```

## Retrieving the number of distinct values

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "total_salesmen": {
      "cardinality": {
        "field": "salesman.id"
      }
    }
  }
}
```

## Retrieving the number of values

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "values_count": {
      "value_count": {
        "field": "total_amount"
      }
    }
  }
}
```

## Using `stats` aggregation for common statistics

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "amount_stats": {
      "stats": {
        "field": "total_amount"
      }
    }
  }
}
```

---

### Missing field values

## Adding test documents

```
PUT /orders/_doc/1001
{
  "total_amount": 100
}
```

```
PUT /orders/_doc/1002
{
  "total_amount": 200,
  "status": null
}
```

## Aggregating documents with missing field value

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "orders_without_status": {
      "missing": {
        "field": "status"
      }
    }
  }
}
```

## Combining `missing` aggregation with other aggregations

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "orders_without_status": {
      "missing": {
        "field": "status"
      },
      "aggs": {
        "missing_sum": {
          "sum": {
            "field": "total_amount"
          }
        }
      }
    }
  }
}
```

## Deleting test documents

```
DELETE /orders/_doc/1001
```

```
DELETE /orders/_doc/1002
```

---

### Nested aggregations

## Retrieving statistics for each status

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "status_terms": {
      "terms": {
        "field": "status"
      },
      "aggs": {
        "status_stats": {
          "stats": {
            "field": "total_amount"
          }
        }
      }
    }
  }
}
```

## Narrowing down the aggregation context

```
GET /orders/_search
{
  "size": 0,
  "query": {
    "range": {
      "total_amount": {
        "gte": 100
      }
    }
  },
  "aggs": {
    "status_terms": {
      "terms": {
        "field": "status"
      },
      "aggs": {
        "status_stats": {
          "stats": {
            "field": "total_amount"
          }
        }
      }
    }
  }
}
```

---

### Range aggregations

## `range` aggregation

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "amount_distribution": {
      "range": {
        "field": "total_amount",
        "ranges": [
          {
            "to": 50
          },
          {
            "from": 50,
            "to": 100
          },
          {
            "from": 100
          }
        ]
      }
    }
  }
}
```

## `date_range` aggregation

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "purchased_ranges": {
      "date_range": {
        "field": "purchased_at",
        "ranges": [
          {
            "from": "2016-01-01",
            "to": "2016-01-01||+6M"
          },
          {
            "from": "2016-01-01||+6M",
            "to": "2016-01-01||+1y"
          }
        ]
      }
    }
  }
}
```

## Specifying the date format

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "purchased_ranges": {
      "date_range": {
        "field": "purchased_at",
        "format": "yyyy-MM-dd",
        "ranges": [
          {
            "from": "2016-01-01",
            "to": "2016-01-01||+6M"
          },
          {
            "from": "2016-01-01||+6M",
            "to": "2016-01-01||+1y"
          }
        ]
      }
    }
  }
}
```

## Enabling keys for the buckets

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "purchased_ranges": {
      "date_range": {
        "field": "purchased_at",
        "format": "yyyy-MM-dd",
        "keyed": true,
        "ranges": [
          {
            "from": "2016-01-01",
            "to": "2016-01-01||+6M"
          },
          {
            "from": "2016-01-01||+6M",
            "to": "2016-01-01||+1y"
          }
        ]
      }
    }
  }
}
```

## Defining the bucket keys

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "purchased_ranges": {
      "date_range": {
        "field": "purchased_at",
        "format": "yyyy-MM-dd",
        "keyed": true,
        "ranges": [
          {
            "from": "2016-01-01",
            "to": "2016-01-01||+6M",
            "key": "first_half"
          },
          {
            "from": "2016-01-01||+6M",
            "to": "2016-01-01||+1y",
            "key": "second_half"
          }
        ]
      }
    }
  }
}
```

## Adding a sub-aggregation

```
GET /orders/_search
{
  "size": 0,
  "aggs": {
    "purchased_ranges": {
      "date_range": {
        "field": "purchased_at",
        "format": "yyyy-MM-dd",
        "keyed": true,
        "ranges": [
          {
            "from": "2016-01-01",
            "to": "2016-01-01||+6M",
            "key": "first_half"
          },
          {
            "from": "2016-01-01||+6M",
            "to": "2016-01-01||+1y",
            "key": "second_half"
          }
        ]
      },
      "aggs": {
        "bucket_stats": {
          "stats": {
            "field": "total_amount"
          }
        }
      }
    }
  }
}
```

---

## Improving Search Results

### Adding synonyms from file

## Adding index with custom analyzer

```
PUT /synonyms
{
  "settings": {
    "analysis": {
      "filter": {
        "synonym_test": {
          "type": "synonym",
          "synonyms_path": "analysis/synonyms.txt"
        }
      },
      "analyzer": {
        "my_analyzer": {
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "synonym_test"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "analyzer": "my_analyzer"
      }
    }
  }
}
```

## Synonyms file (`config/analysis/synonyms.txt`)

```
# This is a comment

awful => terrible
awesome => great, super
elasticsearch, logstash, kibana => elk
weird, strange
```

## Testing the analyzer

```
POST /synonyms/_analyze
{
  "analyzer": "my_analyzer",
  "text": "Elasticsearch"
}
```

---

### Adding synonyms

## Creating index with custom analyzer

```
PUT /synonyms
{
  "settings": {
    "analysis": {
      "filter": {
        "synonym_test": {
          "type": "synonym", 
          "synonyms": [
            "awful => terrible",
            "awesome => great, super",
            "elasticsearch, logstash, kibana => elk",
            "weird, strange"
          ]
        }
      },
      "analyzer": {
        "my_analyzer": {
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "synonym_test"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "description": {
        "type": "text",
        "analyzer": "my_analyzer"
      }
    }
  }
}
```

## Testing the analyzer (with synonyms)

```
POST /synonyms/_analyze
{
  "analyzer": "my_analyzer",
  "text": "awesome"
}
```

```
POST /synonyms/_analyze
{
  "analyzer": "my_analyzer",
  "text": "Elasticsearch"
}
```

```
POST /synonyms/_analyze
{
  "analyzer": "my_analyzer",
  "text": "weird"
}
```

```
POST /synonyms/_analyze
{
  "analyzer": "my_analyzer",
  "text": "Elasticsearch is awesome, but can also seem weird sometimes."
}
```

## Adding a test document

```
POST /synonyms/_doc
---

**Previous**: [5 Aggregations](./5-aggregations.md)

**Next**: [7 Aggregations](./7-aggregations.md) | [Back to Elasticsearch Deep Dive](../README.md)
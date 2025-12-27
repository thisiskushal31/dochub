# Elasticsearch Controlling Query Results

> **For deployment strategies, decision frameworks, and high-level overviews, see the [Elasticsearch Deployment Guide](https://thisiskushal31.github.io/blog/#/blog/elasticsearch-deployment-guide) blog posts.**

[← Back to Elasticsearch Deep Dive](../README.md)


## Table of Contents

- [Adding a `filter` clause to the `bool` query](#adding-a-filter-clause-to-the-bool-query)
  - [Sorting by multi-value fields](#sorting-by-multi-value-fields)
- [Sorting by the average rating (descending)](#sorting-by-the-average-rating-descending)
  - [Sorting results](#sorting-results)
- [Sorting by ascending order (implicitly)](#sorting-by-ascending-order-implicitly)
- [Sorting by descending order](#sorting-by-descending-order)
- [Sorting by multiple fields](#sorting-by-multiple-fields)
  - [Source filtering](#source-filtering)
- [Excluding the `_source` field altogether](#excluding-the-_source-field-altogether)
- [Only returning the `created` field](#only-returning-the-created-field)
- [Only returning an object's key](#only-returning-an-objects-key)
- [Returning all of an object's keys](#returning-all-of-an-objects-keys)
- [Returning the `ingredients` object with all keys, __and__ the `servings` field](#returning-the-ingredients-object-with-all-keys-__and__-the-servings-field)
- [Including all of the `ingredients` object's keys, except the `name` key](#including-all-of-the-ingredients-objects-keys-except-the-name-key)
  - [Specifying an offset](#specifying-an-offset)
- [Specifying an offset with the `from` parameter](#specifying-an-offset-with-the-from-parameter)
  - [Specifying the result format](#specifying-the-result-format)
- [Returning results as YAML](#returning-results-as-yaml)
- [Returning pretty JSON](#returning-pretty-json)
  - [Specifying the result size](#specifying-the-result-size)
- [Using a query parameter](#using-a-query-parameter)
- [Using a parameter within the request body](#using-a-parameter-within-the-request-body)

## Adding a `filter` clause to the `bool` query

```
GET /recipes/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "title": "pasta"
          }
        }
      ],
      "filter": [
        {
          "range": {
            "preparation_time_minutes": {
              "lte": 15
            }
          }
        }
      ]
    }
  }
}
```

---

### Sorting by multi-value fields

## Sorting by the average rating (descending)

```
GET /recipes/_search
{
  "_source": "ratings",
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "ratings": {
        "order": "desc",
        "mode": "avg"
      }
    }
  ]
}
```

---

### Sorting results

## Sorting by ascending order (implicitly)

```
GET /recipes/_search
{
  "_source": false,
  "query": {
    "match_all": {}
  },
  "sort": [
    "preparation_time_minutes"
  ]
}
```

## Sorting by descending order

```
GET /recipes/_search
{
  "_source": "created",
  "query": {
    "match_all": {}
  },
  "sort": [
    { "created": "desc" }
  ]
}
```

## Sorting by multiple fields

```
GET /recipes/_search
{
  "_source": [ "preparation_time_minutes", "created" ],
  "query": {
    "match_all": {}
  },
  "sort": [
    { "preparation_time_minutes": "asc" },
    { "created": "desc" }
  ]
}
```

---

### Source filtering

## Excluding the `_source` field altogether

```
GET /recipes/_search
{
  "_source": false,
  "query": {
    "match": { "title": "pasta" }
  }
}
```

## Only returning the `created` field

```
GET /recipes/_search
{
  "_source": "created",
  "query": {
    "match": { "title": "pasta" }
  }
}
```

## Only returning an object's key

```
GET /recipes/_search
{
  "_source": "ingredients.name",
  "query": {
    "match": { "title": "pasta" }
  }
}
```

## Returning all of an object's keys

```
GET /recipes/_search
{
  "_source": "ingredients.*",
  "query": {
    "match": { "title": "pasta" }
  }
}
```

## Returning the `ingredients` object with all keys, __and__ the `servings` field

```
GET /recipes/_search
{
  "_source": [ "ingredients.*", "servings" ],
  "query": {
    "match": { "title": "pasta" }
  }
}
```

## Including all of the `ingredients` object's keys, except the `name` key

```
GET /recipes/_search
{
  "_source": {
    "includes": "ingredients.*",
    "excludes": "ingredients.name"
  },
  "query": {
    "match": { "title": "pasta" }
  }
}
```

---

### Specifying an offset

## Specifying an offset with the `from` parameter

```
GET /recipes/_search
{
  "_source": false,
  "size": 2,
  "from": 2,
  "query": {
    "match": {
      "title": "pasta"
    }
  }
}
```

---

### Specifying the result format

## Returning results as YAML

```
GET /recipes/_search?format=yaml
{
    "query": {
      "match": { "title": "pasta" }
    }
}
```

## Returning pretty JSON

```
GET /recipes/_search?pretty
{
    "query": {
      "match": { "title": "pasta" }
    }
}
```

---

### Specifying the result size

## Using a query parameter

```
GET /recipes/_search?size=2
{
  "_source": false,
  "query": {
    "match": {
      "title": "pasta"
    }
  }
}
```

## Using a parameter within the request body

```
GET /recipes/_search
{
  "_source": false,
  "size": 2,
  "query": {
    "match": {
      "title": "pasta"
    }
  }
}
```

---

---

**Previous**: [4 Controlling Results](./4-controlling-results.md)

**Next**: [6 Controlling Results](./6-controlling-results.md) | [Back to Elasticsearch Deep Dive](../README.md)
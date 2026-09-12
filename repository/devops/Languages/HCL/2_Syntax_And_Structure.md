# Syntax and structure

HCL syntax is built from **arguments** and **blocks**. Identifiers, comments, and character encoding follow consistent rules so that configs stay readable and portable across tools.

## Arguments

An argument assigns a value to a name. The identifier on the left of the equals sign is the argument name; the expression on the right is its value. The tool (e.g. Terraform, Packer) and the block type define what names are valid and what value types are allowed.

```
image_id = "abc123"
ami      = "ami-0a1b2c3d"
```

Arguments appear inside block bodies. The same name can be used in different blocks; each block has its own scope.

## Blocks

A block is a container for other content. It has a **type** (e.g. `resource`, `source`, `variable`), zero or more **labels** (depending on the block type), and a **body** enclosed in curly braces. Inside the body you write further arguments and nested blocks, forming a hierarchy.

**Block shape.** The general form is: block type, then zero or more labels (usually quoted strings), then the body in `{ ... }`. Labels are positional: the first label might mean "resource type," the second "instance name," and so on. The tool defines how many labels each block type has and what they mean. When you have multiple blocks of the same type (e.g. several `resource` blocks), labels are what distinguish them. The body may contain only arguments and nested blocks; the order of arguments usually does not matter, but the tool may require or allow certain nested block types.

Example: a Terraform-style resource block with two labels (resource type and instance name) and a nested block.

```
resource "aws_instance" "example" {
  ami = "ami-abc123"

  network_interface {
    device_index = 0
    subnet_id   = "subnet-xyz"
  }
}
```

Example: a Packer-style source block with two labels and a nested block.

```
source "amazon-ebs" "example" {
  ami_name = "my-image"

  tags = {
    role = "app"
  }
}
```

Each product defines which block types exist, how many labels they take, and what arguments and nested blocks they allow. Top-level blocks are those that can appear at the root of a file; most features (resources, variables, data sources, etc.) are implemented as top-level blocks.

**Files and merging.** You can split config across multiple files in a directory (e.g. `main.tf`, `variables.tf`, `outputs.tf`). The tool typically merges all relevant files in that directory (and sometimes subdirectories or modules) into one logical configuration before evaluating. So the same block type can appear in different files; the result is a single namespace of blocks identified by type and labels.

## Identifiers

Argument names, block type names, and labels are identifiers. Identifiers can contain letters, digits, underscores (`_`), and hyphens (`-`). The first character must not be a digit (to avoid confusion with numeric literals). Full rules follow Unicode identifier syntax extended to allow the ASCII hyphen. Identifiers are case-sensitive.

## Comments

Three comment styles are supported:

- `#` — single-line comment to end of line (preferred; formatting tools often standardize on this).
- `//` — single-line comment to end of line.
- `/*` and `*/` — delimit a comment that can span multiple lines.

```
# Preferred single-line style
// Also allowed
/*
   Multi-line
   comment
*/
```

## Character encoding and line endings

Configuration files must be UTF-8 encoded. Delimiters (braces, equals, quotes) are ASCII, but identifiers, comments, and string values may contain non-ASCII characters. Both Unix (LF) and Windows (CRLF) line endings are accepted; Unix-style is idiomatic and formatters may normalize to LF.

---

## Further reading

- [Terraform: Configuration Syntax](https://developer.hashicorp.com/terraform/language/syntax/configuration)
- [Packer: HCL syntax reference](https://developer.hashicorp.com/packer/docs/templates/hcl_templates/syntax)
- [HCL native syntax specification (GitHub)](https://github.com/hashicorp/hcl/blob/main/hclsyntax/spec.md)

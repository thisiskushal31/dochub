# File system interface

[← Back to Fundamentals](./README.md) · [↑ Operating Systems](../README.md)

This topic covers the **file system as seen by programs and users**: **files**, **directories**, **operations** (open, read, write, close, seek), **naming**, and **mounting**. It is the **interface** to storage, not the on-disk implementation. For implementation (allocation, on-disk layout), see [Storage and I/O](./8_Storage_And_IO.md).

---

## Files and directories (concepts)

- **File** — A named, linear sequence of bytes. The OS does not impose structure; the application does (e.g. text, binary, database).
- **Directory** — A container that holds **names** of files and other directories. Typically implemented as a special file or table mapping names to **inode numbers** (or equivalent). Hierarchical **path names** (e.g. `/home/user/file.txt`) identify a file.
- **Metadata** — Per file: size, permissions, owner, group, timestamps (create, modify, access), and location of data (handled by the file system implementation).

The **file system interface** is the set of **operations** the OS offers: create, open, read, write, seek, close, delete, rename, get/set attributes.

---

## Main operations (concepts)

| Operation | Meaning |
|-----------|--------|
| **Create** | Allocate a new file (or directory); add a name in a directory. |
| **Open** | Prepare a file for read/write; return a **handle** (file descriptor). The kernel checks permissions and keeps per-process state (current position). |
| **Read** | Copy bytes from the file (at current position) into a buffer; advance position. |
| **Write** | Copy bytes from a buffer into the file (at current position); advance position; may extend the file. |
| **Seek** | Set the current position (for next read/write). Enables random access. |
| **Close** | Release the handle; flush buffers if needed. |
| **Delete (unlink)** | Remove a name from a directory; if the file has no other names (hard links) and no open handles, free its storage. |
| **Rename** | Change a name in a directory (or move across directories). |

Applications use these via **system calls** (e.g. `open`, `read`, `write`, `lseek`, `close`) or **library wrappers** (e.g. `fopen`, `fread` in C).

---

## Links (interface view)

- **Hard link** — Two or more directory entries (names) that refer to the **same** file (same inode). Deleting one name does not remove the file until all names are removed. No hard links to directories (to avoid cycles).
- **Symbolic (soft) link** — A special file that holds a **path string**. When the OS resolves the path, it follows the link. Can point to directories; can be dangling (target missing).

Links are part of the **naming** layer: they give multiple names (or indirection) to the same or another file.

---

## Mounting

A **mount point** is a directory where a **different** file system (e.g. another disk, or a network share) is attached. Before the mount, the directory exists; after the mount, listing that directory shows the **root** of the mounted file system. The OS keeps a **mount table** (which device or remote is mounted where). This way, multiple file systems (local and remote) appear as one **directory tree**.

---

## Summary

- **File** = named byte sequence; **directory** = mapping of names to files/dirs. **Metadata** = size, permissions, timestamps.
- **Operations:** create, open, read, write, seek, close, delete, rename. Programs use them via system calls or libraries.
- **Hard link** = multiple names for same file; **symbolic link** = file containing a path (indirection).
- **Mounting** = attaching a file system at a directory; one tree from many file systems.

---

## Further reading

- [GeeksforGeeks: File system interface](https://www.geeksforgeeks.org/operating-systems/file-systems-in-operating-system/)
- [File system (Wikipedia)](https://en.wikipedia.org/wiki/File_system)

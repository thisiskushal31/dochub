# Storage Systems

## Table of Contents

  - [File-Based Storage System](#file-based-storage-system)
  - [Database Storage Systems](#database-storage-systems)
  - [Differences Between File and Database Storage Systems](#differences-between-file-and-database-storage-systems)
  - [Block, Object, and File Storage](#block-object-and-file-storage)
  - [Block Storage vs. Object Storage vs. File Storage](#block-storage-vs-object-storage-vs-file-storage)
File and database storage systems are important to the effective management and arrangement of data in system design. These systems offer a structure for data organization, retrieval, and storage in applications while guaranteeing data accessibility and integrity. Database systems provide structured data management with advanced querying capabilities, whereas file systems manage both structured and unstructured data.

![File and Database Storage Systems](../assets/databases/storage-file-database.webp)

*Image Source: [File and Database Storage Systems in System Design - GeeksforGeeks](https://www.geeksforgeeks.org/system-design/file-and-database-storage-systems-in-system-design/)*

### File-Based Storage System

On a computer or server, a file-based storage system keeps data as separate files. Under a system of directories and subdirectories, each file is arranged in folders and given a unique name. This straightforward approach is effective at storing both organized and unstructured data, such as logs, papers, and photos. But it doesn't have advanced functions of databases, including indexing and querying.

**Pros of File-Based Storage System:**
- **Simplicity**: Easy to implement and manage, requiring no complex setup
- **Compatibility**: Works with many standard operating systems and tools
- **Cost-Effective**: Suitable for small-scale storage needs without high expenses
- **Flexibility**: You can store any type of data (e.g., images, videos, documents) in various formats without worrying about predefined schemas
- **Performance for Simple Operations**: File-based storage can be faster for basic file retrieval tasks, especially when dealing with large, unstructured data like images or logs
- **Less Overhead**: No need for database software or servers, leading to lower computational overhead in small or less complex systems

**Cons of File-Based Storage System:**
- **Limited Scalability**: Not ideal for large-scale systems or growing data needs
- **No Querying Support**: Cannot perform advanced searches like databases
- **Data Integrity Issues**: Managing duplicates or relationships between files can be challenging
- **No Built-in Relationships**: No built-in support for relationships between files
- **Manual Management**: Requires manual organization and management of files

**Use Cases:**
- Document storage
- Media files (images, videos)
- Configuration files
- Log files
- Static content serving

### Database Storage Systems

A database storage system is a structured way to store, manage, and retrieve data efficiently. Unlike file-based systems, databases organize data into tables, rows, and columns, making it easier to query and maintain. These systems are commonly used in applications requiring data relationships, transactions, and large-scale processing.

**Types of Database Storage Systems:**
- **Relational**: Tables with relationships (MySQL, PostgreSQL)
- **Document**: JSON/BSON documents (MongoDB)
- **Key-Value**: Simple key-value pairs (Redis, DynamoDB)
- **Columnar**: Column families (Cassandra, HBase)
- **Graph**: Nodes and edges (Neo4j)

**Pros of Database Storage Systems:**
- **Efficient Querying**: Allows advanced searches and operations using query languages like SQL
- **Data Integrity**: Maintains consistency and relationships between data
- **Scalability**: Handles growing data needs with options like sharding or replication
- **Data Organization**: Databases structure data in tables, making it easier to organize and maintain compared to flat file systems
- **Data Relationships**: Supports relationships between data using keys and constraints, which is not possible in file-based systems
- **Security**: Provides robust mechanisms for consistency, integrity, and access control, ensuring better data reliability

**Cons of Database Storage Systems:**
- **Complex Setup**: Requires proper design and configuration
- **Higher Cost**: May involve licensing fees and infrastructure expenses
- **Performance Overhead**: Can be slower for very simple data storage needs compared to file-based systems
- **Learning Curve**: Requires knowledge of query languages and database concepts

**Use Cases:**
- Transactional systems
- Applications with complex relationships
- Systems requiring ACID properties
- Large-scale data processing
- Real-time analytics

### Differences Between File and Database Storage Systems

| Aspect | File Storage System | Database Storage System |
|--------|---------------------|------------------------|
| **Structure** | Data is stored as individual files in directories | Data is organized in tables, rows, and columns |
| **Data Relationships** | No built-in support for relationships between files | Supports relationships using keys and constraints |
| **Querying** | No advanced querying; files need to be manually read | Allows complex queries using languages like SQL |
| **Scalability** | Limited scalability; better for smaller data sets | Highly scalable for large-scale data needs |
| **Ease of Use** | Simple to implement and manage | Requires proper design and setup |
| **Use Cases** | Suitable for documents, images, or logs | Ideal for transactional systems and relational data |

### Block, Object, and File Storage

Storage is a key part of system design, and understanding the types of storage can help you build efficient systems. Block, object, and file storage are three common storage methods, each suited for specific use cases.

#### 1. Block Storage

Block storage is a technique for keeping data in chunks or blocks of an exact size. Every block has its own address, functions independently, and can store any kind of data. Block storage lacks a predetermined structure, unlike file storage, which arranges data in a hierarchy. It is frequently utilised in systems like databases and virtual machines that require great performance and scalability.

**How Block Storage Works:**

Imagine a warehouse where items aren't organized by category or aisle, but simply placed in numbered bins. Each bin (block) can hold anything, and you access items directly by their bin number. This direct-access model eliminates the overhead of navigating folder hierarchies, resulting in exceptional speed.

**Key Features:**
- **High Performance**: Block storage is perfect for high-performance applications since it is designed for quick read/write operations
- **Flexibility**: Since it does not impose a particular structure, it allows data to be stored in any format
- **Scalability**: Blocks can be added or removed easily to scale the storage up or down
- **Independence**: Each block operates independently, enabling precise control and management of data
- **Use in Distributed Systems**: Block storage can be distributed across multiple servers for redundancy and improved performance

**Important Note**: Block storage doesn't inherently "understand" the data it stores - it only stores raw bytes. The file system on top of block storage interprets it into files. So block storage itself isn't aware of formats or data types.

**Example:**
Consider a cloud-based database service where you need to store a large amount of structured data. The data is broken into smaller pieces (blocks) and distributed across a storage area network. When you access the database:
- The system retrieves the required blocks and reassembles them into meaningful data for your application
- Amazon Elastic Block Store (EBS) is a real-world example of block storage

![Block Storage Architecture](../assets/databases/storage-block-direct-access.webp)

*Image Source: [Block, Object, and File Storage in System Design - GeeksforGeeks](https://www.geeksforgeeks.org/system-design/block-object-and-file-storage-in-cloud-with-difference/)*

**Use Cases:**
- Databases (MySQL, PostgreSQL)
- Virtual machines
- High-performance applications
- Transactional workloads

**Examples:**
- AWS EBS (Elastic Block Store)
- Azure Disks
- GCP Persistent Disks
- SAN (Storage Area Network)

#### 2. Object Storage

With object storage, data is kept as discrete units known as "objects." A unique identity, metadata (information about the data), and the actual data are all contained in each item. Object storage is hence very flexible, scalable, and appropriate for storing vast amounts of unstructured data, such as backups, videos, and pictures.

**Key Characteristics:**
- Object storage doesn't use fixed-sized blocks or a hierarchical file system like file or block storage does
- Instead, it organizes data into a flat structure, which is easier to scale and manage in distributed environments

**Important Note**: Object storage is ideal for write-once, read-many (WORM) workloads, not for frequently modified data.

**Understanding the Object Model:**

Think of object storage as a vast library where every book has a unique ISBN, a detailed catalog card, and can be retrieved directly without knowing which shelf it's on. The flat structure eliminates hierarchical limitations, allowing the system to scale horizontally across unlimited storage nodes.

**Key Features:**
- **Scalability**: Object storage is perfect for cloud applications because it can manage massive volumes of data
- **Metadata Richness**: Metadata is stored in every object to help with data management, indexing, and searching
- **Global Accessibility**: Objects can be accessed via HTTP/HTTPS, making it suitable for web-based applications
- **Cost-Effective for Unstructured Data**: Large amounts of unstructured data, such as logs, media files, and backups, are ideal for this storage
- **Resilient and Durable**: To provide stability and fault tolerance, object storage systems frequently duplicate data across different locations

**Examples:**
- **Media Streaming**: Netflix and YouTube store billions of video files as objects, serving them to millions of concurrent viewers
- **Backup and Archival**: Companies use object storage for long-term data retention, leveraging its durability and low cost per gigabyte
- **Big Data Analytics**: Data lakes built on object storage allow analysts to store raw data in any format and process it at scale
- **Static Website Hosting**: Web assets like images, CSS, and JavaScript files are served directly from object storage

**Use Cases:**
- Media files (videos, images, audio)
- Backups and archives
- Static web content
- Big data analytics
- Data lakes

**Examples:**
- AWS S3 (Simple Storage Service)
- Azure Blob Storage
- GCP Cloud Storage
- DigitalOcean Spaces

#### 3. File Storage

Similar to how we arrange files on a computer, file storage is a conventional technique of storing data in a hierarchical system of files and folders. Every file has a name and directory path, which helps access and navigation. Applications that need regular updates and organized data management are best suited for it.

**The Hierarchical Model:**

File storage organizes data in a tree structure with directories (folders) containing files and subdirectories. Each file has a path (like `/projects/2024/report.pdf`) that defines its location, making navigation logical and straightforward.

**Key Features:**
- **Hierarchical Organization**: Data is stored in a clear folder-and-file structure, making it easy to locate and manage
- **Simplicity**: File storage systems are easy to set up and use for small-scale applications
- **Compatibility**: Works well with legacy applications and systems that require traditional file access methods
- **Shared Access**: Supports multi-user environments with file permissions and version control
- **Data Integrity**: Ensures consistency and integrity through locking mechanisms during file updates (though distributed file systems like NFS can experience locking issues and performance bottlenecks under concurrency)

**Examples:**
- **Corporate File Shares**: Departments share documents, spreadsheets, and presentations through networked drives with folder hierarchies mirroring organizational structure
- **Content Management**: Web servers host files in organized directories, serving websites through familiar path-based URLs
- **Development Environments**: Developers work with codebases organized in folder structures, relying on file storage for source control integration
- **Home Directories**: User workspaces on servers maintain personal files in individual, permission-protected directories

![File Storage (NAS)](../assets/databases/storage-file-nas.webp)

*Image Source: [Block, Object, and File Storage in System Design - GeeksforGeeks](https://www.geeksforgeeks.org/system-design/block-object-and-file-storage-in-cloud-with-difference/)*

**Use Cases:**
- Shared file systems
- Content management
- Document collaboration
- Development environments
- Home directories

**Examples:**
- AWS EFS (Elastic File System)
- Azure Files
- GCP Filestore
- Network Attached Storage (NAS)
- Shared Drives

### Block Storage vs. Object Storage vs. File Storage

![Storage Comparison](../assets/databases/storage-comparison.webp)

*Image Source: [Block, Object, and File Storage in System Design - GeeksforGeeks](https://www.geeksforgeeks.org/system-design/block-object-and-file-storage-in-cloud-with-difference/)*

**Detailed Comparison:**

| Aspect | Block Storage | Object Storage | File Storage |
|--------|---------------|----------------|--------------|
| **Structure** | Divides data into fixed-size blocks, each with a unique identifier | Stores data as objects with metadata and a unique ID in a flat structure | Organizes data in a hierarchical structure of files and folders |
| **Use Cases** | Ideal for databases, virtual machines, and transactional workloads requiring high performance | Best for storing large amounts of unstructured data, like multimedia files or backups | Suitable for structured file storage and shared file access, such as documents and spreadsheets |
| **Performance** | High performance and low latency, especially for read/write operations | Optimised for scalability and durability, not real-time performance | Moderate performance; dependent on file system and storage device |
| **Scalability** | Scales well but may require manual configuration for capacity expansion | Highly scalable; can handle massive amounts of data across distributed systems | Limited scalability compared to object storage; suitable for smaller systems |
| **Metadata** | Minimal metadata, often handled by the application layer | Extensive metadata stored with each object, enabling advanced search and analytics | Basic metadata, such as file name, type, and permissions |
| **Durability** | Requires manual backup or snapshot configurations for data durability | Highly durable with built-in redundancy across multiple locations | Data durability depends on the underlying file system and backup strategies |
| **Examples** | AWS EBS, Google Persistent Disks, SAN | AWS S3, Azure Blob Storage, Google Cloud Storage | Network Attached Storage (NAS), Shared Drives, Local File Systems |

---

**References**: 
- [File and Database Storage Systems in System Design](https://www.geeksforgeeks.org/system-design/file-and-database-storage-systems-in-system-design/)
- [Block, Object, and File Storage in System Design](https://www.geeksforgeeks.org/system-design/block-object-and-file-storage-in-cloud-with-difference/)

**Previous**: [SQL vs NoSQL Selection](2-sql-vs-nosql-selection.md) | **Next**: [Database Sharding](4-database-sharding.md)


# C / C++ — Use cases: cybersecurity and engineering

[← C/C++ README](./README.md)

This topic describes **where C and C++ appear** in **cybersecurity** and **general engineering**, and how the language’s features (pointers, memory model, speed) make it the right choice. Content is explained in text first; see **Further reading** for deeper links.

---

## Why C and C++ show up everywhere

C was designed for **system programming** and **produces code that runs nearly as fast as assembly**. It gives **direct control over memory and hardware**, so it is used wherever **performance**, **determinism**, or **portability** to many platforms matters. C++ keeps that performance and adds **abstractions** (classes, templates, STL), so it dominates in large, performance-critical applications. Together they cover **operating systems**, **compilers**, **drivers**, **embedded**, **browsers**, **games**, and **security-critical** code.

---

## Cybersecurity

| Use case | How C/C++ fits |
| --- | --- |
| **Reverse engineering and malware analysis** | Many malware samples and implants are compiled from C/C++. Disassemblers show assembly; understanding C’s memory layout, calling conventions, and pointer use helps you reason about what the binary does. |
| **Vulnerability research and exploit development** | Classic bugs (buffer overflows, use-after-free, integer overflows) are in C/C++ code. You need to read C, understand stack/heap layout, and know how compilers generate code to find and exploit them. |
| **Secure coding and auditing** | Auditing C/C++ for security (bounds checks, null checks, no use-after-free) requires fluency in the language and its pitfalls. Safe wrappers and static analysis tools assume you know the underlying model. |
| **Crypto and security libraries** | Many cryptographic and TLS implementations are in C (or C++) for speed and portability. Reviewing or integrating them requires C. |

**Key idea:** C’s **lack of automatic bounds checking** and **explicit memory management** are what make it fast and portable, but they also make mistakes (buffer overflows, dangling pointers) possible. Security work in C means understanding and defending against those failure modes.

---

## General engineering

| Use case | How C/C++ fits |
| --- | --- |
| **Operating systems and kernels** | UNIX, Linux, Windows kernels, and many RTOSes are written in C (and C++ where used). Boot code, drivers, and system calls are implemented in C. |
| **Compilers and runtimes** | Compilers (GCC, Clang, etc.) and language runtimes (e.g. CPython’s C core, JVMs) are largely C/C++. Understanding C helps when contributing or debugging toolchains. |
| **Embedded and real-time** | Microcontrollers, bare-metal firmware, and safety-critical systems (DO-178C, ISO 26262) use C (and sometimes C++) for deterministic timing and small footprint. |
| **Databases and storage** | Many databases and storage engines are C/C++ for performance and control over I/O and memory. |
| **Networking and infrastructure** | Stacks, proxies, and infrastructure tools (e.g. parts of Kubernetes, Envoy) are often C/C++. |
| **Games and high-performance apps** | Game engines and latency-sensitive applications are typically C++ for performance and reuse (STL, libraries). |

---

## Applications of C (summary from tutorials)

C is commonly used in:

- Operating systems  
- Language compilers  
- Assemblers  
- Text editors  
- Print spoolers  
- Network drivers  
- Modern programs (databases, interpreters, utilities)

All of these benefit from C’s **efficiency**, **portability**, and **direct hardware interaction**. C++ builds on this with **OOP** and **generic programming** for larger, more abstract systems (browsers, game engines, trading systems).

---

## C++ interview questions

C++ is one of the most common languages in technical interviews. Interviewers often ask about **basics**, **OOP**, **memory (new/delete, smart pointers, shallow vs deep copy)**, **STL**, **exceptions**, **templates**, and **design patterns**. Below are topic-wise categories and a selection of representative Q&As with short answers and code.

### Topic-wise interview question sets

| Topic | Coverage |
| --- | --- |
| [Basics & program structure](https://www.geeksforgeeks.org/interview-prep/c-fundamentals-interview-questions-1/) | Syntax, control flow, functions, program structure. |
| [Core concepts & memory handling](https://www.geeksforgeeks.org/cpp/c-core-concepts-memory-handling-interview-questions/) | Pointers, references, new/delete, shallow vs deep copy, virtual destructor, dangling pointers. |
| [OOP (OOPs)](https://www.geeksforgeeks.org/interview-prep/oops-interview-questions-c-programming/) | Classes, inheritance, polymorphism, encapsulation, abstraction. |
| [Exception handling & templates](https://www.geeksforgeeks.org/interview-prep/exception-handling-templates-interview-questions-c-programming/) | try/catch, throw, template syntax and instantiation. |
| [STL](https://www.geeksforgeeks.org/interview-prep/stl-standard-template-library-interview-questions-c-programming/) | Containers, iterators, algorithms. |
| [Advanced & design patterns](https://www.geeksforgeeks.org/interview-prep/advanced-topics-design-patterns-interview-questions-c-programming/) | Move semantics, lambdas, Singleton, Factory, Observer. |

### Representative Q&As (core and memory)

**1. How do you free memory allocated with `new`?**  
Use **delete** for a single object and **delete[]** for an array. Mismatching (e.g. `delete` for an array) is undefined behavior.

```cpp
int* p = new int(42);
delete p;

int* arr = new int[10];
delete[] arr;
```

**2. What is the difference between `new` and `malloc()`?**  
**new** is an operator, calls constructors, and returns the exact type. **malloc()** is a function, does not call constructors, and returns **void\***. In C++, prefer **new**/delete (or smart pointers) for objects.

**3. What happens if you return a pointer to a local variable?**  
The pointer becomes **dangling**: the local variable's lifetime ends when the function returns. Using that pointer is undefined behavior. Allocate on the heap (**new**) or return by value/reference instead.

**4. Shallow vs deep copy?**  
**Shallow copy** copies the pointer value; both pointers refer to the same memory. **Deep copy** allocates new memory and copies the contents. For resources (raw pointers, file handles), implement a deep copy in the copy constructor and assignment operator (or disable copying and use move/smart pointers).

**5. Why use `delete[]` for arrays?**  
**new[]** allocates an array; the runtime may store the element count. **delete[]** uses that to call destructors for each element and free the block. Using plain **delete** on an array typically only runs the first element's destructor and causes undefined behavior.

**6. Why should a base class destructor be virtual?**  
When you **delete** a derived object through a **base pointer**, the compiler calls the destructor of the static type (base). If the base destructor is not **virtual**, the derived destructor never runs → incomplete cleanup and potential leaks. Making the base destructor **virtual** ensures the derived destructor runs first, then the base.

**7. What is `mutable`?**  
A **mutable** data member can be modified inside **const** member functions. Use it for cached values, access counts, or other "physical" state that does not affect the logical const-ness of the object.

**8. How can pointer arithmetic lead to undefined behavior?**  
Incrementing or decrementing a pointer outside the bounds of the array it points into (including one past the end for certain operations) is undefined. Dereferencing such a pointer is also undefined. Always keep pointer arithmetic within the allocated range.

---

## C++ programming examples and use cases

Writing and reading C++ programs is a common way to learn and to prepare for interviews. **C++ programming examples** are often grouped by use case: from basic I/O and arithmetic to control flow, patterns, functions, arrays, strings, OOP, STL, file handling, and exceptions. These double as **practice use cases** and as a **curriculum** for self-study.

### Example categories

| Category | Use case / what you practice |
| --- | --- |
| **Basic C++** | Hello World, input/output, arithmetic, swap, sum, size of types, simple interest, temperature conversion. |
| **Control flow** | Calculator, factorial, Fibonacci, prime check, GCD/LCM, palindrome, power, leap year, largest of three. |
| **Pattern printing** | Loops and nested loops: pyramids, triangles, Floyd's triangle, Pascal's triangle, diamond. |
| **Functions** | Recursion (factorial, sum, power), variadic templates. |
| **Arrays** | Traversal, max/min, reverse, merge, remove duplicates, prefix sum, 2D arrays. |
| **Matrix** | Addition, multiplication, transpose, determinant, rotation. |
| **Pointers** | this, function pointers, array of pointers, void pointer, opaque pointer. |
| **Strings** | Length, compare, concat, reverse, palindrome, split, substring. |
| **Conversion** | Type conversion (int/char, string/double), decimal to binary/hex/octal. |
| **Structures** | Student struct, passing struct to/from functions, sorting by member. |
| **Class and object** | Complex numbers, operator overloading, singleton, abstract class, virtual destructor, friend, static, inheritance, polymorphism, encapsulation. |
| **STL** | vector, map, set, sort, binary_search, permutations, priority queue. |
| **Searching and sorting** | Linear search, binary search, sort ascending/descending. |
| **File handling** | Read/write file, append, copy, list directory. |
| **Exception handling** | Divide by zero, multiple catch, unreachable code, runtime errors. |
| **Miscellaneous** | Date/time, random numbers, quadratic roots, sizeof. |

Using these categories, you can target **use cases** such as "learn basics," "prepare for interviews," or "practice OOP/STL." For full lists and code, see the link below in **Further reading**.

---

## Summary table

| Domain | C / C++ role |
| --- | --- |
| **Cybersecurity** | RE, malware analysis, exploit dev, secure coding, crypto libs |
| **Systems** | OS kernels, drivers, boot, RTOS |
| **Toolchains** | Compilers, runtimes, debuggers |
| **Embedded / safety** | MCU, automotive, aerospace, industrial (DO-178C, ISO 26262) |
| **Infrastructure** | DBs, networking, storage |
| **Applications** | Browsers, games, HPC, trading |

Learning C (and then C++) gives you a **foundation** for both security work and systems/embedded engineering. The same language that powers most of the world’s infrastructure is also the one you will read when analyzing binaries and hunting bugs.

---

## Further reading

- [C++ Interview Questions and Answers (GeeksforGeeks)](https://www.geeksforgeeks.org/cpp/cpp-interview-questions/) — Topic-wise sets: Basics, Core & memory, OOP, STL, Exception/Templates, Advanced & design patterns.
- [C++ Programming Examples (GeeksforGeeks)](https://www.geeksforgeeks.org/cpp/cpp-programming-examples/) — Practice programs by category: basic, control flow, patterns, functions, arrays, strings, OOP, STL, file handling, exceptions.
- [C Programming Tutorial — Applications (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/index.htm)
- [C++ object-oriented programming](./13_C++_Object_Oriented_Programming.md) — Classes, inheritance, polymorphism (topic 13).
- [C/C++ README](./README.md) — Topic index.
- [Assembly — Where it shows up](../Assembly/3_Where_It_Shows_Up.md) — How assembly and C relate in low-level and security contexts.

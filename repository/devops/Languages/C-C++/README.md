# C / C++

[← Back to Languages](../README.md)

**Why in cybersecurity:** C and C++ underpin many **security-critical** codebases: OS kernels, browsers, crypto libraries, and exploit targets. **Buffer overflows**, **use-after-free**, and **integer issues** are often understood by reading C/C++ and disassembly. Reverse engineering, malware analysis, and secure coding all benefit from fluency in C and its memory model.

**Why in general engineering:** C was created for **system programming** and produces code that runs **nearly as fast as assembly**. It is used for **operating systems**, **compilers**, **assemblers**, **device drivers**, **embedded systems**, **networking**, **databases**, and **real-time** or **safety-critical** firmware. C++ extends C with **object-oriented** and **generic** programming and is dominant in game engines, browsers, and high-performance services. Both appear across aerospace, automotive, industrial, and systems software.

**What is C?** C is a **general-purpose, procedural, imperative** language developed in **1972** by Dennis Ritchie at Bell Labs to write UNIX. It is **compiled** to machine code, supports **direct memory access** via pointers, and has a small core with a standard library. It is standardized by ISO (C89/C90, C99, C11, C17, C23).

**What is C++?** C++ extends C with **classes**, **inheritance**, **templates**, **exceptions**, and the **STL**. It is **backward-compatible** with C for most C code. This section covers **C** (topics 1–12), **C++ OOP** (topic 13: classes, encapsulation, constructors/destructors, inheritance, polymorphism), **C++ templates, STL, exceptions, and more** (topic 14), then **use cases** (15) and **case studies** (16). Basics first; use cases and case studies last. Learning C first makes C++ and low-level reasoning easier.

**Format:** Each concept is explained in **text first**, then illustrated with a **code block** so you can write and reason about C in an easy, readable way. Content is standalone and descriptive; see **Further reading** in each topic and below.

**Coverage:** This section aligns with the **GeeksforGeeks C++** syllabus: C++ Basics (intro, data types, variables, operators, I/O, control flow, loops, functions, arrays) are covered in C topics 2–8 and in topic 14 (C++ I/O, new/delete, STL, etc.). Core concepts (pointers/references, new/delete, templates, structs/unions/enums, exceptions, file handling, multithreading, namespace), OOP (topic 13), STL (containers, iterators, algorithms in topic 14), and practice (interview questions, examples) are linked in **Further reading** in topic 14.

---

## Topics

| # | Topic | File |
| --- | --- | --- |
| 1 | What is C and C++? Why learn them? | [1_What_Is_C_And_C++.md](./1_What_Is_C_And_C++.md) |
| 2 | Environment setup and first program | [2_Environment_And_First_Program.md](./2_Environment_And_First_Program.md) |
| 3 | Basic syntax and program structure | [3_Basic_Syntax_And_Structure.md](./3_Basic_Syntax_And_Structure.md) |
| 4 | Data types, variables, and constants | [4_Data_Types_Variables_Constants.md](./4_Data_Types_Variables_Constants.md) |
| 5 | Operators and expressions | [5_Operators_And_Expressions.md](./5_Operators_And_Expressions.md) |
| 6 | Decision making and loops | [6_Control_Flow_Decision_And_Loops.md](./6_Control_Flow_Decision_And_Loops.md) |
| 7 | Functions | [7_Functions.md](./7_Functions.md) |
| 8 | Arrays and strings | [8_Arrays_And_Strings.md](./8_Arrays_And_Strings.md) |
| 9 | Pointers | [9_Pointers.md](./9_Pointers.md) |
| 10 | Memory, storage classes, and dynamic allocation | [10_Memory_Storage_And_Dynamic_Allocation.md](./10_Memory_Storage_And_Dynamic_Allocation.md) |
| 11 | Structures, unions, and typedef | [11_Structures_Unions_Typedef.md](./11_Structures_Unions_Typedef.md) |
| 12 | Preprocessor and file I/O | [12_Preprocessor_And_File_IO.md](./12_Preprocessor_And_File_IO.md) |
| 13 | C++ object-oriented programming | [13_C++_Object_Oriented_Programming.md](./13_C++_Object_Oriented_Programming.md) |
| 14 | C++ templates, STL, exceptions, and more | [14_C++_Templates_STL_Exceptions_And_More.md](./14_C++_Templates_STL_Exceptions_And_More.md) |
| 15 | Use cases: cybersecurity and engineering | [15_Use_Cases_Cybersecurity_And_Engineering.md](./15_Use_Cases_Cybersecurity_And_Engineering.md) |
| 16 | Case studies and hands-on examples | [16_Case_Studies.md](./16_Case_Studies.md) |

---

## Further reading

- [C Programming Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/cprogramming/index.htm) — Full C course; all chapter links merged into topics 1–12.
- [C++ Tutorial (TutorialsPoint)](https://www.tutorialspoint.com/cplusplus/index.htm) — C++ overview and OOP.
- [C reference (cppreference)](https://en.cppreference.com/w/c) — C standard library and language reference.
- [C++ reference (cppreference)](https://en.cppreference.com/) — C++ reference.
- [Online C Compiler (TutorialsPoint)](https://www.tutorialspoint.com/compilers/online-c-compiler.htm) — Write and run C in the browser.
- [Online C++ Compiler (TutorialsPoint)](https://www.tutorialspoint.com/compilers/online-cpp-compiler.htm) — Write and run C++ in the browser.

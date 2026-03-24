# Objective-C

[← Back to Languages](../README.md)

Objective-C extends **C** with **Smalltalk-style messaging**: you send **messages** to objects, and the **runtime** resolves which implementation runs. It was the dominant application language for **macOS** and **iOS** before **Swift**; major bodies of **framework**, **enterprise**, **plugin**, and **tooling** code still use it. Binaries link **libobjc** and **system frameworks**; builds use **clang** and **Xcode** like other native Apple stacks.

**What this section is for:** A path from **no prior Objective-C** through **advanced** material and **whole-engineering** practice: language concepts, **memory** and **runtime**, **concurrency**, **interop** with **Swift** and **C/C++**, **build and release**, **testing and observability**, **security** (signing, sandbox, hardening, analysis), and **migration**. Each chapter covers **what** the topic is, **why** it matters (including **operations** and **security**), and **how** to apply it. Prose is **standalone**—no “this comes from…” phrasing. Explanations are **text first**; **code** appears only where it clarifies behavior or tooling. Optional diagrams go under **`../../Assets/Languages/Objective-C/`** (see handbook **`Assets/README.md`**).

**Why it matters:** Apple **CI/CD** revolves around **Xcode**, **codesigning**, **notarization**, and **distribution**. **Incident response** and **application security** constantly encounter Objective-C in **stack traces**, **frameworks**, and **binary analysis**. Dependencies written in Objective-C are part of what you **compile**, **sign**, and **ship**—same supply-chain discipline as any native code.

**Where it fits:** Maintaining **legacy** apps, reading **SDKs**, **debugging** production, **hardening** or **reviewing** Apple-platform software, and **migrating** toward **Swift** without breaking **release trains**.

### Advanced depth, use cases, and implementation

Basics are not the whole story. Each chapter ends with material aimed at **production**: **where** the idea appears (extensions, daemons, SDKs, CI, incident response), **advanced** mechanics (runtime edges, secure coding, linking and signing), and **implementation** notes you would enforce in review or design. Look for the section **Advanced use cases and implementation** (or the chapter’s own “advanced” heading) before **References**—read the chapter’s numbered sections first; advanced sections assume that context.

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 1 | Introduction: platform, binary model, toolchain, first build | [01_Introduction_Platform_Binary_Model_Toolchain_And_First_Build.md](./01_Introduction_Platform_Binary_Model_Toolchain_And_First_Build.md) |
| 2 | Messaging, selectors, types, and Objective-C grammar | [02_Messaging_Selectors_Types_And_Objective_C_Grammar.md](./02_Messaging_Selectors_Types_And_Objective_C_Grammar.md) |
| 3 | Classes, properties, protocols, categories, OOP | [03_Classes_Properties_Protocols_Categories_And_Oop.md](./03_Classes_Properties_Protocols_Categories_And_Oop.md) |
| 4 | Memory: ARC, MRC literacy, Core Foundation bridging | [04_Memory_ARC_And_CoreFoundation_Bridging.md](./04_Memory_ARC_And_CoreFoundation_Bridging.md) |
| 5 | Runtime: dispatch, forwarding, swizzling, load order | [05_Runtime_Dispatch_Forwarding_And_Dynamic_Features.md](./05_Runtime_Dispatch_Forwarding_And_Dynamic_Features.md) |
| 6 | Foundation: collections, serialization, errors, logging | [06_Foundation_Collections_Serialization_Errors_And_Logging.md](./06_Foundation_Collections_Serialization_Errors_And_Logging.md) |
| 7 | Blocks, GCD, operation queues, concurrency pitfalls | [07_Blocks_GCD_And_Concurrency.md](./07_Blocks_GCD_And_Concurrency.md) |
| 8 | Swift interop, bridging headers, mixed targets | [08_Swift_Interop_Bridging_And_Mixed_Targets.md](./08_Swift_Interop_Bridging_And_Mixed_Targets.md) |
| 9 | Build: clang, modules, linking, rpath, dSYM, packaging | [09_Build_Clang_Linking_And_Release_Artifacts.md](./09_Build_Clang_Linking_And_Release_Artifacts.md) |
| 10 | Testing, debugging, sanitizers, observability | [10_Testing_Debugging_Sanitizers_And_Observability.md](./10_Testing_Debugging_Sanitizers_And_Observability.md) |
| 11 | Security: signing, sandbox, hardened runtime, RE lens | [11_Security_Signing_Sandbox_Hardening_And_Re.md](./11_Security_Signing_Sandbox_Hardening_And_Re.md) |
| 12 | Objective-C++, migration, Swift comparison, patterns | [12_Objective_C_Plus_Plus_Migration_Swift_Comparison_And_Patterns.md](./12_Objective_C_Plus_Plus_Migration_Swift_Comparison_And_Patterns.md) |

Read **1 → 12** in order unless you are jumping to a specific topic. **Everything you need to follow up in documentation is in each chapter’s `References` section**—no need to open anything else to read the handbook.

---

## References hub (optional)

**Optional convenience only:** A short list of Apple/Clang entry points and the external tutorial index for bookmarking. It does **not** replace per-chapter **References**; chapter files do **not** point here.

- **Apple (language & runtime):** [Programming with Objective-C](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Introduction/Introduction.html) · [Objective-C Runtime Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Introduction/Introduction.html) · [Objective-C](https://developer.apple.com/documentation/objectivec)
- **Clang / ARC:** [Clang documentation](https://clang.llvm.org/docs/) · [Automatic Reference Counting](https://clang.llvm.org/docs/AutomaticReferenceCounting.html)
- **Swift boundary:** [Importing Objective-C into Swift](https://developer.apple.com/documentation/swift/importing-objective-c-into-swift)
- **Tooling & distribution:** [Xcode](https://developer.apple.com/xcode/) · [Code Signing Guide](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/Introduction/Introduction.html) (Apple Archive)
- **Supplemental tutorial (full TOC):** [TutorialsPoint — Objective-C index](https://www.tutorialspoint.com/objective_c/index.htm) — browse from here; individual chapters cite the pages that match each lesson.

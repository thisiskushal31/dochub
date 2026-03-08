# C / C++ — C++ templates, STL, exceptions, and more

[← C/C++ README](./README.md)

This topic covers **C++ concepts** beyond core OOP: **templates**, **STL** (containers, iterators, algorithms), **exceptions**, **new/delete**, **file handling**, **multithreading**, **namespaces**, **function overloading**, **operator overloading**, **friend functions**, **lambda expressions**, **copy constructor**, **inline** and **default arguments**, **nullptr**, **std::string**, and **range-based for**. Topic 13 covered classes, inheritance, and polymorphism; here we add the rest. Each concept is explained in text first, then with a short code block.

**C++ basics (recap):** Data types, variables, operators, control flow, loops, functions, and arrays in C++ follow the same ideas as in C (topics 2–8). C++ adds: **bool** (and `<cstdbool>` or built-in), **references** (topic 13), **std::cin / std::cout** for I/O (see below), **new/delete** (below), and **std::string** (this topic). Pointers (topic 9) apply in C++; **new** and **delete** replace malloc/free for object allocation.

---

## Basic I/O in C++ (cin, cout)

In C++, **std::cin** and **std::cout** (from `<iostream>`) are used for keyboard input and console output. The stream operators **>>** and **<<** replace `scanf` and `printf`. Use **std::endl** or **'\\n'** for newline.

```cpp
#include <iostream>
#include <string>
int main() {
    int n;
    std::string s;
    std::cout << "Enter a number: ";
    std::cin >> n;
    std::cout << "Enter a word: ";
    std::cin >> s;
    std::cout << "You entered " << n << " and " << s << std::endl;
    return 0;
}
```

---

## new and delete (dynamic memory in C++)

In C++, **new** allocates memory for a single object or an array; **delete** (or **delete[]** for arrays) frees it. Unlike C’s malloc/free, **new** calls the constructor and **delete** calls the destructor. Prefer **smart pointers** (below) over raw new/delete when possible.

```cpp
#include <iostream>
int main() {
    int* p = new int(42);
    std::cout << *p << std::endl;
    delete p;

    int* arr = new int[5]{1, 2, 3, 4, 5};
    for (int i = 0; i < 5; i++) std::cout << arr[i] << " ";
    delete[] arr;
    return 0;
}
```

---

## Templates

**Templates** let you write generic code that works with any type. The compiler generates a concrete version for each type you use. **Function templates** and **class templates** are the main forms. They are the basis of the **STL** (containers and algorithms).

```cpp
#include <iostream>

template <typename T>
T max(T a, T b) {
   return (a > b) ? a : b;
}

template <typename T>
class Box {
   T value;
public:
   void set(T v) { value = v; }
   T get() const { return value; }
};

int main() {
   std::cout << max(3, 7) << std::endl;
   Box<int> b;
   b.set(42);
   return 0;
}
```

---

## STL (Standard Template Library)

The **STL** provides **containers**, **iterators**, and **algorithms**. You use them via `#include <vector>`, `<map>`, `<algorithm>`, etc. Prefer STL over hand-written loops and arrays when you need dynamic sizing or standard operations.

### STL Containers

**Containers** store data. Common ones: **vector** (dynamic array), **map** (key–value, ordered), **set** (unique keys, ordered), **list** (doubly linked list), **unordered_map** / **unordered_set** (hash-based). Each has a consistent interface (e.g. `size()`, `begin()`, `end()`).

```cpp
#include <vector>
#include <map>
#include <set>
#include <iostream>
int main() {
    std::vector<int> v = { 3, 1, 4, 1, 5 };
    std::map<std::string, int> m = { {"one", 1}, {"two", 2} };
    std::set<int> s(v.begin(), v.end());  // { 1, 3, 4, 5 }
    std::cout << v.size() << " " << m["one"] << " " << s.size() << std::endl;
    return 0;
}
```

### STL Iterators

**Iterators** let you traverse container elements. **begin()** and **end()** give the range; algorithms and range-based for use them. Iterators behave like pointers: `*it`, `++it`, `it != end()`.

```cpp
#include <vector>
#include <iostream>
int main() {
    std::vector<int> v = { 10, 20, 30 };
    for (auto it = v.begin(); it != v.end(); ++it)
        std::cout << *it << " ";
    std::cout << std::endl;
    return 0;
}
```

### STL Algorithms

The **algorithm** library (`<algorithm>`) provides **std::sort**, **std::find**, **std::count_if**, **std::reverse**, and many others. They work on ranges given by iterators.

```cpp
#include <vector>
#include <algorithm>
#include <iostream>
int main() {
    std::vector<int> v = { 3, 1, 4, 1, 5 };
    std::sort(v.begin(), v.end());
    auto it = std::find(v.begin(), v.end(), 4);
    int n = std::count_if(v.begin(), v.end(), [](int x) { return x >= 3; });
    std::cout << (it != v.end() ? "found" : "not found") << " count " << n << std::endl;
    return 0;
}
```

---

## Exceptions

**Exceptions** let you signal and handle errors across call stacks. You **throw** an value (often an exception object) and **catch** it in a caller. Use **try** / **catch**; optionally **catch (...)** for any exception. Destructors are still run during stack unwinding (RAII stays valid).

```cpp
#include <stdexcept>
#include <iostream>

void might_throw(bool fail) {
   if (fail) throw std::runtime_error("error");
}

int main() {
   try {
      might_throw(false);
      might_throw(true);
   } catch (const std::exception& e) {
      std::cout << e.what() << std::endl;
   }
   return 0;
}
```

---

## File handling in C++

C++ uses **std::ifstream** (read), **std::ofstream** (write), and **std::fstream** (read/write) from `<fstream>`. Open with **open()** or the constructor; check **is_open()**; use **>>** / **<<** or **getline()**; close with **close()** or when the object goes out of scope.

```cpp
#include <fstream>
#include <iostream>
#include <string>
int main() {
    std::ofstream out("file.txt");
    if (out.is_open()) {
        out << "Hello, C++ file I/O\n";
        out.close();
    }
    std::ifstream in("file.txt");
    std::string line;
    if (in.is_open()) {
        while (std::getline(in, line))
            std::cout << line << std::endl;
        in.close();
    }
    return 0;
}
```

---

## Multithreading in C++

C++11 introduced **std::thread** (from `<thread>`). Create a thread with a callable (function, lambda, or function object); use **join()** to wait for it to finish or **detach()** to let it run independently. Use **std::mutex** and **std::lock_guard** (from `<mutex>`) to protect shared data.

```cpp
#include <thread>
#include <iostream>
#include <mutex>
std::mutex mtx;
void say_hello(int id) {
    std::lock_guard<std::mutex> lock(mtx);
    std::cout << "Hello from thread " << id << std::endl;
}
int main() {
    std::thread t1(say_hello, 1);
    std::thread t2(say_hello, 2);
    t1.join();
    t2.join();
    return 0;
}
```

---

## Multiple and multilevel inheritance

C++ allows **multiple inheritance**: a class can inherit from more than one base. **Multilevel inheritance** is a chain (A → B → C). Multiple inheritance can lead to ambiguity (same name from two bases) or the **diamond problem**; **virtual inheritance** is used to share a single base subobject.

```cpp
class A { public: void f(); };
class B : public A {};
class C : public A {};
class D : public B, public C {};  // D has two A subobjects

class Bv : virtual public A {};
class Cv : virtual public A {};
class Dv : public Bv, public Cv {};  // Dv has one A subobject
```

---

## Structures, unions, and enumerations in C++

In C++, **struct**, **union**, and **enum** work like in C (topic 11), but **struct** and **union** can have **member functions**, **access specifiers**, and **constructors/destructors**. By default, **struct** members are **public** (unlike **class**, where they are private). **enum class** (scoped enumeration) is C++11 and avoids name clashes.

```cpp
#include <iostream>
struct Point {
    int x, y;
    void print() const { std::cout << "(" << x << "," << y << ")\n"; }
};
enum class Color { Red, Green, Blue };
int main() {
    Point p = { 1, 2 };
    p.print();
    Color c = Color::Red;
    return 0;
}
```

---

## Static members

A **static data member** is shared by all objects of the class; there is one copy. A **static member function** does not have a **this** pointer; it can access only static members. They are declared with **static** and defined (for data) outside the class.

```cpp
class Counter {
   static int count;
public:
   Counter() { count++; }
   static int get() { return count; }
};
int Counter::count = 0;
```

---

## Abstract classes and pure virtual functions

A **pure virtual** function has **= 0** and is not defined in the base. A class with at least one pure virtual function is **abstract**: you cannot create objects of it, only of derived classes that override all pure virtuals. Abstract classes define an **interface**.

```cpp
class Shape {
public:
   virtual double area() const = 0;  // pure virtual
};

class Circle : public Shape {
   double r;
public:
   Circle(double radius) : r(radius) {}
   double area() const override { return 3.14159 * r * r; }
};
```

---

## Virtual destructor

When you **delete** an object through a **base pointer**, the base destructor must be **virtual** so that the **derived** destructor runs. Otherwise you get undefined behavior (e.g. only the base destructor runs). If a class is meant to be used polymorphically (base pointer/reference), give the base a **virtual destructor**.

```cpp
class Base {
public:
   virtual ~Base() {}
};

class Derived : public Base {
public:
   ~Derived() override {}
};
```

---

## Smart pointers

**Smart pointers** manage ownership and avoid leaks and use-after-free. **std::unique_ptr** owns a single object; it cannot be copied. **std::shared_ptr** shares ownership with a reference count. Use them instead of raw **new** / **delete** when possible. **std::make_unique** and **std::make_shared** are preferred for creation.

```cpp
#include <memory>

int main() {
   auto p = std::make_unique<int>(42);
   std::shared_ptr<int> q = std::make_shared<int>(10);
   return 0;
}
```

---

## Namespaces

**Namespaces** group names to avoid collisions. **std** is the standard library namespace. You write **using namespace std;** to avoid prefixing **std::**, or qualify: **std::cout**. Define your own namespaces to keep global scope clean.

```cpp
#include <iostream>

namespace mylib {
   void f() {}
   int x = 0;
}

int main() {
   mylib::f();
   std::cout << mylib::x << std::endl;
   return 0;
}
```

---

## Function overloading

C++ allows **function overloading**: multiple functions with the **same name** but different **parameter lists** (number or types of parameters). The compiler chooses the right one from the arguments. This is a core C++ feature (not available in C).

```cpp
#include <iostream>

void print(int x) { std::cout << "int: " << x << std::endl; }
void print(double x) { std::cout << "double: " << x << std::endl; }
void print(const char* s) { std::cout << "str: " << s << std::endl; }

int main() {
   print(42);
   print(3.14);
   print("hello");
   return 0;
}
```

---

## Operator overloading

C++ lets you **overload** operators (e.g. `+`, `==`, `<<`) for your own types. You define a function with the name **operator** followed by the operator symbol. It can be a **member function** (one operand is `*this`) or a **non-member** (often **friend**) when you need both operands as parameters (e.g. symmetric `a + b`). Operator overloading is standard in C++ curricula and in real code (e.g. streams, complex numbers).

```cpp
#include <iostream>

class Vec2 {
public:
   int x, y;
   Vec2(int a, int b) : x(a), y(b) {}
   Vec2 operator+(const Vec2& o) const {
      return Vec2(x + o.x, y + o.y);
   }
};

int main() {
   Vec2 a(1, 2), b(3, 4);
   Vec2 c = a + b;
   std::cout << c.x << " " << c.y << std::endl;
   return 0;
}
```

---

## Friend functions

A **friend** function or class is allowed to access **private** and **protected** members of the class that declares it. Friends are declared inside the class with the **friend** keyword and defined outside. They are often used for **operator overloading** when the operator needs two operands (e.g. `operator+(a, b)`) or when a non-member needs direct access to internals.

```cpp
class Box {
   int value;
public:
   Box(int v) : value(v) {}
   friend int get_value(const Box& b);
};
int get_value(const Box& b) { return b.value; }
```

---

## Lambda expressions

**Lambdas** are anonymous function objects. Syntax: **`[capture](params) { body }`**. Capture can be **`[]`** (nothing), **`[=]`** (copy all), **`[&]`** (reference all), or list specific variables. Lambdas are used with STL algorithms, callbacks, and threading.

```cpp
#include <vector>
#include <algorithm>
#include <iostream>

int main() {
   std::vector<int> v = { 1, 2, 3, 4, 5 };
   int threshold = 3;
   std::count_if(v.begin(), v.end(), [threshold](int x) { return x > threshold; });
   for (int x : v) {
      auto f = [x]() { std::cout << x << " "; };
      f();
   }
   std::cout << std::endl;
   return 0;
}
```

---

## Copy constructor

The **copy constructor** creates an object from another object of the same type. It has the signature **`ClassName(const ClassName& other)`**. The compiler generates one by default (memberwise copy). Define your own when you need deep copy or when the default would be wrong (e.g. pointers, resources). Copy assignment **operator=** is similar; together with the destructor they form the **rule of three** (or five with move constructor/assignment).

```cpp
class Wrapper {
   int* ptr;
public:
   Wrapper(int n) : ptr(new int(n)) {}
   Wrapper(const Wrapper& other) : ptr(new int(*other.ptr)) {}
   ~Wrapper() { delete ptr; }
};
```

---

## Inline functions, default arguments, and nullptr

**Inline functions:** The **inline** keyword suggests the compiler replace calls with the function body (to reduce call overhead). The compiler may ignore it; header-only libraries use it for definitions in headers.

**Default arguments:** Parameters can have default values; callers can omit trailing arguments. Defaults are specified in the declaration (or definition if it is the first declaration).

```cpp
void f(int a, int b = 10);
f(5);     // b is 10
f(5, 20); // b is 20
```

**nullptr:** In C++, **nullptr** is the null pointer constant (replaces **NULL** or **0** for pointers). It has type **std::nullptr_t** and is preferred for clarity and overload resolution.

```cpp
int* p = nullptr;
if (p != nullptr) { /* use p */ }
```

---

## C++ strings and range-based for

**std::string** (from **&lt;string&gt;**) is the C++ string type: dynamic, no manual `'\0'` management, and supports operators like `+`, `==`, and `<<`. The **range-based for** loop (**`for (element : range)`**) iterates over every element in a range (e.g. a container or string).

```cpp
#include <string>
#include <iostream>

int main() {
   std::string s = "hello";
   s += " world";
   for (char c : s) std::cout << c;
   std::cout << std::endl;
   return 0;
}
```

---

## Further reading

**C++ (additional topics and practice):**
- [C++ Tutorial (GeeksforGeeks)](https://www.geeksforgeeks.org/cpp/c-plus-plus/) — Main index.
- [Introduction to C++](https://www.geeksforgeeks.org/cpp/cpp-programming-intro/) · [Data Types](https://www.geeksforgeeks.org/cpp/cpp-data-types/) · [Variables](https://www.geeksforgeeks.org/cpp/cpp-variables/) · [Operators](https://www.geeksforgeeks.org/cpp/operators-in-cpp/) · [Basic I/O](https://www.geeksforgeeks.org/cpp/basic-input-output-c/) · [Loops](https://www.geeksforgeeks.org/cpp/cpp-loops/) · [Functions](https://www.geeksforgeeks.org/cpp/functions-in-cpp/) · [Arrays](https://www.geeksforgeeks.org/cpp/cpp-arrays/).
- [Pointers and References in C++](https://www.geeksforgeeks.org/cpp/pointers-and-references-in-c/) · [new and delete](https://www.geeksforgeeks.org/cpp/new-and-delete-operators-in-cpp-for-dynamic-memory/) · [Templates](https://www.geeksforgeeks.org/cpp/templates-cpp/) · [Structures, Unions and Enumerations](https://www.geeksforgeeks.org/cpp/structures-unions-and-enumerations-in-cpp/) · [Exception Handling](https://www.geeksforgeeks.org/cpp/exception-handling-c/) · [File Handling](https://www.geeksforgeeks.org/cpp/file-handling-c-classes/) · [Multithreading](https://www.geeksforgeeks.org/cpp/multithreading-in-cpp/) · [Namespace](https://www.geeksforgeeks.org/cpp/namespace-in-c/).
- [STL](https://www.geeksforgeeks.org/cpp/the-c-standard-template-library-stl/) · [Containers](https://www.geeksforgeeks.org/cpp/containers-cpp-stl/) · [Iterators](https://www.geeksforgeeks.org/cpp/iterators-c-stl/) · [STL Algorithm Library](https://www.geeksforgeeks.org/cpp/c-magicians-stl-algorithms/).
- [C++ Interview Questions](https://www.geeksforgeeks.org/cpp/cpp-interview-questions/) · [C++ Programming Examples](https://www.geeksforgeeks.org/cpp/cpp-programming-examples/).

**TutorialsPoint:** [C++ Tutorial](https://www.tutorialspoint.com/cplusplus/index.htm) · [Templates](https://www.tutorialspoint.com/cplusplus/cpp_templates.htm) · [STL](https://www.tutorialspoint.com/cplusplus/cpp_stl_tutorial.htm) · [Exceptions](https://www.tutorialspoint.com/cplusplus/cpp_exceptions_handling.htm) · [Operator Overloading](https://www.tutorialspoint.com/cplusplus/cpp_overloading.htm) · [Friend Functions](https://www.tutorialspoint.com/cplusplus/cpp_friend_functions.htm) · [Lambda](https://www.tutorialspoint.com/cplusplus/cpp_lambda_expression.htm) · [Copy Constructor](https://www.tutorialspoint.com/cplusplus/cpp_copy_constructor.htm) · [Function Overloading](https://www.tutorialspoint.com/cplusplus/cpp_function_overloading.htm) · [Default Arguments](https://www.tutorialspoint.com/cplusplus/cpp_default_arguments.htm) · [Strings](https://www.tutorialspoint.com/cplusplus/cpp_strings.htm).

- [C++ reference (cppreference)](https://en.cppreference.com/)
- [C/C++ README](./README.md) — Topic index.

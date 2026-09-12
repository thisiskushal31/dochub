# Assembly — Recursion, file handling, and memory management

[← Assembly README](./README.md)

This topic covers **recursive procedures**, **file handling** (open, read, write, close, lseek) via Linux system calls, and **dynamic memory** with **sys_brk**. Same format: text first, then code. See **Further reading** for sources.

---

## Recursion

A **recursive procedure** calls itself (direct recursion) or calls another procedure that eventually calls it (indirect). You must have a **base case** that stops the recursion; otherwise the stack grows until it overflows.

**Example: factorial.** Fact(n) = n * Fact(n−1) for n > 0; Fact(0) = 1. In assembly: compare n with 1; if ≤ 1 return 1; else decrement n, call factorial, multiply result by original n and return.

```asm
proc_fact:
   cmp   bl, 1
   jg    do_calculation
   mov   ax, 1
   ret
do_calculation:
   dec   bl
   call  proc_fact
   inc   bl
   mul   bl        ; ax = al * bl
   ret
```

The **call** pushes the return address; each recursive call uses more stack. Registers (e.g. BL) that must survive the call are often saved on the stack or restored as in the example (dec bl before call, inc bl after).

---

## File streams and descriptors

Linux treats I/O as **streams of bytes**. The three standard streams have fixed **file descriptors**: **stdin = 0**, **stdout = 1**, **stderr = 2**. When you **open** or **create** a file, the kernel returns a **file descriptor** (small integer) used for subsequent read/write/close. A **file pointer** is the byte offset for the next read or write; it advances automatically and can be changed with **lseek**.

---

## File-handling system calls (int 0x80, 32-bit)

| EAX | Name | Typical arguments (EBX, ECX, EDX) |
| --- | --- | --- |
| 3 | sys_read | fd, buffer, count |
| 4 | sys_write | fd, buffer, count |
| 5 | sys_open | filename, flags, mode |
| 6 | sys_close | fd |
| 8 | sys_creat | filename, mode |
| 19 | sys_lseek | fd, offset, whence (0=start, 1=current, 2=end) |

**Create a file:** EAX=8 (sys_creat), EBX=filename, ECX=permissions (e.g. 0777). Returns fd in EAX.

**Open existing file:** EAX=5 (sys_open), EBX=filename, ECX=access mode (0=read, 1=write, 2=read+write), EDX=permissions. Returns fd in EAX.

**Read:** EAX=3, EBX=fd, ECX=buffer, EDX=count. Returns bytes read in EAX.

**Write:** EAX=4, EBX=fd, ECX=buffer, EDX=count. Returns bytes written in EAX.

**Close:** EAX=6, EBX=fd.

**Example (create file, write, close, reopen, read, print):**

```asm
; create
mov  eax, 8
mov  ebx, file_name
mov  ecx, 0777
int  0x80
mov  [fd_out], eax

; write
mov  edx, len
mov  ecx, msg
mov  ebx, [fd_out]
mov  eax, 4
int  0x80

; close
mov  eax, 6
mov  ebx, [fd_out]
int  0x80

; open for read
mov  eax, 5
mov  ebx, file_name
mov  ecx, 0
mov  edx, 0777
int  0x80
mov  [fd_in], eax

; read
mov  eax, 3
mov  ebx, [fd_in]
mov  ecx, info
mov  edx, 26
int  0x80

; close, then sys_write info to stdout
```

---

## Dynamic memory: sys_brk

**sys_brk** (EAX=45) sets the **program break**: the end of the process’s data segment. Passing 0 in EBX returns the current break in EAX. Passing a new address in EBX asks the kernel to set the break to that value (often current break + size). So you get “dynamic” space by: get current break (brk(0)), add desired size, call brk again with the new value; use the returned (or previous) address as your buffer. On error, EAX may hold a negative error code.

**Example (reserve 16 KB and use it):**

```asm
mov  eax, 45      ; sys_brk
xor  ebx, ebx     ; 0 = get current break
int  0x80
add  eax, 16384   ; +16KB
mov  ebx, eax
mov  eax, 45      ; sys_brk
int  0x80
cmp  eax, 0
jl   error
mov  edi, eax
sub  edi, 4
mov  ecx, 4096
xor  eax, eax
std
rep  stosd        ; fill with zeros (backward)
cld
```

---

## Further reading

- [Assembly Programming — Recursion (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_recursion.htm)
- [Assembly Programming — File Management (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_file_management.htm)
- [Assembly Programming — Memory Management (TutorialsPoint)](https://www.tutorialspoint.com/assembly_programming/assembly_memory_management.htm)
- [Assembly README](./README.md) — Topic index.

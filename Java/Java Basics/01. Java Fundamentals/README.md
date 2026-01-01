# 📝 Java Fundamentals - Quick Interview Notes

## ☕ Introduction to Java

**What is Java?**
- Object-oriented, platform-independent programming language
- Write Once, Run Anywhere (WORA)
- Created by James Gosling at Sun Microsystems (1995)

**Key Features:**
- **Platform Independent** - Bytecode runs on any JVM
- **Object-Oriented** - Everything is an object
- **Secure** - No explicit pointers, bytecode verification
- **Robust** - Strong memory management, exception handling
- **Multithreaded** - Built-in thread support
- **Architecture Neutral** - Bytecode not tied to architecture
- **Portable** - Same code runs everywhere
- **High Performance** - JIT compiler optimization

**Java Editions:**
- **Java SE** (Standard Edition) - Core Java
- **Java EE** (Enterprise Edition) - Web/enterprise apps
- **Java ME** (Micro Edition) - Mobile/embedded devices

---

## 🏗️ JDK, JRE, JVM Architecture

### JVM (Java Virtual Machine)
- **Abstract machine** that executes bytecode
- Platform-specific implementation
- Provides runtime environment

**JVM Components:**
1. **Class Loader** - Loads .class files
2. **Runtime Data Areas** - Memory areas
3. **Execution Engine** - Executes bytecode
4. **Native Method Interface** - Interface with native libraries

**Runtime Data Areas:**
- **Method Area** - Class metadata, static variables
- **Heap** - Objects and instance variables
- **Stack** - Method calls, local variables (per thread)
- **PC Register** - Current instruction address (per thread)
- **Native Method Stack** - Native method calls (per thread)

### JRE (Java Runtime Environment)
- JVM + Libraries + Other files
- Needed to **run** Java programs
- JRE = JVM + Core Libraries

### JDK (Java Development Kit)
- JRE + Development Tools
- Needed to **develop** Java programs
- JDK = JRE + Compiler (javac) + Debugger + Tools

**Relationship:**
```
JDK ⊃ JRE ⊃ JVM
```

**Compilation & Execution:**
```
.java → javac → .class → JVM → Platform-specific execution
Source   Compiler  Bytecode  Interpreter/JIT
```

---

## 📊 Data Types & Variables

### Primitive Data Types (8 types)

**Integer Types:**
- `byte` - 8 bits, -128 to 127
- `short` - 16 bits, -32,768 to 32,767
- `int` - 32 bits, -2³¹ to 2³¹-1 (default for integers)
- `long` - 64 bits, -2⁶³ to 2⁶³-1 (suffix: L)

**Floating-Point Types:**
- `float` - 32 bits, ~7 decimal digits (suffix: f)
- `double` - 64 bits, ~15 decimal digits (default for decimals)

**Other Types:**
- `char` - 16 bits, Unicode character (0 to 65,535)
- `boolean` - true or false

**Variable Types:**
1. **Local Variables** - Inside methods, no default value
2. **Instance Variables** - Inside class, default values assigned
3. **Static Variables** - Class variables, shared across instances

**Default Values:**
```java
int → 0
double → 0.0
boolean → false
char → '\u0000'
Object → null
```

**Type Conversion:**
- **Implicit (Widening)**: byte → short → int → long → float → double
- **Explicit (Narrowing)**: Requires casting, may lose data

---

## 🔧 Operators & Expressions

**Arithmetic Operators:** `+, -, *, /, %`

**Relational Operators:** `==, !=, >, <, >=, <=`

**Logical Operators:** `&&, ||, !`

**Bitwise Operators:** `&, |, ^, ~, <<, >>, >>>`

**Assignment Operators:** `=, +=, -=, *=, /=, %=`

**Unary Operators:** `++, --, +, -, !`

**Ternary Operator:** `condition ? value1 : value2`

**Operator Precedence (High to Low):**
1. Postfix: `expr++, expr--`
2. Unary: `++expr, --expr, +, -, !, ~`
3. Multiplicative: `*, /, %`
4. Additive: `+, -`
5. Shift: `<<, >>, >>>`
6. Relational: `<, >, <=, >=`
7. Equality: `==, !=`
8. Bitwise AND: `&`
9. Bitwise XOR: `^`
10. Bitwise OR: `|`
11. Logical AND: `&&`
12. Logical OR: `||`
13. Ternary: `?:`
14. Assignment: `=, +=, -=, etc.`

**Important:**
- `&&` and `||` are short-circuit operators
- `++i` (pre-increment) vs `i++` (post-increment)

---

## 🔀 Control Flow Statements

**if-else:**
```java
if (condition) {
    // code
} else if (condition2) {
    // code
} else {
    // code
}
```

**switch:**
```java
switch(expression) {
    case value1:
        // code
        break;
    case value2:
        // code
        break;
    default:
        // code
}
```

**Switch Enhancements (Java 12+):**
```java
// Switch expression
String result = switch(day) {
    case MONDAY, FRIDAY -> "Work";
    case SATURDAY, SUNDAY -> "Rest";
    default -> "Other";
};
```

**Important:**
- `break` exits switch/loop
- `continue` skips current iteration
- `return` exits method

---

## 🔁 Loops

**for loop:**
```java
for(initialization; condition; update) {
    // code
}
```

**Enhanced for loop (for-each):**
```java
for(Type element : collection) {
    // code
}
```

**while loop:**
```java
while(condition) {
    // code
}
```

**do-while loop:**
```java
do {
    // code
} while(condition);
```

**Key Differences:**
- `while` - Checks condition first
- `do-while` - Executes at least once
- `for` - When iterations known
- `for-each` - Iterate collections/arrays

**Loop Control:**
- `break` - Exit loop
- `continue` - Skip to next iteration
- `labeled break/continue` - Control nested loops

---

## 📚 Arrays

**Declaration:**
```java
int[] arr;              // Preferred
int arr[];              // Also valid
```

**Initialization:**
```java
int[] arr = new int[5];                    // Default values
int[] arr = {1, 2, 3, 4, 5};              // Direct initialization
int[] arr = new int[]{1, 2, 3, 4, 5};     // Anonymous array
```

**Multidimensional Arrays:**
```java
int[][] matrix = new int[3][4];            // 3x4 matrix
int[][] matrix = {{1,2}, {3,4}, {5,6}};   // Jagged arrays allowed
```

**Array Properties:**
- Fixed size (cannot grow/shrink)
- `.length` property for size
- Index starts at 0
- Throws `ArrayIndexOutOfBoundsException` if invalid index

**Arrays Class:**
```java
Arrays.sort(arr);                    // Sort
Arrays.binarySearch(arr, key);       // Binary search
Arrays.equals(arr1, arr2);          // Compare
Arrays.fill(arr, value);            // Fill with value
Arrays.copyOf(arr, newLength);      // Copy
Arrays.toString(arr);               // String representation
```

---

## 🔤 Strings

**String Characteristics:**
- **Immutable** - Cannot be changed once created
- Stored in **String Pool** (heap memory)
- Final class (cannot be extended)

**String Creation:**
```java
String s1 = "Hello";           // String literal (pool)
String s2 = new String("Hello"); // New object (heap)
```

**String Methods:**
```java
length()                    // Length of string
charAt(index)              // Character at index
substring(start, end)      // Extract substring
indexOf(str)               // Find index
contains(str)              // Check contains
equals(str)                // Compare content
equalsIgnoreCase(str)      // Compare ignoring case
compareTo(str)             // Lexicographic comparison
toLowerCase()              // Convert to lowercase
toUpperCase()              // Convert to uppercase
trim()                     // Remove whitespace
replace(old, new)          // Replace characters
split(regex)               // Split into array
concat(str)                // Concatenate
startsWith(str)            // Check prefix
endsWith(str)              // Check suffix
isEmpty()                  // Check if empty
```

**String vs StringBuilder vs StringBuffer:**
| Feature | String | StringBuilder | StringBuffer |
|---------|--------|---------------|--------------|
| Mutability | Immutable | Mutable | Mutable |
| Thread-Safe | Yes | No | Yes |
| Performance | Slow (concat) | Fast | Moderate |
| Use Case | Fixed text | Single thread | Multi-thread |

**String Pool:**
- String literals stored in pool
- Reuses strings to save memory
- `intern()` method adds to pool

---

## 📥 Input Output

**Console Input (Scanner):**
```java
Scanner sc = new Scanner(System.in);
int n = sc.nextInt();
double d = sc.nextDouble();
String s = sc.next();        // Single word
String line = sc.nextLine(); // Full line
```

**Console Output:**
```java
System.out.println(x);       // Print with newline
System.out.print(x);         // Print without newline
System.out.printf("%d", x);  // Formatted output
```

**BufferedReader (faster for large input):**
```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
String line = br.readLine();
int n = Integer.parseInt(line);
```

**Format Specifiers:**
- `%d` - Integer
- `%f` - Float/Double
- `%s` - String
- `%c` - Character
- `%b` - Boolean
- `%n` - Newline

---

## 🎯 Quick Interview Points

1. **Java is platform-independent?** - Yes, bytecode runs on any JVM
2. **JDK vs JRE vs JVM?** - JDK ⊃ JRE ⊃ JVM
3. **Primitive types count?** - 8 types
4. **Default value of int?** - 0
5. **String immutable?** - Yes, cannot be changed
6. **String pool?** - Memory area for string literals
7. **== vs equals() for Strings?** - == compares reference, equals() compares content
8. **StringBuilder vs StringBuffer?** - StringBuilder is faster but not thread-safe
9. **Array size fixed?** - Yes, cannot change after creation
10. **Switch on String?** - Yes, from Java 7+
11. **Enhanced for loop limitation?** - Cannot modify array, no index access
12. **break vs continue?** - break exits loop, continue skips iteration
13. **do-while executes?** - At least once
14. **Widening vs Narrowing?** - Widening is automatic, narrowing needs casting
15. **Default array values?** - 0 for int, null for objects, false for boolean

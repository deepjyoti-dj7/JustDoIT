# 📝 Exception Handling - Quick Interview Notes

## ⚠️ Exception Basics

**What is Exception?**
- Unwanted/unexpected event that disrupts normal program flow
- Object representing error condition

**Exception Hierarchy:**
```
Throwable
├── Error (Unchecked)
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── VirtualMachineError
└── Exception
    ├── RuntimeException (Unchecked)
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   ├── ArithmeticException
    │   └── ClassCastException
    └── Checked Exceptions
        ├── IOException
        ├── SQLException
        ├── ClassNotFoundException
        └── InterruptedException
```

**Types:**
1. **Checked Exception** - Compile-time, must handle
2. **Unchecked Exception** - Runtime, optional handling
3. **Error** - Serious problems, cannot handle

---

## 🔧 try-catch-finally

**Basic Syntax:**
```java
try {
    // Code that may throw exception
} catch (ExceptionType e) {
    // Handle exception
} finally {
    // Always executes (optional)
}
```

**Multiple Catch Blocks:**
```java
try {
    // code
} catch (ArithmeticException e) {
    // Handle arithmetic exception
} catch (NullPointerException e) {
    // Handle null pointer exception
} catch (Exception e) {
    // Handle any other exception (must be last)
}
```

**Multi-Catch (Java 7+):**
```java
try {
    // code
} catch (IOException | SQLException e) {
    // Handle multiple exceptions
}
```

**Finally Block:**
- Always executes (except System.exit())
- Used for cleanup (close resources)
```java
try {
    // code
} catch (Exception e) {
    // handle
} finally {
    // cleanup - always executes
}
```

**Return in try-catch-finally:**
```java
try {
    return 1;
} catch (Exception e) {
    return 2;
} finally {
    return 3;  // This will be returned (finally overrides)
}
```

**When finally doesn't execute:**
- `System.exit(0)`
- JVM crash
- Thread death

---

## 📊 Exception Hierarchy

**Throwable Class:**
- Root of exception hierarchy
- Two main branches: Error and Exception

**Error:**
- Serious problems outside application control
- Examples: OutOfMemoryError, StackOverflowError
- Should NOT be caught

**Exception:**
- **Checked Exceptions** - Must handle
  - IOException, SQLException, ClassNotFoundException
- **RuntimeException (Unchecked)** - Optional handling
  - NullPointerException, ArithmeticException, ArrayIndexOutOfBoundsException

**Common Exceptions:**
- `NullPointerException` - Null reference access
- `ArrayIndexOutOfBoundsException` - Invalid array index
- `ArithmeticException` - Division by zero
- `ClassCastException` - Invalid type casting
- `NumberFormatException` - Invalid string to number conversion
- `IllegalArgumentException` - Invalid method argument
- `IOException` - I/O operation failed
- `FileNotFoundException` - File not found
- `SQLException` - Database access error

---

## ✅ Checked vs Unchecked Exceptions

**Checked Exceptions:**
- Checked at **compile-time**
- Must handle using try-catch or throws
- Extend Exception class (not RuntimeException)
- Examples: IOException, SQLException, ClassNotFoundException

```java
// Must handle
void method() throws IOException {
    FileReader file = new FileReader("test.txt");  // Checked
}
```

**Unchecked Exceptions:**
- Checked at **runtime**
- No mandatory handling
- Extend RuntimeException
- Examples: NullPointerException, ArithmeticException

```java
// No mandatory handling
void method() {
    int result = 10 / 0;  // ArithmeticException - Unchecked
}
```

**Comparison:**
| Feature | Checked | Unchecked |
|---------|---------|-----------|
| **Check Time** | Compile-time | Runtime |
| **Handling** | Mandatory | Optional |
| **Extends** | Exception | RuntimeException |
| **Examples** | IOException | NullPointerException |
| **Purpose** | Recoverable errors | Programming bugs |

**Error:**
- Serious problems
- Should not be caught
- Examples: OutOfMemoryError, StackOverflowError

---

## 🚀 throw & throws

### throw Keyword
- Used to **explicitly throw** an exception
- Used with exception object

```java
void validate(int age) {
    if (age < 18) {
        throw new ArithmeticException("Not eligible");
    }
}
```

**Throw vs Throws:**
| throw | throws |
|-------|--------|
| Throws exception | Declares exception |
| Used inside method | Used in method signature |
| Followed by instance | Followed by class |
| Cannot throw multiple | Can declare multiple |

### throws Keyword
- Used to **declare** exceptions
- Informs caller that method may throw exception

```java
void method() throws IOException, SQLException {
    // May throw these exceptions
}
```

**Multiple Exceptions:**
```java
void method() throws IOException, SQLException, ClassNotFoundException {
    // code
}
```

**Throws in Overriding:**
```java
class Parent {
    void method() throws IOException { }
}

class Child extends Parent {
    // ✅ Can throw same or subclass
    void method() throws FileNotFoundException { }
    
    // ✅ Can throw less
    void method() { }
    
    // ❌ Cannot throw broader exception
    void method() throws Exception { }  // Error
}
```

---

## 🎨 Custom Exceptions

**Why Custom Exceptions?**
- Domain-specific error handling
- Better error messages
- Categorize errors

**Creating Custom Exception:**
```java
// Checked exception
class InsufficientBalanceException extends Exception {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}

// Unchecked exception
class InvalidAgeException extends RuntimeException {
    public InvalidAgeException(String message) {
        super(message);
    }
}
```

**Using Custom Exception:**
```java
class BankAccount {
    private double balance;
    
    void withdraw(double amount) throws InsufficientBalanceException {
        if (amount > balance) {
            throw new InsufficientBalanceException(
                "Insufficient balance: " + balance
            );
        }
        balance -= amount;
    }
}

// Usage
try {
    account.withdraw(5000);
} catch (InsufficientBalanceException e) {
    System.out.println(e.getMessage());
}
```

**Best Practices:**
- Extend Exception for checked
- Extend RuntimeException for unchecked
- Provide meaningful constructors
- Include descriptive messages

---

## 🔄 try-with-resources

**What is try-with-resources?**
- Automatic resource management (Java 7+)
- Resources automatically closed
- Must implement `AutoCloseable` or `Closeable`

**Syntax:**
```java
try (ResourceType resource = new ResourceType()) {
    // Use resource
} catch (Exception e) {
    // Handle exception
}
// Resource automatically closed
```

**Example:**
```java
// Old way (verbose)
BufferedReader br = null;
try {
    br = new BufferedReader(new FileReader("file.txt"));
    String line = br.readLine();
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (br != null) {
        try {
            br.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

// New way (clean)
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    String line = br.readLine();
} catch (IOException e) {
    e.printStackTrace();
}
```

**Multiple Resources:**
```java
try (
    FileReader fr = new FileReader("input.txt");
    BufferedReader br = new BufferedReader(fr)
) {
    // Use resources
}
```

**Benefits:**
- ✅ Automatic resource closing
- ✅ Cleaner code
- ✅ No resource leaks
- ✅ Less boilerplate

**Custom AutoCloseable:**
```java
class MyResource implements AutoCloseable {
    @Override
    public void close() {
        System.out.println("Resource closed");
    }
}

try (MyResource resource = new MyResource()) {
    // Use resource
}
```

---

## ✨ Best Practices

**1. Use Specific Exceptions:**
```java
// ❌ Bad
catch (Exception e) { }

// ✅ Good
catch (IOException e) { }
```

**2. Don't Ignore Exceptions:**
```java
// ❌ Bad
try {
    // code
} catch (Exception e) { }

// ✅ Good
catch (Exception e) {
    logger.error("Error occurred", e);
}
```

**3. Clean Up Resources:**
```java
// ✅ Use try-with-resources
try (FileReader fr = new FileReader("file.txt")) {
    // code
}
```

**4. Don't Catch Throwable:**
```java
// ❌ Bad - catches Error too
catch (Throwable t) { }

// ✅ Good
catch (Exception e) { }
```

**5. Use Custom Exceptions:**
```java
// ✅ Good - domain-specific
throw new InsufficientBalanceException("Low balance");
```

**6. Log Exceptions:**
```java
catch (Exception e) {
    logger.error("Error message", e);
    throw e;
}
```

**7. Don't Use Exceptions for Control Flow:**
```java
// ❌ Bad
try {
    while (true) {
        array[i++];
    }
} catch (ArrayIndexOutOfBoundsException e) { }

// ✅ Good
for (int i = 0; i < array.length; i++) {
    array[i];
}
```

**8. Throw Early, Catch Late:**
- Validate input early
- Handle exceptions at appropriate level

**9. Document Exceptions:**
```java
/**
 * @throws InsufficientBalanceException if balance is low
 */
void withdraw(double amount) throws InsufficientBalanceException {
    // code
}
```

**10. Order Catch Blocks (Specific to General):**
```java
try {
    // code
} catch (FileNotFoundException e) {  // Specific
    // handle
} catch (IOException e) {            // General
    // handle
} catch (Exception e) {              // Most general
    // handle
}
```

---

## 🎯 Quick Interview Points

1. **Exception vs Error?** - Exception: recoverable, Error: serious unrecoverable
2. **Checked vs Unchecked?** - Checked: compile-time, must handle. Unchecked: runtime, optional
3. **throw vs throws?** - throw: throws exception, throws: declares exception
4. **Finally always executes?** - Yes, except System.exit() or JVM crash
5. **Can we have try without catch?** - Yes, with finally or try-with-resources
6. **Multiple catch blocks?** - Yes, specific to general order
7. **Exception hierarchy root?** - Throwable
8. **RuntimeException examples?** - NullPointerException, ArithmeticException, ArrayIndexOutOfBoundsException
9. **Checked exception examples?** - IOException, SQLException, ClassNotFoundException
10. **try-with-resources?** - Automatic resource management (Java 7+)
11. **AutoCloseable interface?** - For try-with-resources
12. **Can finally have return?** - Yes, but overrides try/catch return
13. **Custom exception creation?** - Extend Exception (checked) or RuntimeException (unchecked)
14. **When to use checked exception?** - Recoverable conditions caller can handle
15. **When to use unchecked exception?** - Programming errors, bugs
16. **Can we rethrow exception?** - Yes, catch and throw again
17. **Catch order?** - Specific to general (child before parent)
18. **Exception chaining?** - Pass original exception as cause
19. **Multi-catch?** - Java 7+, catch multiple exceptions in one block
20. **Best practice for resources?** - Use try-with-resources

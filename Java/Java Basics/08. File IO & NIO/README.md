# 📝 File IO & NIO - Quick Interview Notes

## 📁 File Class

**What is File Class?**
- Represents file or directory pathname
- Abstract representation (not actual file)
- Package: `java.io.File`

**Creating File Object:**
```java
File file = new File("test.txt");
File file = new File("/path/to/file.txt");
File file = new File("parent", "child.txt");
File file = new File(parentFile, "child.txt");
```

**File Methods:**
```java
// Check existence and type
file.exists()
file.isFile()
file.isDirectory()
file.isHidden()
file.isAbsolute()

// File properties
file.getName()
file.getPath()
file.getAbsolutePath()
file.getParent()
file.length()          // Size in bytes
file.lastModified()    // Timestamp

// Permissions
file.canRead()
file.canWrite()
file.canExecute()
file.setReadable(boolean)
file.setWritable(boolean)
file.setExecutable(boolean)

// File operations
file.createNewFile()   // Create if not exists
file.delete()          // Delete file
file.renameTo(dest)    // Rename/move

// Directory operations
file.mkdir()           // Create directory
file.mkdirs()          // Create directory with parents
file.list()            // List files (String[])
file.listFiles()       // List files (File[])
```

---

## 📖 Reading Files

### 1. FileReader (Character Stream)
```java
FileReader fr = new FileReader("file.txt");
int ch;
while((ch = fr.read()) != -1) {
    System.out.print((char)ch);
}
fr.close();
```

### 2. BufferedReader (Efficient Reading)
```java
try (BufferedReader br = new BufferedReader(new FileReader("file.txt"))) {
    String line;
    while((line = br.readLine()) != null) {
        System.out.println(line);
    }
}
```

### 3. FileInputStream (Byte Stream)
```java
try (FileInputStream fis = new FileInputStream("file.txt")) {
    int data;
    while((data = fis.read()) != -1) {
        System.out.print((char)data);
    }
}
```

### 4. Scanner (Convenient Parsing)
```java
try (Scanner scanner = new Scanner(new File("file.txt"))) {
    while(scanner.hasNextLine()) {
        String line = scanner.nextLine();
        System.out.println(line);
    }
}
```

### 5. Files.readAllLines() (NIO - Java 7+)
```java
List<String> lines = Files.readAllLines(Paths.get("file.txt"));
```

### 6. Files.lines() (Stream API - Java 8+)
```java
try (Stream<String> lines = Files.lines(Paths.get("file.txt"))) {
    lines.forEach(System.out::println);
}
```

---

## ✍️ Writing Files

### 1. FileWriter (Character Stream)
```java
try (FileWriter fw = new FileWriter("file.txt")) {
    fw.write("Hello World");
}
```

### 2. BufferedWriter (Efficient Writing)
```java
try (BufferedWriter bw = new BufferedWriter(new FileWriter("file.txt"))) {
    bw.write("Line 1");
    bw.newLine();
    bw.write("Line 2");
}
```

### 3. FileOutputStream (Byte Stream)
```java
try (FileOutputStream fos = new FileOutputStream("file.txt")) {
    String data = "Hello World";
    fos.write(data.getBytes());
}
```

### 4. PrintWriter (Convenient Formatting)
```java
try (PrintWriter pw = new PrintWriter("file.txt")) {
    pw.println("Line 1");
    pw.println("Line 2");
    pw.printf("Number: %d", 42);
}
```

### 5. Files.write() (NIO - Java 7+)
```java
List<String> lines = Arrays.asList("Line 1", "Line 2");
Files.write(Paths.get("file.txt"), lines);

// Append
Files.write(Paths.get("file.txt"), lines, StandardOpenOption.APPEND);
```

---

## 🔄 BufferedReader & BufferedWriter

**Why Buffered Streams?**
- Faster I/O (reduces disk access)
- Reads/writes chunks instead of single characters
- Default buffer size: 8192 characters

**BufferedReader:**
```java
try (BufferedReader br = new BufferedReader(new FileReader("input.txt"))) {
    String line;
    while((line = br.readLine()) != null) {
        System.out.println(line);
    }
}
```

**BufferedReader Methods:**
- `read()` - Read single character
- `read(char[])` - Read into array
- `readLine()` - Read line (most used)
- `ready()` - Check if ready to read
- `skip(long)` - Skip characters
- `mark(int)` - Mark position
- `reset()` - Reset to mark

**BufferedWriter:**
```java
try (BufferedWriter bw = new BufferedWriter(new FileWriter("output.txt"))) {
    bw.write("Line 1");
    bw.newLine();
    bw.write("Line 2");
    bw.flush();  // Flush buffer
}
```

**BufferedWriter Methods:**
- `write(String)` - Write string
- `write(char[])` - Write char array
- `newLine()` - Write newline
- `flush()` - Force write
- `close()` - Close and flush

**Buffered vs Unbuffered:**
| Buffered | Unbuffered |
|----------|------------|
| Uses buffer | Direct I/O |
| Faster | Slower |
| Less disk access | More disk access |
| BufferedReader/Writer | FileReader/Writer |

---

## 🚀 NIO Files Class

**Files Class (java.nio.file.Files):**
- Utility class for file operations
- More features than File class
- Java 7+ (NIO.2)

**Reading Files:**
```java
// Read all lines
List<String> lines = Files.readAllLines(Paths.get("file.txt"));

// Read all bytes
byte[] bytes = Files.readAllBytes(Paths.get("file.txt"));

// Read as stream
try (Stream<String> lines = Files.lines(Paths.get("file.txt"))) {
    lines.forEach(System.out::println);
}

// Read with charset
List<String> lines = Files.readAllLines(
    Paths.get("file.txt"), 
    StandardCharsets.UTF_8
);
```

**Writing Files:**
```java
// Write lines
List<String> lines = Arrays.asList("Line 1", "Line 2");
Files.write(Paths.get("file.txt"), lines);

// Write bytes
byte[] bytes = "Hello".getBytes();
Files.write(Paths.get("file.txt"), bytes);

// Append
Files.write(
    Paths.get("file.txt"), 
    lines, 
    StandardOpenOption.APPEND
);
```

**File Operations:**
```java
// Copy
Files.copy(source, destination);
Files.copy(source, destination, StandardCopyOption.REPLACE_EXISTING);

// Move
Files.move(source, destination);

// Delete
Files.delete(path);
Files.deleteIfExists(path);

// Create
Files.createFile(path);
Files.createDirectory(path);
Files.createDirectories(path);  // With parents

// Check
Files.exists(path);
Files.notExists(path);
Files.isDirectory(path);
Files.isRegularFile(path);
Files.isReadable(path);
Files.isWritable(path);

// Attributes
long size = Files.size(path);
FileTime time = Files.getLastModifiedTime(path);
```

**List Directory:**
```java
// List files
try (Stream<Path> paths = Files.list(Paths.get("."))) {
    paths.forEach(System.out::println);
}

// Walk file tree
try (Stream<Path> paths = Files.walk(Paths.get("."))) {
    paths.filter(Files::isRegularFile)
         .forEach(System.out::println);
}
```

---

## 🛤️ Path & Paths

**Path Interface:**
- Represents file path
- Part of NIO.2 (Java 7+)

**Creating Path:**
```java
Path path = Paths.get("file.txt");
Path path = Paths.get("/path/to/file.txt");
Path path = Paths.get("folder", "subfolder", "file.txt");
Path path = Path.of("file.txt");  // Java 11+
```

**Path Methods:**
```java
path.getFileName()      // file.txt
path.getParent()        // Parent directory
path.getRoot()          // Root (C:\ or /)
path.toAbsolutePath()   // Absolute path
path.toRealPath()       // Resolve symlinks
path.normalize()        // Remove redundant elements
path.toFile()           // Convert to File

// Path manipulation
path.resolve("other.txt")       // Append path
path.resolveSibling("other.txt") // Sibling path
path.relativize(other)          // Relative path between
path.startsWith("/path")
path.endsWith("file.txt")
```

**Path vs File:**
| Path | File |
|------|------|
| Interface | Class |
| NIO.2 (Java 7+) | Legacy (Java 1.0) |
| More features | Limited features |
| Immutable | Mutable |
| Recommended | Legacy |

---

## 💾 Serialization

**What is Serialization?**
- Converting object to byte stream
- For storage or transmission
- Object → bytes → Object

**Serializable Interface:**
```java
import java.io.Serializable;

class Person implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private int age;
    // transient fields not serialized
    private transient String password;
}
```

**Serialization (Write):**
```java
try (ObjectOutputStream oos = new ObjectOutputStream(
        new FileOutputStream("person.ser"))) {
    Person person = new Person("John", 30);
    oos.writeObject(person);
}
```

**Deserialization (Read):**
```java
try (ObjectInputStream ois = new ObjectInputStream(
        new FileInputStream("person.ser"))) {
    Person person = (Person) ois.readObject();
    System.out.println(person.getName());
}
```

**serialVersionUID:**
- Unique identifier for class version
- Used for version compatibility
- If not defined, auto-generated (risky)

**transient Keyword:**
- Field not serialized
- Used for sensitive/derived data
```java
private transient String password;  // Not serialized
```

**static Fields:**
- Not serialized (belong to class, not object)

**Serialization Methods:**
```java
// Custom serialization
private void writeObject(ObjectOutputStream oos) throws IOException {
    oos.defaultWriteObject();
    // Custom write logic
}

private void readObject(ObjectInputStream ois) 
    throws IOException, ClassNotFoundException {
    ois.defaultReadObject();
    // Custom read logic
}
```

**Externalizable Interface:**
- More control over serialization
- Must implement readExternal() and writeExternal()

---

## 🎯 Quick Interview Points

1. **File class package?** - java.io.File
2. **Create file?** - file.createNewFile()
3. **Delete file?** - file.delete()
4. **Character stream classes?** - FileReader, FileWriter
5. **Byte stream classes?** - FileInputStream, FileOutputStream
6. **BufferedReader benefit?** - Faster I/O with buffering
7. **readLine() returns?** - null at end of file
8. **NIO package?** - java.nio.file
9. **Files vs File?** - Files is utility class (Java 7+), File is older class
10. **Path interface?** - Represents file path (NIO.2)
11. **Paths.get() vs Path.of()?** - Path.of() is Java 11+, both create Path
12. **Serialization?** - Converting object to byte stream
13. **Serializable interface?** - Marker interface for serialization
14. **serialVersionUID?** - Version identifier for class
15. **transient keyword?** - Field not serialized
16. **Are static fields serialized?** - No
17. **ObjectOutputStream?** - For writing objects
18. **ObjectInputStream?** - For reading objects
19. **try-with-resources?** - Auto-closes resources
20. **Files.lines() returns?** - Stream<String>
21. **Files.write() append?** - Use StandardOpenOption.APPEND
22. **Path.normalize()?** - Removes redundant elements like ../
23. **Path.relativize()?** - Creates relative path between paths
24. **Externalizable?** - For custom serialization control
25. **AutoCloseable?** - Interface for try-with-resources

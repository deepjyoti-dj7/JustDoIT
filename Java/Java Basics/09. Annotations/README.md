# 📝 Annotations - Quick Interview Notes

## 📌 Built-in Annotations

**What are Annotations?**
- Metadata about program elements
- Don't directly affect code execution
- Provide information to compiler/runtime/tools

**Common Built-in Annotations:**

### @Override
- Indicates method overrides superclass method
- Compiler checks if method actually overrides
```java
@Override
public String toString() {
    return "Custom string";
}
```

### @Deprecated
- Marks element as deprecated
- Compiler warning when used
```java
@Deprecated
public void oldMethod() {
    // Old implementation
}
```

### @SuppressWarnings
- Suppresses compiler warnings
```java
@SuppressWarnings("unchecked")
List list = new ArrayList();

@SuppressWarnings({"unchecked", "deprecation"})
void method() { }
```

**Common Warning Types:**
- `"unchecked"` - Unchecked operations
- `"deprecation"` - Deprecated API usage
- `"rawtypes"` - Raw types usage
- `"unused"` - Unused code
- `"all"` - All warnings

### @FunctionalInterface
- Indicates interface is functional (single abstract method)
- Compiler checks single abstract method rule
```java
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
}
```

### @SafeVarargs
- Suppresses warnings about varargs with generics
```java
@SafeVarargs
public static <T> void printAll(T... items) {
    for(T item : items) {
        System.out.println(item);
    }
}
```

---

## 🎨 Custom Annotations

**Creating Custom Annotation:**
```java
public @interface MyAnnotation {
    String value();
    int priority() default 0;
}
```

**Annotation Elements:**
```java
@interface Info {
    String author();
    String date();
    int version() default 1;
    String[] tags() default {};
}
```

**Using Custom Annotation:**
```java
@Info(
    author = "John",
    date = "2024-01-01",
    version = 2,
    tags = {"important", "reviewed"}
)
public class MyClass {
    // class code
}
```

**Element Types Allowed:**
- Primitive types
- String
- Class
- Enum
- Another annotation
- Arrays of above types

**Restrictions:**
- Cannot have parameters
- Cannot throw exceptions
- Cannot use generic types
- Return types must be one of allowed types

**Shorthand for value():**
```java
@interface Description {
    String value();
}

// Usage
@Description("This is a description")
class MyClass { }
```

---

## 🏷️ Meta-Annotations

**Meta-Annotations:**
- Annotations applied to other annotations
- Define annotation behavior

### @Target
- Specifies where annotation can be applied
```java
@Target(ElementType.METHOD)
public @interface MyMethodAnnotation {
    // Only applicable to methods
}

@Target({ElementType.TYPE, ElementType.FIELD})
public @interface MyAnnotation {
    // Applicable to classes and fields
}
```

**ElementType Values:**
- `TYPE` - Class, interface, enum
- `FIELD` - Field
- `METHOD` - Method
- `PARAMETER` - Method parameter
- `CONSTRUCTOR` - Constructor
- `LOCAL_VARIABLE` - Local variable
- `ANNOTATION_TYPE` - Annotation
- `PACKAGE` - Package
- `TYPE_PARAMETER` - Type parameter (Java 8+)
- `TYPE_USE` - Type use (Java 8+)

### @Retention
- Specifies how long annotation retained
```java
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
    // Available at runtime via reflection
}
```

**RetentionPolicy Values:**
- `SOURCE` - Discarded by compiler (e.g., @Override)
- `CLASS` - Recorded in class file, not available at runtime (default)
- `RUNTIME` - Available at runtime via reflection

### @Documented
- Annotation included in Javadoc
```java
@Documented
@interface MyAnnotation {
    // Will appear in generated documentation
}
```

### @Inherited
- Annotation inherited by subclasses
```java
@Inherited
@interface MyAnnotation { }

@MyAnnotation
class Parent { }

class Child extends Parent { }
// Child inherits @MyAnnotation
```

### @Repeatable (Java 8+)
- Allows same annotation multiple times
```java
@Repeatable(Schedules.class)
@interface Schedule {
    String day();
}

@interface Schedules {
    Schedule[] value();
}

// Usage
@Schedule(day = "Monday")
@Schedule(day = "Wednesday")
class MyClass { }
```

---

## ⚙️ Annotation Processing

**Reading Annotations at Runtime:**
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface Info {
    String author();
    int version();
}

@Info(author = "John", version = 1)
class MyClass { }

// Reading annotation
Class<?> clazz = MyClass.class;
if(clazz.isAnnotationPresent(Info.class)) {
    Info info = clazz.getAnnotation(Info.class);
    System.out.println("Author: " + info.author());
    System.out.println("Version: " + info.version());
}
```

**Reflection Methods:**
```java
// Check if annotation present
boolean present = element.isAnnotationPresent(Annotation.class);

// Get single annotation
Annotation ann = element.getAnnotation(Annotation.class);

// Get all annotations
Annotation[] anns = element.getAnnotations();

// Get declared annotations (excluding inherited)
Annotation[] anns = element.getDeclaredAnnotations();

// Get repeatable annotations (Java 8+)
Schedule[] schedules = clazz.getAnnotationsByType(Schedule.class);
```

**Processing Different Elements:**

**Class Annotations:**
```java
Class<?> clazz = MyClass.class;
Info info = clazz.getAnnotation(Info.class);
```

**Method Annotations:**
```java
Method method = clazz.getMethod("methodName");
MyAnnotation ann = method.getAnnotation(MyAnnotation.class);
```

**Field Annotations:**
```java
Field field = clazz.getDeclaredField("fieldName");
MyAnnotation ann = field.getAnnotation(MyAnnotation.class);
```

**Parameter Annotations:**
```java
Method method = clazz.getMethod("methodName", String.class);
Annotation[][] paramAnnotations = method.getParameterAnnotations();
```

**Common Use Cases:**
- Framework configuration (Spring, Hibernate)
- Code generation
- Validation
- Testing (JUnit)
- Dependency injection
- ORM mapping
- RESTful services

**Example - Simple Validator:**
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
@interface NotNull { }

class Validator {
    public static void validate(Object obj) throws Exception {
        Class<?> clazz = obj.getClass();
        for(Field field : clazz.getDeclaredFields()) {
            if(field.isAnnotationPresent(NotNull.class)) {
                field.setAccessible(true);
                if(field.get(obj) == null) {
                    throw new Exception(field.getName() + " is null");
                }
            }
        }
    }
}

class Person {
    @NotNull
    private String name;
    
    private Integer age;
}

// Usage
Person person = new Person();
Validator.validate(person);  // Throws exception if name is null
```

---

## 🎯 Quick Interview Points

1. **What are annotations?** - Metadata providing information to compiler/runtime/tools
2. **@Override purpose?** - Indicates method overrides superclass method, compiler checks
3. **@Deprecated purpose?** - Marks element as deprecated, generates compiler warning
4. **@SuppressWarnings types?** - "unchecked", "deprecation", "rawtypes", "unused"
5. **@FunctionalInterface?** - Marks interface as functional, ensures single abstract method
6. **Meta-annotation?** - Annotation applied to annotations
7. **@Target purpose?** - Specifies where annotation can be applied
8. **@Retention purpose?** - Specifies how long annotation is retained
9. **RetentionPolicy.SOURCE?** - Discarded by compiler
10. **RetentionPolicy.CLASS?** - In class file, not available at runtime (default)
11. **RetentionPolicy.RUNTIME?** - Available at runtime via reflection
12. **@Documented purpose?** - Include annotation in Javadoc
13. **@Inherited purpose?** - Annotation inherited by subclasses
14. **@Repeatable?** - Allows same annotation multiple times (Java 8+)
15. **Custom annotation syntax?** - public @interface AnnotationName { }
16. **Annotation element types?** - Primitives, String, Class, Enum, Annotation, Arrays
17. **Default element name?** - value() allows shorthand usage
18. **Read annotation at runtime?** - Use reflection with @Retention(RUNTIME)
19. **isAnnotationPresent()?** - Checks if annotation present on element
20. **getAnnotation()?** - Retrieves annotation from element
21. **Annotation processing use cases?** - Frameworks, validation, code generation, dependency injection
22. **Can annotations have parameters?** - No, they have elements
23. **Can annotations extend?** - No, all extend Annotation interface implicitly
24. **ElementType.TYPE?** - Class, interface, enum
25. **Marker annotation?** - Annotation with no elements (e.g., @Override)

# 📝 Reflection API - Quick Interview Notes

## 🔍 What is Reflection?

**Definition:**
- Ability to **inspect and modify** classes, methods, fields at runtime
- Access **metadata** about classes, interfaces, fields, methods
- Create objects, invoke methods, access fields **dynamically**

**Package:** `java.lang.reflect`

**Key Classes:**
- `Class<?>` - Represents a class
- `Method` - Represents a method
- `Field` - Represents a field
- `Constructor<?>` - Represents a constructor
- `Modifier` - Decode modifiers (public, static, etc.)
- `Array` - Dynamic array creation/manipulation
- `Proxy` - Dynamic proxy creation

**When to Use:**
- ✅ Frameworks (Spring, Hibernate)
- ✅ Testing frameworks (JUnit, Mockito)
- ✅ Serialization/Deserialization
- ✅ Dependency injection
- ✅ IDEs, debuggers
- ❌ Regular application code (performance overhead)

---

## 🎯 Class Object

**Getting Class Object:**
```java
// 1. Using .class syntax
Class<?> clazz1 = String.class;
Class<?> clazz2 = int.class;

// 2. Using getClass() method
String str = "Hello";
Class<?> clazz3 = str.getClass();

// 3. Using Class.forName()
Class<?> clazz4 = Class.forName("java.lang.String");

// 4. Using ClassLoader
ClassLoader loader = this.getClass().getClassLoader();
Class<?> clazz5 = loader.loadClass("com.example.MyClass");
```

**Class Object Methods:**
```java
Class<?> clazz = MyClass.class;

// Basic info
String name = clazz.getName();           // Full name: com.example.MyClass
String simpleName = clazz.getSimpleName(); // Simple name: MyClass
String packageName = clazz.getPackageName(); // com.example

// Modifiers
int modifiers = clazz.getModifiers();
boolean isPublic = Modifier.isPublic(modifiers);
boolean isFinal = Modifier.isFinal(modifiers);
boolean isAbstract = Modifier.isAbstract(modifiers);

// Type checks
boolean isInterface = clazz.isInterface();
boolean isEnum = clazz.isEnum();
boolean isAnnotation = clazz.isAnnotation();
boolean isArray = clazz.isArray();
boolean isPrimitive = clazz.isPrimitive();

// Hierarchy
Class<?> superClass = clazz.getSuperclass();
Class<?>[] interfaces = clazz.getInterfaces();

// Create instance
Object obj = clazz.newInstance();  // Deprecated in Java 9
Object obj2 = clazz.getDeclaredConstructor().newInstance();
```

---

## 🔎 Inspecting Classes

**Getting Fields:**
```java
Class<?> clazz = MyClass.class;

// Public fields only (including inherited)
Field[] publicFields = clazz.getFields();
Field field = clazz.getField("fieldName");

// All declared fields (not inherited)
Field[] allFields = clazz.getDeclaredFields();
Field declaredField = clazz.getDeclaredField("privateField");

// Field info
for(Field f : allFields) {
    String name = f.getName();
    Class<?> type = f.getType();
    int mod = f.getModifiers();
    
    System.out.println(Modifier.toString(mod) + " " + 
                       type.getSimpleName() + " " + name);
}
```

**Getting Methods:**
```java
// Public methods (including inherited)
Method[] publicMethods = clazz.getMethods();
Method method = clazz.getMethod("methodName", String.class, int.class);

// All declared methods (not inherited)
Method[] allMethods = clazz.getDeclaredMethods();
Method declaredMethod = clazz.getDeclaredMethod("privateMethod");

// Method info
for(Method m : allMethods) {
    String name = m.getName();
    Class<?> returnType = m.getReturnType();
    Class<?>[] paramTypes = m.getParameterTypes();
    Class<?>[] exceptions = m.getExceptionTypes();
    
    System.out.println(name + "(" + Arrays.toString(paramTypes) + ")");
}
```

**Getting Constructors:**
```java
// Public constructors
Constructor<?>[] constructors = clazz.getConstructors();
Constructor<?> constructor = clazz.getConstructor(String.class, int.class);

// All declared constructors
Constructor<?>[] allConstructors = clazz.getDeclaredConstructors();

// Constructor info
for(Constructor<?> c : allConstructors) {
    Class<?>[] paramTypes = c.getParameterTypes();
    System.out.println(Arrays.toString(paramTypes));
}
```

**Getting Annotations:**
```java
// Class annotations
Annotation[] annotations = clazz.getAnnotations();
MyAnnotation annotation = clazz.getAnnotation(MyAnnotation.class);
boolean hasAnnotation = clazz.isAnnotationPresent(MyAnnotation.class);

// Method annotations
Method method = clazz.getMethod("myMethod");
Annotation[] methodAnnotations = method.getAnnotations();

// Field annotations
Field field = clazz.getDeclaredField("myField");
Annotation[] fieldAnnotations = field.getAnnotations();
```

---

## ⚡ Invoking Methods

**Basic Method Invocation:**
```java
class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    private String secret() {
        return "Secret Message";
    }
}

// Public method
Calculator calc = new Calculator();
Method addMethod = Calculator.class.getMethod("add", int.class, int.class);
Object result = addMethod.invoke(calc, 5, 3);  // 8

// Private method
Method secretMethod = Calculator.class.getDeclaredMethod("secret");
secretMethod.setAccessible(true);  // Bypass access control
Object secret = secretMethod.invoke(calc);  // "Secret Message"
```

**Static Method Invocation:**
```java
class MathUtils {
    public static int multiply(int a, int b) {
        return a * b;
    }
}

Method multiplyMethod = MathUtils.class.getMethod("multiply", int.class, int.class);
Object result = multiplyMethod.invoke(null, 5, 3);  // null for static
```

**Varargs Method:**
```java
class Printer {
    public void print(String... messages) {
        for(String msg : messages) {
            System.out.println(msg);
        }
    }
}

Printer p = new Printer();
Method printMethod = Printer.class.getMethod("print", String[].class);
printMethod.invoke(p, (Object) new String[]{"A", "B", "C"});
```

---

## 📦 Accessing Fields

**Reading Fields:**
```java
class Person {
    public String name = "John";
    private int age = 30;
}

Person person = new Person();
Class<?> clazz = Person.class;

// Public field
Field nameField = clazz.getField("name");
String name = (String) nameField.get(person);  // "John"

// Private field
Field ageField = clazz.getDeclaredField("age");
ageField.setAccessible(true);
int age = (int) ageField.get(person);  // 30
```

**Writing Fields:**
```java
// Public field
nameField.set(person, "Jane");

// Private field
ageField.setAccessible(true);
ageField.set(person, 35);
```

**Static Fields:**
```java
class Constants {
    public static final String VERSION = "1.0";
    private static int count = 0;
}

// Read static field
Field versionField = Constants.class.getField("VERSION");
String version = (String) versionField.get(null);  // null for static

// Write static field
Field countField = Constants.class.getDeclaredField("count");
countField.setAccessible(true);
countField.set(null, 100);
```

**Field Types:**
```java
Field field = clazz.getDeclaredField("myField");

// Primitive types
if(field.getType().isPrimitive()) {
    int value = field.getInt(obj);
    field.setInt(obj, 42);
}

// Generic type
Type genericType = field.getGenericType();
if(genericType instanceof ParameterizedType) {
    ParameterizedType pt = (ParameterizedType) genericType;
    Type[] typeArgs = pt.getActualTypeArguments();
}
```

---

## 🎭 Dynamic Proxies

**What are Dynamic Proxies?**
- Create **proxy instances** at runtime
- **Intercept method calls** for logging, validation, etc.
- Implement interfaces dynamically

**Creating Proxy:**
```java
interface Calculator {
    int add(int a, int b);
    int multiply(int a, int b);
}

class CalculatorImpl implements Calculator {
    public int add(int a, int b) { return a + b; }
    public int multiply(int a, int b) { return a * b; }
}

// InvocationHandler
class LoggingHandler implements InvocationHandler {
    private final Object target;
    
    public LoggingHandler(Object target) {
        this.target = target;
    }
    
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) 
            throws Throwable {
        System.out.println("Before: " + method.getName());
        Object result = method.invoke(target, args);
        System.out.println("After: " + method.getName());
        return result;
    }
}

// Create proxy
Calculator realCalc = new CalculatorImpl();
Calculator proxy = (Calculator) Proxy.newProxyInstance(
    Calculator.class.getClassLoader(),
    new Class[] { Calculator.class },
    new LoggingHandler(realCalc)
);

proxy.add(5, 3);  // Logs before/after
```

**Use Cases:**
- **Logging** - Log method calls
- **Validation** - Validate parameters
- **Lazy loading** - Load data on demand
- **Transaction management** - Begin/commit transactions
- **Security** - Check permissions
- **Caching** - Cache results

---

## 🛠️ Practical Examples

### 1️⃣ Generic toString() using Reflection
```java
public static String reflectiveToString(Object obj) {
    if(obj == null) return "null";
    
    Class<?> clazz = obj.getClass();
    StringBuilder sb = new StringBuilder(clazz.getSimpleName() + "{");
    
    Field[] fields = clazz.getDeclaredFields();
    for(int i = 0; i < fields.length; i++) {
        fields[i].setAccessible(true);
        try {
            sb.append(fields[i].getName())
              .append("=")
              .append(fields[i].get(obj));
            if(i < fields.length - 1) sb.append(", ");
        } catch(IllegalAccessException e) {
            e.printStackTrace();
        }
    }
    sb.append("}");
    return sb.toString();
}
```

### 2️⃣ Copy Object Properties
```java
public static void copyProperties(Object source, Object target) 
        throws Exception {
    Class<?> sourceClass = source.getClass();
    Class<?> targetClass = target.getClass();
    
    for(Field sourceField : sourceClass.getDeclaredFields()) {
        sourceField.setAccessible(true);
        
        try {
            Field targetField = targetClass.getDeclaredField(sourceField.getName());
            targetField.setAccessible(true);
            
            if(sourceField.getType().equals(targetField.getType())) {
                Object value = sourceField.get(source);
                targetField.set(target, value);
            }
        } catch(NoSuchFieldException e) {
            // Field doesn't exist in target, skip
        }
    }
}
```

### 3️⃣ Simple Dependency Injection
```java
@Retention(RetentionPolicy.RUNTIME)
@interface Inject {}

class Container {
    private Map<Class<?>, Object> instances = new HashMap<>();
    
    public <T> void register(Class<T> clazz, T instance) {
        instances.put(clazz, instance);
    }
    
    public <T> T getInstance(Class<T> clazz) throws Exception {
        T instance = clazz.getDeclaredConstructor().newInstance();
        
        // Inject dependencies
        for(Field field : clazz.getDeclaredFields()) {
            if(field.isAnnotationPresent(Inject.class)) {
                field.setAccessible(true);
                Object dependency = instances.get(field.getType());
                if(dependency != null) {
                    field.set(instance, dependency);
                }
            }
        }
        return instance;
    }
}
```

---

## ⚠️ Reflection Pitfalls

**Performance:**
```java
// SLOW - Reflection
Method method = clazz.getMethod("getName");
String name = (String) method.invoke(obj);

// FAST - Direct call
String name = obj.getName();
```

**Security:**
```java
// Bypassing access control can break encapsulation
field.setAccessible(true);  // Use carefully!

// Security manager may prevent this
SecurityManager sm = System.getSecurityManager();
if(sm != null) {
    sm.checkPermission(new ReflectPermission("suppressAccessChecks"));
}
```

**Type Safety:**
```java
// No compile-time type checking
Object result = method.invoke(obj, args);  // Can throw exceptions at runtime

// Checked exceptions become RuntimeException
try {
    method.invoke(obj, args);
} catch(InvocationTargetException e) {
    // Actual exception wrapped in InvocationTargetException
    Throwable cause = e.getCause();
}
```

---

## 🎯 Quick Interview Points

1. **What is reflection?** - Ability to inspect/modify classes at runtime
2. **Reflection package?** - java.lang.reflect
3. **Get Class object?** - .class, getClass(), Class.forName()
4. **getFields() vs getDeclaredFields()?** - getFields: public (inherited), getDeclaredFields: all (not inherited)
5. **getMethods() vs getDeclaredMethods()?** - getMethods: public (inherited), getDeclaredMethods: all (not inherited)
6. **Access private members?** - field.setAccessible(true)
7. **Invoke method?** - method.invoke(object, args)
8. **Static method invoke?** - method.invoke(null, args)
9. **Create instance?** - clazz.getDeclaredConstructor().newInstance()
10. **Reflection performance?** - Slower than direct calls
11. **Dynamic proxy?** - Proxy.newProxyInstance() with InvocationHandler
12. **InvocationHandler interface?** - invoke(Object proxy, Method method, Object[] args)
13. **Reflection use cases?** - Frameworks, DI, testing, serialization
14. **Security concern?** - Can bypass access control
15. **Type safety?** - No compile-time checking
16. **Get annotations?** - getAnnotations(), getAnnotation(), isAnnotationPresent()
17. **Modifier class?** - Check modifiers (public, static, final, etc.)
18. **InvocationTargetException?** - Wraps exceptions thrown by invoked method
19. **Generic type at runtime?** - Type erasure, use getGenericType()
20. **Array reflection?** - Array.newInstance(), Array.get(), Array.set()
21. **Why avoid in regular code?** - Performance overhead, complexity, breaks encapsulation
22. **Primitive field access?** - getInt(), setInt(), getBoolean(), etc.
23. **Class.forName() use?** - Load class dynamically by name
24. **Proxy limitations?** - Only works with interfaces
25. **Reflection best practice?** - Cache Method/Field objects, use sparingly

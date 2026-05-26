export interface NavItem {
  title: string;
  href?: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    title: "System Design",
    href: "/system-design",
    children: [
      {
        title: "High Level Design",
        href: "/system-design/hld",
        children: [
          {
            title: "Fundamentals",
            children: [
              {
                title: "What is System Design",
                href: "/system-design/hld/fundamentals/what-is-system-design",
              },
              {
                title: "Requirements Gathering",
                href: "/system-design/hld/fundamentals/requirements-gathering",
              },
              {
                title: "Back-of-Envelope Calculations",
                href: "/system-design/hld/fundamentals/back-of-envelope",
              },
              {
                title: "Estimation Techniques",
                href: "/system-design/hld/fundamentals/estimation-techniques",
              },
              {
                title: "Non-Functional Requirements",
                href: "/system-design/hld/fundamentals/non-functional-requirements",
              },
            ],
          },
          {
            title: "Core Concepts",
            children: [
              {
                title: "CAP Theorem",
                href: "/system-design/hld/core-concepts/cap-theorem",
              },
              {
                title: "ACID Properties",
                href: "/system-design/hld/core-concepts/acid-properties",
              },
              {
                title: "BASE Properties",
                href: "/system-design/hld/core-concepts/base-properties",
              },
              {
                title: "Consistency Models",
                href: "/system-design/hld/core-concepts/consistency-models",
              },
              {
                title: "Consensus Algorithms",
                href: "/system-design/hld/core-concepts/consensus-algorithms",
              },
              {
                title: "Consistent Hashing",
                href: "/system-design/hld/core-concepts/consistent-hashing",
              },
              {
                title: "Bloom Filters",
                href: "/system-design/hld/core-concepts/bloom-filters",
              },
              {
                title: "Quorum",
                href: "/system-design/hld/core-concepts/quorum",
              },
              {
                title: "Gossip Protocol",
                href: "/system-design/hld/core-concepts/gossip-protocol",
              },
            ],
          },
          {
            title: "System Components",
            children: [
              {
                title: "Client Layer",
                href: "/system-design/hld/system-components/client-layer",
              },
              {
                title: "DNS",
                href: "/system-design/hld/system-components/dns",
              },
              {
                title: "CDN",
                href: "/system-design/hld/system-components/cdn",
              },
              {
                title: "Load Balancer",
                href: "/system-design/hld/system-components/load-balancer",
              },
              {
                title: "API Gateway",
                href: "/system-design/hld/system-components/api-gateway",
              },
              {
                title: "Reverse Proxy",
                href: "/system-design/hld/system-components/reverse-proxy",
              },
              {
                title: "Application Servers",
                href: "/system-design/hld/system-components/application-servers",
              },
              {
                title: "Service Discovery",
                href: "/system-design/hld/system-components/service-discovery",
              },
            ],
          },
          {
            title: "Networking",
            children: [
              {
                title: "OSI Model",
                href: "/system-design/hld/networking/osi-model",
              },
              {
                title: "IP Addresses",
                href: "/system-design/hld/networking/ip-addresses",
              },
              {
                title: "HTTP / HTTPS",
                href: "/system-design/hld/networking/http-https",
              },
              {
                title: "TCP vs UDP",
                href: "/system-design/hld/networking/tcp-vs-udp",
              },
              {
                title: "Checksums",
                href: "/system-design/hld/networking/checksums",
              },
            ],
          },
          {
            title: "Data Layer",
            children: [
              {
                title: "Database Types",
                href: "/system-design/hld/data-layer/database-types",
              },
              {
                title: "SQL Databases",
                href: "/system-design/hld/data-layer/sql-databases",
              },
              {
                title: "NoSQL Databases",
                href: "/system-design/hld/data-layer/nosql-databases",
              },
              {
                title: "Database Indexing",
                href: "/system-design/hld/data-layer/database-indexing",
              },
              {
                title: "Database Sharding",
                href: "/system-design/hld/data-layer/database-sharding",
              },
              {
                title: "Database Replication",
                href: "/system-design/hld/data-layer/database-replication",
              },
              {
                title: "Database Partitioning",
                href: "/system-design/hld/data-layer/database-partitioning",
              },
              {
                title: "Data Warehousing",
                href: "/system-design/hld/data-layer/data-warehousing",
              },
              {
                title: "Object Storage",
                href: "/system-design/hld/data-layer/object-storage",
              },
              {
                title: "Distributed Locking",
                href: "/system-design/hld/data-layer/distributed-locking",
              },
              {
                title: "Database Architectures",
                href: "/system-design/hld/data-layer/database-architectures",
              },
            ],
          },
          {
            title: "Communication",
            children: [
              { title: "APIs", href: "/system-design/hld/communication/apis" },
              {
                title: "API Design",
                href: "/system-design/hld/communication/api-design",
              },
              {
                title: "REST API",
                href: "/system-design/hld/communication/rest-api",
              },
              {
                title: "GraphQL",
                href: "/system-design/hld/communication/graphql",
              },
              { title: "gRPC", href: "/system-design/hld/communication/grpc" },
              {
                title: "WebSockets",
                href: "/system-design/hld/communication/websockets",
              },
              {
                title: "Server-Sent Events",
                href: "/system-design/hld/communication/server-sent-events",
              },
              {
                title: "Message Queues",
                href: "/system-design/hld/communication/message-queues",
              },
              {
                title: "Pub-Sub Systems",
                href: "/system-design/hld/communication/pub-sub-systems",
              },
              {
                title: "Event Streaming",
                href: "/system-design/hld/communication/event-streaming",
              },
              {
                title: "Webhooks",
                href: "/system-design/hld/communication/webhooks",
              },
              {
                title: "Idempotency",
                href: "/system-design/hld/communication/idempotency",
              },
              {
                title: "Change Data Capture (CDC)",
                href: "/system-design/hld/communication/change-data-capture",
              },
            ],
          },
          {
            title: "Architectural Patterns",
            children: [
              {
                title: "Client-Server Architecture",
                href: "/system-design/hld/architectural-patterns/client-server",
              },
              {
                title: "Monolithic",
                href: "/system-design/hld/architectural-patterns/monolithic",
              },
              {
                title: "Microservices",
                href: "/system-design/hld/architectural-patterns/microservices",
              },
              {
                title: "Service-Oriented (SOA)",
                href: "/system-design/hld/architectural-patterns/service-oriented",
              },
              {
                title: "Event-Driven",
                href: "/system-design/hld/architectural-patterns/event-driven",
              },
              {
                title: "Serverless",
                href: "/system-design/hld/architectural-patterns/serverless",
              },
              {
                title: "Peer-to-Peer",
                href: "/system-design/hld/architectural-patterns/peer-to-peer",
              },
              {
                title: "Lambda Architecture",
                href: "/system-design/hld/architectural-patterns/lambda-architecture",
              },
              {
                title: "Hexagonal Architecture",
                href: "/system-design/hld/architectural-patterns/hexagonal-architecture",
              },
            ],
          },
          {
            title: "Scalability & Performance",
            children: [
              {
                title: "Horizontal vs Vertical Scaling",
                href: "/system-design/hld/scalability-performance/horizontal-vs-vertical-scaling",
              },
              {
                title: "Caching 101",
                href: "/system-design/hld/scalability-performance/caching-101",
              },
              {
                title: "Caching Strategies",
                href: "/system-design/hld/scalability-performance/caching-strategies",
              },
              {
                title: "Cache Eviction Policies",
                href: "/system-design/hld/scalability-performance/cache-eviction-policies",
              },
              {
                title: "Distributed Caching",
                href: "/system-design/hld/scalability-performance/distributed-caching",
              },
              {
                title: "Rate Limiting",
                href: "/system-design/hld/scalability-performance/rate-limiting",
              },
              {
                title: "Throttling",
                href: "/system-design/hld/scalability-performance/throttling",
              },
              {
                title: "Performance Metrics",
                href: "/system-design/hld/scalability-performance/performance-metrics",
              },
              {
                title: "Latency Optimization",
                href: "/system-design/hld/scalability-performance/latency-optimization",
              },
              {
                title: "Throughput Optimization",
                href: "/system-design/hld/scalability-performance/throughput-optimization",
              },
            ],
          },
          {
            title: "Reliability & Resilience",
            children: [
              {
                title: "Availability",
                href: "/system-design/hld/reliability-resilience/availability",
              },
              {
                title: "Fault Tolerance",
                href: "/system-design/hld/reliability-resilience/fault-tolerance",
              },
              {
                title: "SPOF",
                href: "/system-design/hld/reliability-resilience/spof",
              },
              {
                title: "Heartbeats",
                href: "/system-design/hld/reliability-resilience/heartbeats",
              },
              {
                title: "Redundancy",
                href: "/system-design/hld/reliability-resilience/redundancy",
              },
              {
                title: "Failover Mechanisms",
                href: "/system-design/hld/reliability-resilience/failover-mechanisms",
              },
              {
                title: "Disaster Recovery",
                href: "/system-design/hld/reliability-resilience/disaster-recovery",
              },
              {
                title: "Circuit Breaker",
                href: "/system-design/hld/reliability-resilience/circuit-breaker",
              },
              {
                title: "Retry & Backoff",
                href: "/system-design/hld/reliability-resilience/retry-backoff",
              },
              {
                title: "Health Checks",
                href: "/system-design/hld/reliability-resilience/health-checks",
              },
              {
                title: "Monitoring & Alerting",
                href: "/system-design/hld/reliability-resilience/monitoring-alerting",
              },
              {
                title: "Distributed Tracing",
                href: "/system-design/hld/reliability-resilience/distributed-tracing",
              },
            ],
          },
          {
            title: "Security",
            children: [
              {
                title: "Authentication",
                href: "/system-design/hld/security/authentication",
              },
              {
                title: "Authorization",
                href: "/system-design/hld/security/authorization",
              },
              {
                title: "OAuth & SSO",
                href: "/system-design/hld/security/oauth-sso",
              },
              {
                title: "JWT Tokens",
                href: "/system-design/hld/security/jwt-tokens",
              },
              {
                title: "Encryption",
                href: "/system-design/hld/security/encryption",
              },
              {
                title: "HTTPS & TLS",
                href: "/system-design/hld/security/https-tls",
              },
              {
                title: "DDoS Protection",
                href: "/system-design/hld/security/ddos-protection",
              },
              {
                title: "API Security",
                href: "/system-design/hld/security/api-security",
              },
            ],
          },
          {
            title: "Design Tradeoffs",
            children: [
              {
                title: "Top 15 Tradeoffs",
                href: "/system-design/hld/design-tradeoffs/top-15-tradeoffs",
              },
              {
                title: "Consistency vs Availability",
                href: "/system-design/hld/design-tradeoffs/consistency-vs-availability",
              },
              {
                title: "Latency vs Throughput",
                href: "/system-design/hld/design-tradeoffs/latency-vs-throughput",
              },
              {
                title: "SQL vs NoSQL",
                href: "/system-design/hld/design-tradeoffs/sql-vs-nosql",
              },
              {
                title: "Sync vs Async",
                href: "/system-design/hld/design-tradeoffs/sync-vs-async",
              },
              {
                title: "Stateful vs Stateless",
                href: "/system-design/hld/design-tradeoffs/stateful-vs-stateless",
              },
              {
                title: "Push vs Pull",
                href: "/system-design/hld/design-tradeoffs/push-vs-pull",
              },
              {
                title: "Batch vs Stream Processing",
                href: "/system-design/hld/design-tradeoffs/batch-vs-stream",
              },
              {
                title: "Normalization vs Denormalization",
                href: "/system-design/hld/design-tradeoffs/normalization-vs-denormalization",
              },
              {
                title: "REST vs gRPC",
                href: "/system-design/hld/design-tradeoffs/rest-vs-grpc",
              },
              {
                title: "REST vs GraphQL",
                href: "/system-design/hld/design-tradeoffs/rest-vs-graphql",
              },
              {
                title: "Long Polling vs WebSockets",
                href: "/system-design/hld/design-tradeoffs/long-polling-vs-websockets",
              },
              {
                title: "Concurrency vs Parallelism",
                href: "/system-design/hld/design-tradeoffs/concurrency-vs-parallelism",
              },
              {
                title: "Read-Through vs Write-Through Cache",
                href: "/system-design/hld/design-tradeoffs/read-through-vs-write-through",
              },
            ],
          },
          {
            title: "Real-World Systems",
            children: [
              {
                title: "Beginner",
                children: [
                  {
                    title: "URL Shortener / TinyURL",
                    href: "/system-design/hld/real-world-systems/url-shortener-tinyurl",
                  },
                  {
                    title: "Autocomplete Search",
                    href: "/system-design/hld/real-world-systems/autocomplete-search",
                  },
                  {
                    title: "Load Balancer",
                    href: "/system-design/hld/real-world-systems/load-balancer",
                  },
                  {
                    title: "CDN",
                    href: "/system-design/hld/real-world-systems/cdn",
                  },
                  {
                    title: "Parking Lot",
                    href: "/system-design/hld/real-world-systems/parking-lot",
                  },
                  {
                    title: "UPI",
                    href: "/system-design/hld/real-world-systems/upi",
                  },
                  {
                    title: "Vending Machine",
                    href: "/system-design/hld/real-world-systems/vending-machine",
                  },
                  {
                    title: "Distributed Key-Value Store",
                    href: "/system-design/hld/real-world-systems/distributed-key-value-store",
                  },
                  {
                    title: "Distributed Cache",
                    href: "/system-design/hld/real-world-systems/distributed-cache",
                  },
                  {
                    title: "Authentication System",
                    href: "/system-design/hld/real-world-systems/authentication-system",
                  },
                ],
              },
              {
                title: "Intermediate",
                children: [
                  {
                    title: "Design WhatsApp",
                    href: "/system-design/hld/real-world-systems/whatsapp",
                  },
                  {
                    title: "Design Instagram",
                    href: "/system-design/hld/real-world-systems/instagram",
                  },
                  {
                    title: "Design Spotify",
                    href: "/system-design/hld/real-world-systems/spotify",
                  },
                  {
                    title: "Notification Service",
                    href: "/system-design/hld/real-world-systems/notification-service",
                  },
                  {
                    title: "Distributed Job Scheduler",
                    href: "/system-design/hld/real-world-systems/distributed-job-scheduler",
                  },
                  {
                    title: "Tinder / Hinge",
                    href: "/system-design/hld/real-world-systems/tinder-hinge",
                  },
                  {
                    title: "Design Facebook",
                    href: "/system-design/hld/real-world-systems/facebook",
                  },
                  {
                    title: "Design Twitter",
                    href: "/system-design/hld/real-world-systems/twitter",
                  },
                  {
                    title: "Design Discord",
                    href: "/system-design/hld/real-world-systems/discord",
                  },
                  {
                    title: "Design Reddit",
                    href: "/system-design/hld/real-world-systems/reddit",
                  },
                  {
                    title: "Design Netflix",
                    href: "/system-design/hld/real-world-systems/netflix",
                  },
                  {
                    title: "Design YouTube",
                    href: "/system-design/hld/real-world-systems/youtube",
                  },
                  {
                    title: "Design Google Search",
                    href: "/system-design/hld/real-world-systems/google-search",
                  },
                  {
                    title: "Amazon / Flipkart",
                    href: "/system-design/hld/real-world-systems/amazon-flipkart",
                  },
                  {
                    title: "Design TikTok",
                    href: "/system-design/hld/real-world-systems/tiktok",
                  },
                  {
                    title: "Design Shopify",
                    href: "/system-design/hld/real-world-systems/shopify",
                  },
                  {
                    title: "Design Airbnb",
                    href: "/system-design/hld/real-world-systems/airbnb",
                  },
                  {
                    title: "Rate Limiter",
                    href: "/system-design/hld/real-world-systems/rate-limiter",
                  },
                  {
                    title: "Distributed Message Queue / Kafka",
                    href: "/system-design/hld/real-world-systems/distributed-message-queue-kafka",
                  },
                  {
                    title: "Flight Booking System",
                    href: "/system-design/hld/real-world-systems/flight-booking-system",
                  },
                  {
                    title: "Online Code Editor",
                    href: "/system-design/hld/real-world-systems/online-code-editor",
                  },
                  {
                    title: "Analytics Platform",
                    href: "/system-design/hld/real-world-systems/analytics-platform",
                  },
                  {
                    title: "Payment System",
                    href: "/system-design/hld/real-world-systems/payment-system",
                  },
                  {
                    title: "Digital Wallet",
                    href: "/system-design/hld/real-world-systems/digital-wallet",
                  },
                ],
              },
              {
                title: "Advanced",
                children: [
                  {
                    title: "Location-Based Service / Yelp",
                    href: "/system-design/hld/real-world-systems/location-based-service-yelp",
                  },
                  {
                    title: "Design Uber",
                    href: "/system-design/hld/real-world-systems/uber",
                  },
                  {
                    title: "Food Delivery / Swiggy / Zomato",
                    href: "/system-design/hld/real-world-systems/food-delivery-swiggy-zomato",
                  },
                  {
                    title: "Design Google Docs",
                    href: "/system-design/hld/real-world-systems/google-docs",
                  },
                  {
                    title: "Design Google Maps",
                    href: "/system-design/hld/real-world-systems/google-maps",
                  },
                  {
                    title: "Design Zoom",
                    href: "/system-design/hld/real-world-systems/zoom",
                  },
                  {
                    title: "File Sharing System",
                    href: "/system-design/hld/real-world-systems/file-sharing-system",
                  },
                  {
                    title: "Distributed Web Crawler",
                    href: "/system-design/hld/real-world-systems/distributed-web-crawler",
                  },
                  {
                    title: "Distributed Cloud Storage",
                    href: "/system-design/hld/real-world-systems/distributed-cloud-storage",
                  },
                  {
                    title: "Distributed Locking Service",
                    href: "/system-design/hld/real-world-systems/distributed-locking-service",
                  },
                ],
              },
            ],
          },
          {
            title: "Interview Prep",
            children: [
              {
                title: "Common Questions",
                href: "/system-design/hld/interview-prep/common-questions",
              },
              {
                title: "Problem-Solving Framework",
                href: "/system-design/hld/interview-prep/problem-solving-framework",
              },
              {
                title: "Design Checklist",
                href: "/system-design/hld/interview-prep/design-checklist",
              },
              {
                title: "Cheat Sheet",
                href: "/system-design/hld/interview-prep/cheat-sheet",
              },
              {
                title: "Common Mistakes",
                href: "/system-design/hld/interview-prep/common-mistakes",
              },
            ],
          },
        ],
      },
      {
        title: "Low Level Design",
        href: "/system-design/lld",
        children: [
          {
            title: "OOP Concepts",
            children: [
              {
                title: "Classes and Objects",
                href: "/system-design/lld/oop-concepts/classes-and-objects",
              },
              {
                title: "Encapsulation",
                href: "/system-design/lld/oop-concepts/encapsulation",
              },
              {
                title: "Inheritance",
                href: "/system-design/lld/oop-concepts/inheritance",
              },
              {
                title: "Polymorphism",
                href: "/system-design/lld/oop-concepts/polymorphism",
              },
              {
                title: "Abstraction",
                href: "/system-design/lld/oop-concepts/abstraction",
              },
              {
                title: "Interfaces",
                href: "/system-design/lld/oop-concepts/interfaces",
              },
            ],
          },
          {
            title: "OOP Relationships",
            children: [
              {
                title: "Association",
                href: "/system-design/lld/oop-relationships/association",
              },
              {
                title: "Aggregation",
                href: "/system-design/lld/oop-relationships/aggregation",
              },
              {
                title: "Composition",
                href: "/system-design/lld/oop-relationships/composition",
              },
            ],
          },
          {
            title: "UML Diagrams",
            children: [
              {
                title: "Class Diagrams",
                href: "/system-design/lld/uml-diagrams/class-diagrams",
              },
              {
                title: "Sequence Diagrams",
                href: "/system-design/lld/uml-diagrams/sequence-diagrams",
              },
              {
                title: "Use Case Diagrams",
                href: "/system-design/lld/uml-diagrams/use-case-diagrams",
              },
              {
                title: "Activity Diagrams",
                href: "/system-design/lld/uml-diagrams/activity-diagrams",
              },
            ],
          },
          {
            title: "SOLID Principles",
            children: [
              {
                title: "Single Responsibility (SRP)",
                href: "/system-design/lld/solid-principles/srp",
              },
              {
                title: "Open-Closed (OCP)",
                href: "/system-design/lld/solid-principles/ocp",
              },
              {
                title: "Liskov Substitution (LSP)",
                href: "/system-design/lld/solid-principles/lsp",
              },
              {
                title: "Interface Segregation (ISP)",
                href: "/system-design/lld/solid-principles/isp",
              },
              {
                title: "Dependency Inversion (DIP)",
                href: "/system-design/lld/solid-principles/dip",
              },
            ],
          },
          {
            title: "Design Patterns",
            children: [
              {
                title: "Creational",
                children: [
                  {
                    title: "Singleton",
                    href: "/system-design/lld/design-patterns/creational/singleton",
                  },
                  {
                    title: "Factory",
                    href: "/system-design/lld/design-patterns/creational/factory",
                  },
                  {
                    title: "Abstract Factory",
                    href: "/system-design/lld/design-patterns/creational/abstract-factory",
                  },
                  {
                    title: "Builder",
                    href: "/system-design/lld/design-patterns/creational/builder",
                  },
                  {
                    title: "Prototype",
                    href: "/system-design/lld/design-patterns/creational/prototype",
                  },
                ],
              },
              {
                title: "Structural",
                children: [
                  {
                    title: "Adapter",
                    href: "/system-design/lld/design-patterns/structural/adapter",
                  },
                  {
                    title: "Bridge",
                    href: "/system-design/lld/design-patterns/structural/bridge",
                  },
                  {
                    title: "Composite",
                    href: "/system-design/lld/design-patterns/structural/composite",
                  },
                  {
                    title: "Decorator",
                    href: "/system-design/lld/design-patterns/structural/decorator",
                  },
                  {
                    title: "Facade",
                    href: "/system-design/lld/design-patterns/structural/facade",
                  },
                  {
                    title: "Flyweight",
                    href: "/system-design/lld/design-patterns/structural/flyweight",
                  },
                  {
                    title: "Proxy",
                    href: "/system-design/lld/design-patterns/structural/proxy",
                  },
                ],
              },
              {
                title: "Behavioral",
                children: [
                  {
                    title: "Chain of Responsibility",
                    href: "/system-design/lld/design-patterns/behavioral/chain-of-responsibility",
                  },
                  {
                    title: "Command",
                    href: "/system-design/lld/design-patterns/behavioral/command",
                  },
                  {
                    title: "Iterator",
                    href: "/system-design/lld/design-patterns/behavioral/iterator",
                  },
                  {
                    title: "Mediator",
                    href: "/system-design/lld/design-patterns/behavioral/mediator",
                  },
                  {
                    title: "Memento",
                    href: "/system-design/lld/design-patterns/behavioral/memento",
                  },
                  {
                    title: "Observer",
                    href: "/system-design/lld/design-patterns/behavioral/observer",
                  },
                  {
                    title: "State",
                    href: "/system-design/lld/design-patterns/behavioral/state",
                  },
                  {
                    title: "Strategy",
                    href: "/system-design/lld/design-patterns/behavioral/strategy",
                  },
                  {
                    title: "Template Method",
                    href: "/system-design/lld/design-patterns/behavioral/template-method",
                  },
                  {
                    title: "Visitor",
                    href: "/system-design/lld/design-patterns/behavioral/visitor",
                  },
                  {
                    title: "Interpreter",
                    href: "/system-design/lld/design-patterns/behavioral/interpreter",
                  },
                ],
              },
            ],
          },
          {
            title: "Best Practices",
            children: [
              {
                title: "Naming Conventions",
                href: "/system-design/lld/best-practices/naming-conventions",
              },
              {
                title: "Code Organization",
                href: "/system-design/lld/best-practices/code-organization",
              },
              {
                title: "KISS, DRY & YAGNI",
                href: "/system-design/lld/best-practices/kiss-dry-yagni",
              },
              {
                title: "Composition over Inheritance",
                href: "/system-design/lld/best-practices/composition-over-inheritance",
              },
              {
                title: "Design Tradeoffs",
                href: "/system-design/lld/best-practices/design-tradeoffs",
              },
            ],
          },
          {
            title: "Anti-Patterns",
            children: [
              {
                title: "God Object",
                href: "/system-design/lld/anti-patterns/god-object",
              },
              {
                title: "Spaghetti Code",
                href: "/system-design/lld/anti-patterns/spaghetti-code",
              },
              {
                title: "Tight Coupling",
                href: "/system-design/lld/anti-patterns/tight-coupling",
              },
              {
                title: "Premature Optimization",
                href: "/system-design/lld/anti-patterns/premature-optimization",
              },
            ],
          },
          {
            title: "Interview Prep",
            children: [
              {
                title: "Common Questions",
                href: "/system-design/lld/interview-prep/common-questions",
              },
              {
                title: "Problem-Solving Framework",
                href: "/system-design/lld/interview-prep/problem-solving-framework",
              },
              {
                title: "Code Review Checklist",
                href: "/system-design/lld/interview-prep/code-review-checklist",
              },
              {
                title: "Cheat Sheet",
                href: "/system-design/lld/interview-prep/cheat-sheet",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "DSA",
    href: "/dsa",
    children: [
      {
        title: "Complexity Analysis",
        children: [
          {
            title: "Time Complexity",
            href: "/dsa/complexity-analysis/time-complexity",
          },
          {
            title: "Space Complexity",
            href: "/dsa/complexity-analysis/space-complexity",
          },
          {
            title: "Big O, Theta & Omega",
            href: "/dsa/complexity-analysis/big-o-notation",
          },
          {
            title: "Amortized Analysis",
            href: "/dsa/complexity-analysis/amortized-analysis",
          },
          {
            title: "Problems",
            children: [
              {
                title: "Analyze Time Complexity of Algorithms",
                href: "/dsa/complexity-analysis/problems/analyze-time-complexity",
              },
              {
                title: "Common Algorithm Complexities",
                href: "/dsa/complexity-analysis/problems/common-complexities",
              },
              {
                title: "Space-Time Tradeoffs in Practice",
                href: "/dsa/complexity-analysis/problems/space-time-tradeoffs",
              },
            ],
          },
        ],
      },
      {
        title: "Arrays & Strings",
        children: [
          { title: "Arrays", href: "/dsa/arrays-strings/arrays" },
          { title: "Strings", href: "/dsa/arrays-strings/strings" },
          { title: "Two Pointers", href: "/dsa/arrays-strings/two-pointers" },
          {
            title: "Sliding Window",
            href: "/dsa/arrays-strings/sliding-window",
          },
          { title: "Prefix Sums", href: "/dsa/arrays-strings/prefix-sums" },
          {
            title: "Problems",
            children: [
              {
                title: "Two Sum",
                href: "/dsa/arrays-strings/problems/two-sum",
              },
              {
                title: "Best Time to Buy and Sell Stock",
                href: "/dsa/arrays-strings/problems/best-time-to-buy-sell-stock",
              },
              {
                title: "Contains Duplicate",
                href: "/dsa/arrays-strings/problems/contains-duplicate",
              },
              {
                title: "Product of Array Except Self",
                href: "/dsa/arrays-strings/problems/product-except-self",
              },
              {
                title: "Maximum Subarray (Kadanes)",
                href: "/dsa/arrays-strings/problems/maximum-subarray",
              },
              {
                title: "Maximum Product Subarray",
                href: "/dsa/arrays-strings/problems/maximum-product-subarray",
              },
              {
                title: "Find Minimum in Rotated Sorted Array",
                href: "/dsa/arrays-strings/problems/find-minimum-rotated",
              },
              {
                title: "Search in Rotated Sorted Array",
                href: "/dsa/arrays-strings/problems/search-rotated-array",
              },
              { title: "3Sum", href: "/dsa/arrays-strings/problems/3sum" },
              {
                title: "Container With Most Water",
                href: "/dsa/arrays-strings/problems/container-with-most-water",
              },
              {
                title: "Longest Substring Without Repeating Characters",
                href: "/dsa/arrays-strings/problems/longest-substring-without-repeating",
              },
              {
                title: "Minimum Window Substring",
                href: "/dsa/arrays-strings/problems/minimum-window-substring",
              },
              {
                title: "Valid Anagram",
                href: "/dsa/arrays-strings/problems/valid-anagram",
              },
              {
                title: "Group Anagrams",
                href: "/dsa/arrays-strings/problems/group-anagrams",
              },
              {
                title: "Trapping Rain Water",
                href: "/dsa/arrays-strings/problems/trapping-rain-water",
              },
            ],
          },
        ],
      },
      {
        title: "Linked Lists",
        children: [
          {
            title: "Singly Linked List",
            href: "/dsa/linked-lists/singly-linked-list",
          },
          {
            title: "Doubly Linked List",
            href: "/dsa/linked-lists/doubly-linked-list",
          },
          {
            title: "Circular Linked List",
            href: "/dsa/linked-lists/circular-linked-list",
          },
          {
            title: "Fast & Slow Pointers",
            href: "/dsa/linked-lists/fast-slow-pointers",
          },
          {
            title: "Problems",
            children: [
              {
                title: "Reverse a Linked List",
                href: "/dsa/linked-lists/problems/reverse-linked-list",
              },
              {
                title: "Detect Cycle in Linked List",
                href: "/dsa/linked-lists/problems/detect-cycle",
              },
              {
                title: "Merge Two Sorted Lists",
                href: "/dsa/linked-lists/problems/merge-two-sorted-lists",
              },
              {
                title: "Merge K Sorted Lists",
                href: "/dsa/linked-lists/problems/merge-k-sorted-lists",
              },
              {
                title: "Remove Nth Node From End",
                href: "/dsa/linked-lists/problems/remove-nth-node",
              },
              {
                title: "Reorder List",
                href: "/dsa/linked-lists/problems/reorder-list",
              },
              {
                title: "Copy List with Random Pointer",
                href: "/dsa/linked-lists/problems/copy-list-random-pointer",
              },
              {
                title: "Add Two Numbers",
                href: "/dsa/linked-lists/problems/add-two-numbers",
              },
              {
                title: "Find the Duplicate Number",
                href: "/dsa/linked-lists/problems/find-the-duplicate-number",
              },
              {
                title: "LRU Cache",
                href: "/dsa/linked-lists/problems/lru-cache",
              },
            ],
          },
        ],
      },
      {
        title: "Stacks & Queues",
        children: [
          { title: "Stack", href: "/dsa/stacks-queues/stack" },
          { title: "Queue", href: "/dsa/stacks-queues/queue" },
          {
            title: "Monotonic Stack",
            href: "/dsa/stacks-queues/monotonic-stack",
          },
          { title: "Deque", href: "/dsa/stacks-queues/deque" },
          {
            title: "Priority Queue",
            href: "/dsa/stacks-queues/priority-queue",
          },
          {
            title: "Problems",
            children: [
              {
                title: "Valid Parentheses",
                href: "/dsa/stacks-queues/problems/valid-parentheses",
              },
              {
                title: "Min Stack",
                href: "/dsa/stacks-queues/problems/min-stack",
              },
              {
                title: "Evaluate Reverse Polish Notation",
                href: "/dsa/stacks-queues/problems/evaluate-rpn",
              },
              {
                title: "Generate Parentheses",
                href: "/dsa/stacks-queues/problems/generate-parentheses",
              },
              {
                title: "Daily Temperatures",
                href: "/dsa/stacks-queues/problems/daily-temperatures",
              },
              {
                title: "Car Fleet",
                href: "/dsa/stacks-queues/problems/car-fleet",
              },
              {
                title: "Largest Rectangle in Histogram",
                href: "/dsa/stacks-queues/problems/largest-rectangle-histogram",
              },
              {
                title: "Sliding Window Maximum",
                href: "/dsa/stacks-queues/problems/sliding-window-maximum",
              },
            ],
          },
        ],
      },
      {
        title: "Hashing",
        children: [
          { title: "Hash Maps", href: "/dsa/hashing/hash-maps" },
          { title: "Hash Sets", href: "/dsa/hashing/hash-sets" },
          {
            title: "Collision Resolution",
            href: "/dsa/hashing/collision-resolution",
          },
          {
            title: "Problems",
            children: [
              { title: "Two Sum", href: "/dsa/hashing/problems/two-sum" },
              {
                title: "Longest Consecutive Sequence",
                href: "/dsa/hashing/problems/longest-consecutive-sequence",
              },
              {
                title: "Top K Frequent Elements",
                href: "/dsa/hashing/problems/top-k-frequent-elements",
              },
              {
                title: "Valid Sudoku",
                href: "/dsa/hashing/problems/valid-sudoku",
              },
              {
                title: "Group Anagrams",
                href: "/dsa/hashing/problems/group-anagrams",
              },
              {
                title: "Encode and Decode Strings",
                href: "/dsa/hashing/problems/encode-decode-strings",
              },
              {
                title: "First Missing Positive",
                href: "/dsa/hashing/problems/first-missing-positive",
              },
            ],
          },
        ],
      },
      {
        title: "Trees",
        children: [
          { title: "Binary Trees", href: "/dsa/trees/binary-trees" },
          {
            title: "Binary Search Trees (BST)",
            href: "/dsa/trees/binary-search-trees",
          },
          { title: "AVL Trees", href: "/dsa/trees/avl-trees" },
          { title: "Red-Black Trees", href: "/dsa/trees/red-black-trees" },
          { title: "Tree Traversals", href: "/dsa/trees/tree-traversals" },
          {
            title: "Lowest Common Ancestor (LCA)",
            href: "/dsa/trees/lowest-common-ancestor",
          },
          { title: "Segment Trees", href: "/dsa/trees/segment-trees" },
          { title: "Fenwick Tree (BIT)", href: "/dsa/trees/fenwick-tree" },
          {
            title: "Problems",
            children: [
              {
                title: "Invert Binary Tree",
                href: "/dsa/trees/problems/invert-binary-tree",
              },
              {
                title: "Maximum Depth of Binary Tree",
                href: "/dsa/trees/problems/maximum-depth",
              },
              {
                title: "Diameter of Binary Tree",
                href: "/dsa/trees/problems/diameter-of-binary-tree",
              },
              {
                title: "Balanced Binary Tree",
                href: "/dsa/trees/problems/balanced-binary-tree",
              },
              { title: "Same Tree", href: "/dsa/trees/problems/same-tree" },
              {
                title: "Subtree of Another Tree",
                href: "/dsa/trees/problems/subtree-of-another-tree",
              },
              {
                title: "Lowest Common Ancestor of BST",
                href: "/dsa/trees/problems/lowest-common-ancestor-bst",
              },
              {
                title: "Binary Tree Level Order Traversal",
                href: "/dsa/trees/problems/level-order-traversal",
              },
              {
                title: "Binary Tree Right Side View",
                href: "/dsa/trees/problems/right-side-view",
              },
              {
                title: "Validate BST",
                href: "/dsa/trees/problems/validate-bst",
              },
              {
                title: "Kth Smallest Element in BST",
                href: "/dsa/trees/problems/kth-smallest-in-bst",
              },
              {
                title: "Construct Tree from Preorder and Inorder",
                href: "/dsa/trees/problems/construct-from-preorder-inorder",
              },
              {
                title: "Binary Tree Maximum Path Sum",
                href: "/dsa/trees/problems/binary-tree-max-path-sum",
              },
              {
                title: "Serialize and Deserialize Binary Tree",
                href: "/dsa/trees/problems/serialize-deserialize",
              },
            ],
          },
        ],
      },
      {
        title: "Heaps",
        children: [
          { title: "Min Heap & Max Heap", href: "/dsa/heaps/min-max-heap" },
          { title: "Heap Operations", href: "/dsa/heaps/heap-operations" },
          { title: "Top K Problems", href: "/dsa/heaps/top-k-problems" },
          {
            title: "Problems",
            children: [
              {
                title: "Kth Largest Element in Array",
                href: "/dsa/heaps/problems/kth-largest-element",
              },
              {
                title: "K Closest Points to Origin",
                href: "/dsa/heaps/problems/k-closest-points",
              },
              {
                title: "Task Scheduler",
                href: "/dsa/heaps/problems/task-scheduler",
              },
              {
                title: "Find Median from Data Stream",
                href: "/dsa/heaps/problems/find-median-data-stream",
              },
              {
                title: "Merge K Sorted Lists",
                href: "/dsa/heaps/problems/merge-k-sorted-lists",
              },
              {
                title: "Top K Frequent Elements",
                href: "/dsa/heaps/problems/top-k-frequent-elements",
              },
              {
                title: "Last Stone Weight",
                href: "/dsa/heaps/problems/last-stone-weight",
              },
            ],
          },
        ],
      },
      {
        title: "Tries",
        children: [
          { title: "Trie (Prefix Tree)", href: "/dsa/tries/trie-prefix-tree" },
          { title: "Trie Applications", href: "/dsa/tries/trie-applications" },
          {
            title: "Problems",
            children: [
              {
                title: "Implement Trie",
                href: "/dsa/tries/problems/implement-trie",
              },
              {
                title: "Design Add and Search Words",
                href: "/dsa/tries/problems/design-add-search-words",
              },
              {
                title: "Word Search II",
                href: "/dsa/tries/problems/word-search-ii",
              },
              {
                title: "Replace Words",
                href: "/dsa/tries/problems/replace-words",
              },
              {
                title: "Maximum XOR of Two Numbers",
                href: "/dsa/tries/problems/maximum-xor-two-numbers",
              },
            ],
          },
        ],
      },
      {
        title: "Graphs",
        children: [
          {
            title: "Graph Representations",
            href: "/dsa/graphs/graph-representations",
          },
          { title: "BFS", href: "/dsa/graphs/bfs" },
          { title: "DFS", href: "/dsa/graphs/dfs" },
          { title: "Topological Sort", href: "/dsa/graphs/topological-sort" },
          { title: "Dijkstra's Algorithm", href: "/dsa/graphs/dijkstra" },
          { title: "Bellman-Ford Algorithm", href: "/dsa/graphs/bellman-ford" },
          {
            title: "Floyd-Warshall Algorithm",
            href: "/dsa/graphs/floyd-warshall",
          },
          { title: "Kruskal and Prim (MST)", href: "/dsa/graphs/kruskal-prim" },
          { title: "Union-Find (DSU)", href: "/dsa/graphs/union-find" },
          {
            title: "Strongly Connected Components",
            href: "/dsa/graphs/strongly-connected-components",
          },
          { title: "Cycle Detection", href: "/dsa/graphs/cycle-detection" },
          {
            title: "Problems",
            children: [
              {
                title: "Number of Islands",
                href: "/dsa/graphs/problems/number-of-islands",
              },
              {
                title: "Clone Graph",
                href: "/dsa/graphs/problems/clone-graph",
              },
              {
                title: "Pacific Atlantic Water Flow",
                href: "/dsa/graphs/problems/pacific-atlantic-water-flow",
              },
              {
                title: "Course Schedule",
                href: "/dsa/graphs/problems/course-schedule",
              },
              {
                title: "Course Schedule II",
                href: "/dsa/graphs/problems/course-schedule-ii",
              },
              {
                title: "Number of Connected Components",
                href: "/dsa/graphs/problems/number-of-connected-components",
              },
              {
                title: "Graph Valid Tree",
                href: "/dsa/graphs/problems/graph-valid-tree",
              },
              {
                title: "Word Ladder",
                href: "/dsa/graphs/problems/word-ladder",
              },
              {
                title: "Network Delay Time",
                href: "/dsa/graphs/problems/network-delay-time",
              },
              {
                title: "Cheapest Flights Within K Stops",
                href: "/dsa/graphs/problems/cheapest-flights-k-stops",
              },
              {
                title: "Reconstruct Itinerary",
                href: "/dsa/graphs/problems/reconstruct-itinerary",
              },
              {
                title: "Alien Dictionary",
                href: "/dsa/graphs/problems/alien-dictionary",
              },
            ],
          },
        ],
      },
      {
        title: "Sorting",
        children: [
          {
            title: "Bubble, Selection & Insertion",
            href: "/dsa/sorting/bubble-selection-insertion",
          },
          { title: "Merge Sort", href: "/dsa/sorting/merge-sort" },
          { title: "Quick Sort", href: "/dsa/sorting/quick-sort" },
          { title: "Heap Sort", href: "/dsa/sorting/heap-sort" },
          {
            title: "Counting, Radix & Bucket Sort",
            href: "/dsa/sorting/counting-radix-bucket",
          },
          {
            title: "Sorting Comparison",
            href: "/dsa/sorting/sorting-comparison",
          },
          {
            title: "Problems",
            children: [
              {
                title: "Sort Colors (Dutch National Flag)",
                href: "/dsa/sorting/problems/sort-colors",
              },
              {
                title: "Merge Intervals",
                href: "/dsa/sorting/problems/merge-intervals",
              },
              {
                title: "Insert Interval",
                href: "/dsa/sorting/problems/insert-interval",
              },
              {
                title: "Non-overlapping Intervals",
                href: "/dsa/sorting/problems/non-overlapping-intervals",
              },
              {
                title: "Largest Number",
                href: "/dsa/sorting/problems/largest-number",
              },
              {
                title: "Meeting Rooms",
                href: "/dsa/sorting/problems/meeting-rooms",
              },
              {
                title: "Meeting Rooms II",
                href: "/dsa/sorting/problems/meeting-rooms-ii",
              },
            ],
          },
        ],
      },
      {
        title: "Searching",
        children: [
          { title: "Binary Search", href: "/dsa/searching/binary-search" },
          {
            title: "Binary Search Variants",
            href: "/dsa/searching/binary-search-variants",
          },
          {
            title: "Problems",
            children: [
              {
                title: "Binary Search",
                href: "/dsa/searching/problems/binary-search-basic",
              },
              {
                title: "Search a 2D Matrix",
                href: "/dsa/searching/problems/search-2d-matrix",
              },
              {
                title: "Koko Eating Bananas",
                href: "/dsa/searching/problems/koko-eating-bananas",
              },
              {
                title: "Find Minimum in Rotated Sorted Array",
                href: "/dsa/searching/problems/find-minimum-rotated",
              },
              {
                title: "Search in Rotated Sorted Array",
                href: "/dsa/searching/problems/search-rotated-array",
              },
              {
                title: "Time Based Key-Value Store",
                href: "/dsa/searching/problems/time-based-key-value",
              },
              {
                title: "Median of Two Sorted Arrays",
                href: "/dsa/searching/problems/median-two-sorted-arrays",
              },
            ],
          },
        ],
      },
      {
        title: "Recursion & Backtracking",
        children: [
          {
            title: "Recursion Fundamentals",
            href: "/dsa/recursion-backtracking/recursion-fundamentals",
          },
          {
            title: "Backtracking",
            href: "/dsa/recursion-backtracking/backtracking",
          },
          {
            title: "Classic Backtracking Problems",
            href: "/dsa/recursion-backtracking/classic-backtracking-problems",
          },
          {
            title: "Problems",
            children: [
              {
                title: "Subsets",
                href: "/dsa/recursion-backtracking/problems/subsets",
              },
              {
                title: "Subsets II",
                href: "/dsa/recursion-backtracking/problems/subsets-ii",
              },
              {
                title: "Combination Sum",
                href: "/dsa/recursion-backtracking/problems/combination-sum",
              },
              {
                title: "Combination Sum II",
                href: "/dsa/recursion-backtracking/problems/combination-sum-ii",
              },
              {
                title: "Permutations",
                href: "/dsa/recursion-backtracking/problems/permutations",
              },
              {
                title: "Word Search",
                href: "/dsa/recursion-backtracking/problems/word-search",
              },
              {
                title: "Palindrome Partitioning",
                href: "/dsa/recursion-backtracking/problems/palindrome-partitioning",
              },
              {
                title: "Letter Combinations of Phone Number",
                href: "/dsa/recursion-backtracking/problems/letter-combinations-phone",
              },
              {
                title: "N-Queens",
                href: "/dsa/recursion-backtracking/problems/n-queens",
              },
              {
                title: "Sudoku Solver",
                href: "/dsa/recursion-backtracking/problems/sudoku-solver",
              },
            ],
          },
        ],
      },
      {
        title: "Dynamic Programming",
        children: [
          {
            title: "DP Fundamentals",
            href: "/dsa/dynamic-programming/dp-fundamentals",
          },
          {
            title: "Memoization vs Tabulation",
            href: "/dsa/dynamic-programming/memoization-tabulation",
          },
          { title: "1D DP", href: "/dsa/dynamic-programming/1d-dp" },
          { title: "2D DP", href: "/dsa/dynamic-programming/2d-dp" },
          {
            title: "Knapsack Problems",
            href: "/dsa/dynamic-programming/knapsack",
          },
          { title: "LCS & LIS", href: "/dsa/dynamic-programming/lcs-lis" },
          {
            title: "DP on Trees",
            href: "/dsa/dynamic-programming/dp-on-trees",
          },
          { title: "Bitmask DP", href: "/dsa/dynamic-programming/bitmask-dp" },
          {
            title: "Problems",
            children: [
              {
                title: "Climbing Stairs",
                href: "/dsa/dynamic-programming/problems/climbing-stairs",
              },
              {
                title: "House Robber",
                href: "/dsa/dynamic-programming/problems/house-robber",
              },
              {
                title: "House Robber II",
                href: "/dsa/dynamic-programming/problems/house-robber-ii",
              },
              {
                title: "Longest Palindromic Substring",
                href: "/dsa/dynamic-programming/problems/longest-palindromic-substring",
              },
              {
                title: "Decode Ways",
                href: "/dsa/dynamic-programming/problems/decode-ways",
              },
              {
                title: "Coin Change",
                href: "/dsa/dynamic-programming/problems/coin-change",
              },
              {
                title: "Word Break",
                href: "/dsa/dynamic-programming/problems/word-break",
              },
              {
                title: "Longest Increasing Subsequence",
                href: "/dsa/dynamic-programming/problems/longest-increasing-subsequence",
              },
              {
                title: "Unique Paths",
                href: "/dsa/dynamic-programming/problems/unique-paths",
              },
              {
                title: "Jump Game",
                href: "/dsa/dynamic-programming/problems/jump-game",
              },
              {
                title: "Partition Equal Subset Sum",
                href: "/dsa/dynamic-programming/problems/partition-equal-subset-sum",
              },
              {
                title: "Longest Common Subsequence",
                href: "/dsa/dynamic-programming/problems/longest-common-subsequence",
              },
              {
                title: "Edit Distance",
                href: "/dsa/dynamic-programming/problems/edit-distance",
              },
              {
                title: "Burst Balloons",
                href: "/dsa/dynamic-programming/problems/burst-balloons",
              },
              {
                title: "Regular Expression Matching",
                href: "/dsa/dynamic-programming/problems/regular-expression-matching",
              },
            ],
          },
        ],
      },
      {
        title: "Greedy",
        children: [
          {
            title: "Greedy Fundamentals",
            href: "/dsa/greedy/greedy-fundamentals",
          },
          {
            title: "Interval Scheduling",
            href: "/dsa/greedy/interval-scheduling",
          },
          { title: "Huffman Coding", href: "/dsa/greedy/huffman-coding" },
          {
            title: "Problems",
            children: [
              { title: "Jump Game", href: "/dsa/greedy/problems/jump-game" },
              {
                title: "Jump Game II",
                href: "/dsa/greedy/problems/jump-game-ii",
              },
              {
                title: "Gas Station",
                href: "/dsa/greedy/problems/gas-station",
              },
              {
                title: "Hand of Straights",
                href: "/dsa/greedy/problems/hand-of-straights",
              },
              {
                title: "Partition Labels",
                href: "/dsa/greedy/problems/partition-labels",
              },
              {
                title: "Valid Parenthesis String",
                href: "/dsa/greedy/problems/valid-parenthesis-string",
              },
              { title: "Candy", href: "/dsa/greedy/problems/candy" },
              {
                title: "Non-overlapping Intervals",
                href: "/dsa/greedy/problems/non-overlapping-intervals",
              },
            ],
          },
        ],
      },
      {
        title: "Divide & Conquer",
        children: [
          {
            title: "Divide & Conquer Paradigm",
            href: "/dsa/divide-and-conquer/paradigm",
          },
          {
            title: "Master Theorem",
            href: "/dsa/divide-and-conquer/master-theorem",
          },
          {
            title: "Problems",
            children: [
              {
                title: "Merge Sort Implementation",
                href: "/dsa/divide-and-conquer/problems/merge-sort-impl",
              },
              {
                title: "Quick Sort Implementation",
                href: "/dsa/divide-and-conquer/problems/quick-sort-impl",
              },
              {
                title: "Kth Largest Element",
                href: "/dsa/divide-and-conquer/problems/kth-largest-element",
              },
              {
                title: "Count Inversions",
                href: "/dsa/divide-and-conquer/problems/count-inversions",
              },
              {
                title: "Median of Two Sorted Arrays",
                href: "/dsa/divide-and-conquer/problems/median-two-sorted-arrays",
              },
              {
                title: "Maximum Subarray (D&C Approach)",
                href: "/dsa/divide-and-conquer/problems/maximum-subarray-dc",
              },
            ],
          },
        ],
      },
      {
        title: "Bit Manipulation",
        children: [
          {
            title: "Bitwise Operations",
            href: "/dsa/bit-manipulation/bitwise-operations",
          },
          {
            title: "Common Bit Tricks",
            href: "/dsa/bit-manipulation/common-bit-tricks",
          },
          {
            title: "Problems",
            children: [
              {
                title: "Single Number",
                href: "/dsa/bit-manipulation/problems/single-number",
              },
              {
                title: "Number of 1 Bits",
                href: "/dsa/bit-manipulation/problems/number-of-1-bits",
              },
              {
                title: "Counting Bits",
                href: "/dsa/bit-manipulation/problems/counting-bits",
              },
              {
                title: "Reverse Bits",
                href: "/dsa/bit-manipulation/problems/reverse-bits",
              },
              {
                title: "Missing Number",
                href: "/dsa/bit-manipulation/problems/missing-number",
              },
              {
                title: "Sum of Two Integers",
                href: "/dsa/bit-manipulation/problems/sum-of-two-integers",
              },
              {
                title: "Power of Two",
                href: "/dsa/bit-manipulation/problems/power-of-two",
              },
              {
                title: "XOR Queries of a Subarray",
                href: "/dsa/bit-manipulation/problems/xor-queries",
              },
            ],
          },
        ],
      },
      {
        title: "Math & Number Theory",
        children: [
          { title: "GCD & LCM", href: "/dsa/math/gcd-lcm" },
          { title: "Prime Numbers & Sieve", href: "/dsa/math/prime-sieve" },
          { title: "Modular Arithmetic", href: "/dsa/math/modular-arithmetic" },
          {
            title: "Fast Exponentiation",
            href: "/dsa/math/fast-exponentiation",
          },
          {
            title: "Problems",
            children: [
              {
                title: "Palindrome Number",
                href: "/dsa/math/problems/palindrome-number",
              },
              {
                title: "Happy Number",
                href: "/dsa/math/problems/happy-number",
              },
              { title: "Pow(x, n)", href: "/dsa/math/problems/pow-x-n" },
              { title: "Sqrt(x)", href: "/dsa/math/problems/sqrt-x" },
              {
                title: "Reverse Integer",
                href: "/dsa/math/problems/reverse-integer",
              },
              {
                title: "Roman to Integer",
                href: "/dsa/math/problems/roman-to-integer",
              },
              {
                title: "Count Primes",
                href: "/dsa/math/problems/count-primes",
              },
              {
                title: "Excel Sheet Column Number",
                href: "/dsa/math/problems/excel-sheet-column",
              },
            ],
          },
        ],
      },
      {
        title: "Intervals",
        children: [
          { title: "Merge Intervals", href: "/dsa/intervals/merge-intervals" },
          {
            title: "Interval Problem Patterns",
            href: "/dsa/intervals/interval-problems",
          },
          {
            title: "Problems",
            children: [
              {
                title: "Merge Intervals",
                href: "/dsa/intervals/problems/merge-intervals",
              },
              {
                title: "Insert Interval",
                href: "/dsa/intervals/problems/insert-interval",
              },
              {
                title: "Non-overlapping Intervals",
                href: "/dsa/intervals/problems/non-overlapping-intervals",
              },
              {
                title: "Meeting Rooms",
                href: "/dsa/intervals/problems/meeting-rooms",
              },
              {
                title: "Meeting Rooms II",
                href: "/dsa/intervals/problems/meeting-rooms-ii",
              },
              {
                title: "Minimum Number of Arrows to Burst Balloons",
                href: "/dsa/intervals/problems/minimum-arrows",
              },
              {
                title: "Employee Free Time",
                href: "/dsa/intervals/problems/employee-free-time",
              },
            ],
          },
        ],
      },
      {
        title: "Interview Prep",
        children: [
          {
            title: "Top 14 DSA Patterns",
            href: "/dsa/interview-prep/top-patterns",
          },
          {
            title: "Problem-Solving Approach",
            href: "/dsa/interview-prep/problem-solving-approach",
          },
          {
            title: "Common Mistakes",
            href: "/dsa/interview-prep/common-mistakes",
          },
          { title: "DSA Cheat Sheet", href: "/dsa/interview-prep/cheat-sheet" },
        ],
      },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

/** Flatten nav tree to ordered leaf pages (items with href but no children) */
export function flattenNav(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];
  function walk(nodes: NavItem[]) {
    for (const node of nodes) {
      if (node.href && !node.children) result.push(node);
      if (node.children) walk(node.children);
    }
  }
  walk(items);
  return result;
}

/** Find all items (including sections) with an href */
export function allNavItems(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];
  function walk(nodes: NavItem[]) {
    for (const node of nodes) {
      if (node.href) result.push(node);
      if (node.children) walk(node.children);
    }
  }
  walk(items);
  return result;
}

/** Find the breadcrumb trail to a given href */
export function findBreadcrumbs(
  href: string,
  items: NavItem[] = navigation,
  trail: NavItem[] = [],
): NavItem[] | null {
  for (const item of items) {
    const next = [...trail, item];
    if (item.href === href) return next;
    if (item.children) {
      const found = findBreadcrumbs(href, item.children, next);
      if (found) return found;
    }
  }
  return null;
}

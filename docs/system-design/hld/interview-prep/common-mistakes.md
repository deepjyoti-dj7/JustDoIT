---
title: Common Mistakes
---

# Common Mistakes in System Design Interviews

Most system design interview failures aren't due to not knowing a specific technology. They're due to structural mistakes in how candidates approach, communicate, and reason about problems. This guide catalogs the most common mistakes — patterns observed across thousands of interviews at top tech companies — so you can recognize and avoid them.

> **Who makes these mistakes:** Not just junior engineers. Many senior engineers fail senior-level interviews because they're technically strong but weak in the skills that distinguish a system design interview: structured thinking, tradeoff articulation, and proactive communication.

---

## Mistake 1: Starting to Design Without Clarifying Requirements

**What it looks like:**
Interviewer: "Design Twitter."
Candidate: [immediately starts drawing boxes] "So we'll have a load balancer, then API servers, and a PostgreSQL database..."

**Why it's wrong:**
Twitter is an enormous system. Are you designing the home timeline? The ad platform? DM delivery? Tweet search? Without clarification, you're designing the wrong thing at the wrong scale.

**What to do instead:**
Spend the first 5 minutes asking structured questions:
```
- What are the core features I should focus on? 
  (posting tweets? feed? following? search? DMs?)
- What's the scale? DAU? Expected read/write ratio?
- Availability requirements? Consistency requirements?
- Any geographic constraints?
```

Then repeat back: *"So I'm designing: (1) posting tweets, (2) following users, (3) home timeline. Is that right?"*

**The cost:** Designing the wrong thing wastes 15-20 minutes of a 45-minute interview. You cannot recover.

---

## Mistake 2: Going Too Deep Too Soon

**What it looks like:**
Candidate spends 20 minutes on the database schema and indexing strategy before ever drawing the high-level architecture. The interviewer has no idea what system is being built.

**Why it's wrong:**
Depth before breadth leaves the interviewer with no context for the details you're discussing. It also means you've committed to a design direction before seeing the full picture — you may be solving the wrong problem deeply.

**What to do instead:**
Always sketch the full system first (even if rough) before going deep on any component:
1. Draw clients, CDN, load balancer, API servers, databases, queues in 5-7 minutes
2. Walk through a core flow end-to-end in 2-3 minutes
3. **Then** propose where to deep dive: *"The most interesting technical challenge is the feed generation. Would you like to go deeper on that?"*

---

## Mistake 3: Designing Without Numbers

**What it looks like:**
*"We need sharding because there will be a lot of data."*
*"We should use a CDN because performance matters."*

**Why it's wrong:**
"A lot" is meaningless. 1 GB is a lot compared to a text file. 1 TB is small for a data warehouse. Every design decision should be grounded in a number: writes per second, storage per year, cache memory needed. Without numbers, you can't justify your architecture or catch overengineering.

**What to do instead:**
Always estimate before designing:
```
"10M DAU, 2 writes/day each = 20M writes/day = ~230 writes/sec average.
Peak = 3× = ~700 writes/sec.
PostgreSQL handles ~5K writes/sec easily.
So we don't need sharding yet — we'll start with a single primary
and add read replicas for read scaling."
```

Now your architecture decisions have justification. The interviewer can see your reasoning.

---

## Mistake 4: Presenting Only One Option

**What it looks like:**
*"I'll use MySQL for this."*
*"We'll use Redis for caching."*

**Why it's wrong:**
System design is about tradeoffs. Choosing one option without acknowledging alternatives suggests you don't know the tradeoff space. Senior engineers evaluate options; they don't just pick defaults.

**What to do instead:**
*"For the database, I'm choosing between MySQL (strong consistency, ACID, familiar) and Cassandra (horizontal scaling, eventual consistency, high write throughput). Given our write volume of 700 writes/sec and the fact that we need ACID for user accounts, I'll start with MySQL. If we hit the write ceiling, we'd consider Cassandra for the feed storage, not user data."*

This shows:
- You know both options exist
- You understand their tradeoffs
- You can select the right tool for the specific context

---

## Mistake 5: Ignoring Failure Scenarios

**What it looks like:**
The entire design assumes everything works. No discussion of what happens when the database primary fails, when the cache is cold, when a worker crashes mid-job.

**Why it's wrong:**
Distributed systems fail constantly. A design that only works when everything is healthy is not a production-grade design. Senior engineers think about failure modes as a core part of design, not an afterthought.

**What to do instead:**
For each critical component, ask yourself: *"What happens if this dies?"*

```
Database primary fails → replica promotion (RDS Multi-AZ auto-failover)
Cache fails → fall through to database (latency spike, not outage)
Worker crashes mid-job → job re-queued after visibility timeout expires
Message queue full → backpressure to API, dead-letter queue for overflow
Downstream payment API down → circuit breaker, retry with idempotency key
```

Proactively mention 2-3 failure scenarios and their mitigations without being asked.

---

## Mistake 6: Forgetting Non-Functional Requirements

**What it looks like:**
Candidate designs a system that works but never addresses: availability, consistency guarantees, data durability, latency targets.

**Why it's wrong:**
Functional correctness is table stakes. The hard problems in production systems are non-functional: "how do we maintain 99.99% availability?" "how do we ensure strong consistency for payments while still scaling?" "how do we keep P99 latency under 200ms?"

**NFR checklist to address proactively:**

| NFR | Question to Address |
|---|---|
| **Availability** | What's the SLA? How do you achieve it? What's the failover strategy? |
| **Consistency** | Strong or eventual? Where can you tolerate stale reads? |
| **Latency** | What's the P99 target? Which components are on the critical path? |
| **Durability** | Can you lose data? What's the backup strategy? |
| **Scalability** | Where's the bottleneck? How do you scale past it? |

---

## Mistake 7: Not Driving the Conversation

**What it looks like:**
Candidate answers questions reactively. Interviewer asks "what database?" → Candidate answers. Interviewer asks "how would you scale?" → Candidate answers. The candidate never volunteers information or proposes what to cover next.

**Why it's wrong:**
A system design interview is meant to simulate how you'd collaborate on an RFC or design review. Senior engineers drive discussions — they have an agenda, they propose what to cover, they ask for input. A passive candidate appears junior regardless of technical knowledge.

**What to do instead:**
- After each section, say where you want to go next: *"I've covered the high-level design. The most interesting challenge here is the feed generation — I want to deep dive on that. Is there another area you'd like to explore first?"*
- Proactively surface tradeoffs: *"I'm going to make a decision here. I could go with X or Y — I'm leaning towards X because [reason]. Does that align with what you're looking for?"*
- Signal your thought process: *"Let me think about this for a second... The constraint is [X], which means [Y] won't work because [Z]."*

---

## Mistake 8: Treating All Data the Same

**What it looks like:**
*"We'll store everything in PostgreSQL."*
Combining user profiles, tweets, media files, analytics events, and session tokens in one relational database.

**Why it's wrong:**
Different data has dramatically different access patterns, consistency requirements, and scale characteristics. Treating them identically leads to overloaded databases and wrong tools for the job.

**The right approach — match the data to the store:**

| Data Type | Right Tool | Why |
|---|---|---|
| User profiles, orders | PostgreSQL | ACID, relational integrity, moderate scale |
| Session tokens, rate limit counters | Redis | Low-latency key-value, TTL, in-memory |
| Social graph (who follows whom) | Graph DB or sharded SQL | Relationship traversal |
| Time-series events, logs | Cassandra / InfluxDB | Write-heavy, append-only, time-range queries |
| Binary files, media, backups | S3 / GCS | Cheap, durable, CDN-compatible |
| Full-text search | Elasticsearch | Inverted index, relevance ranking |
| Recommendation scores | Redis / pre-computed table | Read-heavy, frequently updated |

---

## Mistake 9: Ignoring the Single Point of Failure

**What it looks like:**
System has one database with no replicas. One Redis instance. One load balancer. One "message processor" service.

**Why it's wrong:**
A single instance of any critical component is a single point of failure (SPOF). When it goes down — and it will go down — the entire system is unavailable. Production systems at any real scale require redundancy at every layer.

**SPOF checklist:**
```
[ ] Load balancer: Use two LBs (active-passive) or a managed service (ALB)
[ ] API servers: Multiple instances behind LB (auto-scaling group)
[ ] Database: Primary + at least 1 replica; Multi-AZ for automatic failover
[ ] Cache: Redis Cluster or Redis Sentinel for HA
[ ] Message queue: Managed service (SQS, Kafka cluster) for built-in HA
[ ] DNS: Managed DNS (Route53) with health checks for automatic failover
```

---

## Mistake 10: Over-Engineering Early

**What it looks like:**
For a system with 100K DAU, the design includes: database sharding across 32 nodes, Kafka with 64 partitions, a microservices architecture with 15 services, service mesh, multi-region active-active deployment.

**Why it's wrong:**
Over-engineering creates unnecessary complexity. Complexity is a cost — it's harder to build, operate, debug, and maintain. The right architecture for 100K DAU is much simpler than the right architecture for 100M DAU. Starting over-engineered means you'll be maintaining complexity you don't need, and you'll miss simpler solutions to your actual problems.

**The right approach — progressive scaling:**
```
Phase 1 (MVP): Single app server + single database. Solves problems up to ~10K DAU.
Phase 2: Add read replicas + Redis cache. Solves ~100K DAU.
Phase 3: Add CDN, separate background workers. Solves ~1M DAU.
Phase 4: Add database sharding or switch to a distributed DB. Solves ~10M DAU.
Phase 5: Multi-region, full microservices if warranted. Solves ~100M+ DAU.
```

In an interview, design for the stated scale + 10× growth. Don't design for Google scale if the problem says 1M DAU.

---

## Mistake 11: Confusing Caching With Solving Consistency

**What it looks like:**
*"We'll just cache everything in Redis, so reads will be fast and we won't have any consistency problems."*

**Why it's wrong:**
Caching introduces a consistency problem, not solves it. Once you have a cache, you have two sources of truth. Any write to the database creates a window where the cache is stale. If your system requires strong read-after-write consistency, naive caching breaks it.

**The right approach:**
- Acknowledge that caching introduces staleness
- Define an acceptable staleness window for each data type
- Choose the right invalidation strategy: TTL (accept staleness up to TTL), event-driven invalidation (invalidate on write), or write-through (always update cache on write)
- For data that must be strongly consistent (account balance, inventory count), skip caching or use a very short TTL with explicit invalidation

---

## Mistake 12: Neglecting Idempotency for Critical Operations

**What it looks like:**
Payment system doesn't handle retries. If a network timeout occurs after the payment processor charges the card but before the confirmation is saved, retrying the request charges the card twice.

**Why it's wrong:**
Networks are unreliable. Processes crash. Retries are a fundamental mechanism in distributed systems. Any write operation that's not idempotent is a bug waiting to happen at scale.

**What to do instead:**
- Every mutating API endpoint should accept an idempotency key (`X-Idempotency-Key: <client-generated UUID>`)
- Server stores the idempotency key + response
- On retry: if key seen before, return the stored response without re-executing
- This pattern prevents double-charges, double-bookings, and duplicate order placements

---

## Summary Table

| Mistake | Root Cause | Fix |
|---|---|---|
| No requirements clarification | Eagerness to design | First 5 minutes: always ask clarifying questions |
| Depth before breadth | Detail-oriented thinking | High-level diagram first, then deep dive |
| No numbers | Vague reasoning | Estimate RPS, storage, cache size before designing |
| Single option presented | Unfamiliarity with tradeoffs | Always name 2 options and explain why you chose one |
| No failure scenarios | Happy-path thinking | For each component: "what if this dies?" |
| Ignoring NFRs | Feature-focused mindset | Explicitly address availability, consistency, latency |
| Passive conversation | Nerves, junior instinct | Drive the agenda; propose what to cover next |
| Wrong tool for data | SQL-first bias | Match data access pattern to the right storage type |
| Single points of failure | Simplification | Redundancy at every stateful layer |
| Over-engineering | Anxiety about appearing junior | Design for stated scale + 10×; add complexity with justification |
| Cache = consistency | Misunderstanding caching | Caching creates staleness; define the staleness policy |
| No idempotency | Ignoring distributed failure modes | Idempotency keys on all mutating operations |

---

## Key Takeaways

- **Process beats knowledge:** A candidate with a strong framework and average technical knowledge outperforms a candidate with deep knowledge but no structure
- **Numbers justify decisions:** Every architecture choice should trace back to an estimate
- **Tradeoffs show seniority:** "I chose X because Y, with the tradeoff of Z" is a senior engineer's answer
- **Failure thinking is non-optional:** Production systems fail; your design must account for it
- **Drive the conversation:** The interviewer is your collaborator, not your judge; treat it as a design discussion with a peer
- **Right-size the complexity:** Simple is better when it's sufficient; add complexity only when scale demands it

# CAP Theorem

## The three guarantees

In a distributed system you can only guarantee **two** of consistency, availability, and partition tolerance. The diagram below summarizes the three and the trade-off.

![CAP theorem: pick two of C, A, P](../assets/consistency/cap-theorem.png)

| Term | Meaning |
|------|--------|
| **Consistency** | Every read gets the most recent write or an error. |
| **Availability** | Every request gets a response (data may be stale). |
| **Partition tolerance** | The system keeps operating despite network partitions. |

Networks are unreliable, so **partition tolerance** is usually required. The real choice is between **consistency** and **availability**.

---

## CP (Consistency + Partition tolerance)

- If a partition occurs, the system may **time out** or refuse requests rather than return stale data.
- **Use when:** You need atomic reads and writes (e.g. financial ledger, inventory).

---

## AP (Availability + Partition tolerance)

- Every request gets a response; data may be an older version. Writes propagate when the partition heals.
- **Use when:** You can tolerate eventual consistency (e.g. social feed, session data) or must keep working during outages.

---

**Trade-off:** CP favors correctness under partition; AP favors responsiveness. Choose per workload.

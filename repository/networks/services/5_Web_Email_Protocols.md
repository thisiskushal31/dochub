# Web, Email & Application Protocols

[← Back to Services](./README.md)

WWW, electronic mail, and reference application protocols.

## Table of Contents

- [World Wide Web (WWW)](#world-wide-web-www)
- [Introduction to electronic mail](#introduction-to-electronic-mail)
- [FTP and TFTP](#ftp-and-tftp)
- [SMTP, POP3, IMAP](#smtp-pop3-imap)
- [Syslog](#syslog)
- [SNMP](#snmp)
- [NTP](#ntp)
- [LDAP](#ldap)
- [SIP, MQTT, NNTP, SMB](#sip-mqtt-nntp-smb)
- [References](#references)

---

## World Wide Web (WWW)

The **World Wide Web (WWW)** is a system of **interconnected web pages and information** that you access using the Internet. It was created to help people share and find information using **links** that connect different pages. Data may be in text, pictures, audio, or video. Users navigate by following links. All public websites that people access on their devices through the Internet are collectively the WWW (or W3). The Web allows browsing, video, shopping, and communication. Source: [GeeksforGeeks – World Wide Web (WWW)](https://www.geeksforgeeks.org/computer-networks/world-wide-web-www/).

**Key parts (from source):**

- **HTML** — Tells browsers how to display a page (text, pictures, links).
- **HTTP** — Rules for the browser and server to send and receive web pages. See [HTTP(S) & TLS](./3_Http_Tls.md).
- **URL** — Address of a page (e.g. https://www.example.com/).

**How it works:** A **web browser** requests pages from a **web server**; the server responds with the requested content. The model is **client–server**: browser = client, web server = server. Browsers can also be used for search, mail, and file transfer. **WWW vs Internet:** The **Web** is the collection of web pages and sites you access with a browser; the **Internet** is the global network that connects computers. The Web is one use of the Internet (like email or streaming).

**Evolution (from source):** Web 1.0 (1990–2000) static sites; Web 2.0 (2000–2010) interactive and social; Web 3.0 (2010–2020) semantic web, machines understanding data; Web 4.0 (2020–2030) intelligent, AI-powered.

---

## Introduction to electronic mail

**Electronic mail (email)** is a method of **exchanging digital messages** over the Internet. Messages are sent through **mail servers** using standard protocols. Each user has a **unique email address** (e.g. user@example.com). Email supports text, files, images, videos, and documents. Source: [GeeksforGeeks – Introduction to Electronic Mail](https://www.geeksforgeeks.org/computer-science-fundamentals/introduction-to-electronic-mail/).

**Key components (from source):**

- **User Agent (UA)** — Email client (e.g. Gmail, Outlook) to compose, send, read, and manage mail.
- **Mail server** — Central system that stores mail and manages transmission.
- **Message Transfer Agent (MTA)** — Routes mail from sender’s server to recipient’s server.
- **Mailbox** — Storage on the mail server for received mail until the user accesses it.
- **Spool file** — Temporary queue for outgoing mail before it is sent.

**Flow:** Compose → Send (SMTP) to sender’s server → MTA routes to recipient’s server (e.g. via DNS MX) → Delivery to recipient’s mailbox → Receive (IMAP/POP3) → Read in client.

---

## FTP and TFTP

**FTP (File Transfer Protocol)** provides **file transfer** between computers. A host running an **FTP client** connects to an **FTP server** to upload, download, and manage files (e.g. delete, rename). Source: Networking-Essentials (Cisco). FTP uses **two TCP ports**: **port 21** for the **control connection** (commands and replies), **port 20** for the **data connection** (file transfer). The client opens a session to port 21; data is transferred over port 20. FTP client software is built into OSes and many browsers; stand-alone FTP clients offer a GUI and more options. **FTP** is stateful and supports authentication; **FTPS** adds TLS.

**TFTP (Trivial File Transfer Protocol)** is a **simple, connectionless** file transfer protocol over **UDP port 69**. It has no authentication or directory listing; used for booting devices (e.g. PXE), firmware uploads, and simple transfers where minimal implementation is needed. No encryption.

```text
  FTP:  Client --[control, TCP 21]--> Server
        Client <--[data, TCP 20]--> Server   (upload/download)
  TFTP: Client <--[UDP 69]--> Server        (request/response only)
```

---

## SMTP, POP3, IMAP

**SMTP (Simple Mail Transfer Protocol)** — Used to **send** mail from the client to the sender’s mail server and **between mail servers** until the message reaches the recipient’s server. **Push** protocol; handles **outgoing** mail only. Commonly uses **ports 25** (plain), **587** (submission, often with TLS), **465** (implicit TLS). The local server decides whether the message is local or must be forwarded to another server (via SMTP). Source: GFG Electronic Mail, Networking-Essentials Email Protocols.

**POP3 (Post Office Protocol version 3)** — Used to **retrieve** mail by **downloading** it from the mail server to the user’s device. **Port 110** (plain), **995** (secure). Suited for **single device**; by default messages are **removed from the server** after download (configurable). Emails are stored locally for offline access.

**IMAP (Internet Message Access Protocol)** — Used to **access and manage** mail **on the server**; messages stay on the server and are **synchronized** across devices (read, delete, folders). **Port 143** (plain), **993** (secure). Ideal for multiple devices (phone, laptop, web). Source: GFG, Networking-Essentials.

```text
  Send:    Client --[SMTP]--> Sender's server --[SMTP]--> Recipient's server
  Retrieve: Client --[POP3 or IMAP]--> Mail server (mailbox)
```

---

## Syslog

**Syslog** is a standard for **logging** messages from devices (routers, switches, servers, applications). It is used for auditing, troubleshooting, and security. Messages are sent over **UDP port 514** (traditional) or **TCP** (reliable delivery, often port 514 or 6514 for TLS). There is no request–response; the device **pushes** log entries to one or more **syslog servers (collectors)**.

**Message format:** A syslog message typically includes **priority** (facility + severity), **timestamp**, **hostname**, **process**, and **message text**. Facility indicates the source (e.g. kernel, auth, network); severity is 0 (emergency) through 7 (debug). The server stores and can filter, search, and alert on messages. **Structured logging** (e.g. RFC 5424) adds structured data (key-value pairs) for easier parsing.

**Use in networks:** Routers and switches can log ACL hits, interface up/down, config changes, and authentication events. Sending logs to a central server preserves them if the device is replaced or compromised. In operations, syslog feeds SIEMs and runbooks (e.g. “if you see this message, do this”). See [observability](../Observability/README.md) for monitoring and incident workflows.

---

## SNMP

**SNMP (Simple Network Management Protocol)** is used to **monitor and manage** network devices: read counters (bytes in/out, errors, CPU), read/write configuration (e.g. set an interface admin state), and receive **traps** (asynchronous alerts when something happens, e.g. link down). It runs over **UDP**: **port 161** for requests (manager → agent), **port 162** for traps (agent → manager).

**Basics:** The **SNMP manager** (e.g. LibreNMS, Observium, PRTG) sends **GET** (single value), **GETNEXT** (walk a table), or **GETBULK** to the **SNMP agent** on the device. The agent holds a **MIB (Management Information Base)**—a tree of **OIDs (Object Identifiers)**. Each OID represents a counter, setting, or table (e.g. interface table). The manager uses the MIB to interpret numeric OIDs as names (e.g. ifInOctets). **SNMPv2c** uses **community strings** (plaintext) for read/write; **SNMPv3** adds authentication and encryption. For read-only monitoring, v2c is common; for write or over untrusted networks, v3 is preferred.

**Traps and informs:** The device sends a **trap** (v2c) or **inform** (v2c/v3, with acknowledgment) when an event occurs (link down, threshold exceeded). The manager must listen on 162 and map trap OIDs to actions (alert, ticket). See [Observability/6_Network_Operations](../Observability/6_Network_Operations.md) for how monitoring uses SNMP.

---

## NTP

**NTP (Network Time Protocol)** keeps clocks on devices and servers **synchronized** to a reference (e.g. Stratum 1 time servers). Accurate time is needed for **log correlation** (events from many devices must be ordered), **certificates** (validity windows), and **security** (e.g. Kerberos, token TTL). NTP runs over **UDP port 123**.

**Basics:** Clients send time queries to one or more NTP servers; the server responds with its time and round-trip estimate. The client **disciplines** its local clock (slew or step) to match. **Stratum**: Stratum 0 is the reference (e.g. GPS); Stratum 1 servers sync to it; Stratum 2 sync to Stratum 1, and so on. In networks, routers and switches are often NTP clients; they can also be NTP servers for the rest of the site. Use **authenticated NTP** when you need to trust the source. **Leap seconds** and **TAI** are handled by the protocol and OS. Misconfigured or unsynced time causes hard-to-debug issues in logs and auth; include NTP in baseline checks.

---

## LDAP

**LDAP (Lightweight Directory Access Protocol)** is used to **query and modify** directory services (e.g. user accounts, groups, org structure). It runs over **TCP**: **port 389** (plain), **port 636** (LDAPS, TLS). Applications use LDAP to **authenticate** users (e.g. bind with username/password), **look up** attributes (email, phone, group membership), and **search** the directory tree. Common in enterprise (Microsoft Active Directory, OpenLDAP) for single sign-on and identity stores. Data is organized in a **hierarchical tree** (DIT); entries are identified by **Distinguished Names (DN)**. See [Security/5_Firewalls_Aaa](../Security/5_Firewalls_Aaa.md) for 802.1X and RADIUS, which often use LDAP back ends.

---

## SIP, MQTT, NNTP, SMB

- **SIP (Session Initiation Protocol)** — Signaling for **VoIP** and real-time sessions (voice, video). Establishes, modifies, and terminates sessions; often used with RTP for media. **UDP/TCP 5060** (plain), **5061** (TLS). Gateways connect SIP to the PSTN. Source: Networking-Essentials (Internet phone calls).
- **MQTT (Message Queuing Telemetry Transport)** — **Publish–subscribe** messaging for **IoT** and constrained environments. Lightweight; TCP port **1883** (plain), **8883** (TLS). Clients publish to topics; subscribers receive by topic.
- **NNTP (Network News Transfer Protocol)** — **Usenet/newsgroup** articles. **TCP 119**. Read and post articles; less common than web forums today.
- **SMB (Server Message Block)** — **File and print sharing** on LANs. Windows (CIFS); **TCP 445**. Linux can use Samba. Provides access to files and printers over the network.

---

## References

- [GeeksforGeeks – World Wide Web (WWW)](https://www.geeksforgeeks.org/computer-networks/world-wide-web-www/)
- [GeeksforGeeks – Introduction to Electronic Mail](https://www.geeksforgeeks.org/computer-science-fundamentals/introduction-to-electronic-mail/)
- Networking-Essentials (Cisco): File Transfer Protocol, Email Protocols (SMTP, POP3, IMAP4)
- [HTTP(S) & TLS](./3_Http_Tls.md); [Security/5_Firewalls_Aaa](../Security/5_Firewalls_Aaa.md)

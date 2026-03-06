# Application Layer Overview

[← Back to Services](./README.md)

Application layer in OSI, client–server model, protocols overview.

## Table of Contents

- [Application layer in OSI model](#application-layer-in-osi-model)
- [Client–server model](#clientserver-model)
- [Protocols in application layer](#protocols-in-application-layer)
- [References](#references)

---

## Application layer in OSI model

The **application layer** (Layer 7) is the top of the OSI model. It is the **interface** between **user applications** and the network: it provides the services and protocols that let applications send and receive data (e.g. web, email, file transfer). Functions include **data representation** (formats like ASCII, JPEG, HTML), **network service access** (how apps use the network), **application protocols** (HTTP, FTP, SMTP, DNS, etc.), and **session management** (establishing and ending communication). It is the layer closest to the end user; protocols here define **message format**, **syntax**, and **expected responses** between client and server.

---

## Client–server model

At the application layer, the **client–server** model is dominant: a **client** (e.g. browser, email app) sends **requests** to a **server** (e.g. web server, mail server), which processes them and returns **responses**. The client initiates the connection (often using a transport endpoint such as TCP port 80 or 443); the server **listens** and serves many clients. This model underlies HTTP, SMTP, DNS, FTP, and most application protocols. For a fuller treatment, see [foundations/1_Basics_And_Architecture — Client–server architecture](../foundations/1_Basics_And_Architecture.md#clientserver-architecture).

---

## Protocols in application layer

Application layer protocols define how specific services work. Examples: **HTTP/HTTPS** (web, ports 80/443), **DNS** (name resolution, port 53), **FTP** (file transfer, 20/21), **SMTP** (sending email, 25/587), **DHCP** (IP assignment, 67/68), **TELNET/SSH** (remote login), **SNMP** (network management, 161/162), **NFS** (remote file access, 2049). Each protocol specifies message format, ports, and behaviour. See the topic files in this section: [DNS](./2_DNS.md), [HTTP(S) & TLS](./3_Http_Tls.md), [Load balancing & proxies](./4_Load_Balancing_Proxies.md), [Web, email & application protocols](./5_Web_Email_Protocols.md), [DHCP](./8_DHCP.md).

---

## References

- [GeeksforGeeks – Application Layer in OSI Model](https://www.geeksforgeeks.org/computer-networks/application-layer-in-osi-model/)
- [Foundations – Client–server](../foundations/1_Basics_And_Architecture.md#clientserver-architecture)

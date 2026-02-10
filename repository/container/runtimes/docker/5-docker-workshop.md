# Docker Workshop (hands-on)

[← Back to Docker deep dive](./README.md)

This page is a single place to do the full Docker learning path: containerize an app, update it, share it via a registry, persist a database, use bind mounts for development, run multi-container apps, and use Compose. Follow the steps here; use the links at the end only if you want the official workshop pages or extra detail.

## Table of Contents

- [Workshop path overview](#workshop-path-overview)
- [Part 1: Containerize an application](#part-1-containerize-an-application)
- [Part 2: Update the application](#part-2-update-the-application)
- [Part 3: Share the application](#part-3-share-the-application)
- [Part 4: Persist the database](#part-4-persist-the-database)
- [Part 5: Bind mounts for live code](#part-5-bind-mounts-for-live-code)
- [Part 6: Multi-container app](#part-6-multi-container-app)
- [Part 7: Docker Compose](#part-7-docker-compose)
- [Part 8: Image best practices](#part-8-image-best-practices)
- [References](#references)

---

## Workshop path overview

The workshop takes one application (e.g. a todo list or a simple web app) and step by step:

1. Put it in a container (Dockerfile, build, run).
2. Change the app and rebuild to see updates.
3. Push the image to a registry (Docker Hub or other).
4. Add a database and persist its data with a volume.
5. Use a bind mount so code changes are reflected without rebuilding.
6. Run app and database as two containers on a shared network.
7. Define the same stack in a Compose file and run it with one command.
8. Apply image best practices (minimal base, non-root, layers, multi-stage).

You can use the [getting-started todo app](https://github.com/docker/getting-started-todo-app) or any small app you have (Node, Python, etc.). The commands below are generic; adjust image names and paths to your project.

---

## Part 1: Containerize an application

**Goal:** Build an image from a Dockerfile and run the app in a container.

1. Have a project with a Dockerfile (e.g. `FROM node:20-alpine`, `WORKDIR /app`, `COPY` package and source, `RUN npm ci`, `EXPOSE 3000`, `CMD ["node", "server.js"]`).
2. Build and tag the image:
   ```bash
   docker build -t myapp:1.0 .
   ```
3. Run the container and publish the port:
   ```bash
   docker run -d -p 3000:3000 --name app myapp:1.0
   ```
4. Open [http://localhost:3000](http://localhost:3000) and confirm the app works. Then stop and remove: `docker stop app && docker rm app`.

---

## Part 2: Update the application

**Goal:** Change the app (e.g. text or a small feature), rebuild, and run again.

1. Edit the application code.
2. Rebuild (cache will reuse layers until the step where you copy code):
   ```bash
   docker build -t myapp:1.1 .
   ```
3. Run the new image:
   ```bash
   docker run -d -p 3000:3000 --name app myapp:1.1
   ```
4. Verify the change in the browser. Stop and remove the container when done.

---

## Part 3: Share the application

**Goal:** Push the image to a registry so others (or another machine) can pull and run it.

1. Log in to the registry (e.g. Docker Hub):
   ```bash
   docker login
   ```
2. Tag the image for the registry (replace `myusername` with your Docker Hub username or use another registry host):
   ```bash
   docker tag myapp:1.1 myusername/myapp:1.1
   ```
3. Push:
   ```bash
   docker push myusername/myapp:1.1
   ```
4. From another terminal or machine (after `docker login` if needed): `docker pull myusername/myapp:1.1` and `docker run -d -p 3000:3000 myusername/myapp:1.1`.

---

## Part 4: Persist the database

**Goal:** Run a database in a container and keep its data in a volume so it survives restarts.

1. Create a volume and run the database with it mounted at the data directory:
   ```bash
   docker volume create dbdata
   docker run -d --name db -e POSTGRES_PASSWORD=secret -v dbdata:/var/lib/postgresql/data postgres:16-alpine
   ```
2. Run your app and connect it to the database (use `--network` and the DB hostname, or link, depending on your app’s config). For a simple test, exec into the DB and create a table:
   ```bash
   docker exec -it db psql -U postgres -c "CREATE TABLE tasks (id SERIAL, title TEXT);"
   ```
3. Stop and remove the DB container, then start a new one with the same volume:
   ```bash
   docker stop db && docker rm db
   docker run -d --name db -e POSTGRES_PASSWORD=secret -v dbdata:/var/lib/postgresql/data postgres:16-alpine
   ```
4. Verify the data is still there: `docker exec -it db psql -U postgres -c "\\dt"`.

---

## Part 5: Bind mounts for live code

**Goal:** Mount the app source from the host so code changes are visible in the container without rebuilding.

1. Run the app with a bind mount of the source directory (and the same port and env for the DB if needed):
   ```bash
   docker run -d -p 3000:3000 -v $(pwd)/src:/app --name app myapp:1.1
   ```
   (If the app runs from `/app` and supports live reload, edits on the host will be picked up.)
2. Change a file on the host and confirm the app reflects the change (e.g. refresh the browser). Then stop and remove the container.

---

## Part 6: Multi-container app

**Goal:** Run the app and the database as two containers on one network so they can talk by name.

1. Create a network:
   ```bash
   docker network create appnet
   ```
2. Start the database on that network:
   ```bash
   docker run -d --name db --network appnet -e POSTGRES_PASSWORD=secret -v dbdata:/var/lib/postgresql/data postgres:16-alpine
   ```
3. Start the app on the same network; configure it to use hostname `db` and the DB port:
   ```bash
   docker run -d --name app --network appnet -p 3000:3000 -e DATABASE_HOST=db myapp:1.1
   ```
4. Use the app in the browser; then stop and remove both containers: `docker stop app db && docker rm app db`.

---

## Part 7: Docker Compose

**Goal:** Define the app and database in a `compose.yaml` and start everything with one command.

1. In your project directory, create `compose.yaml` (adjust image and env to match your app):
   ```yaml
   services:
     app:
       image: myapp:1.1
       ports:
         - "3000:3000"
       environment:
         DATABASE_HOST: db
       depends_on:
         - db
     db:
       image: postgres:16-alpine
       environment:
         POSTGRES_PASSWORD: secret
       volumes:
         - dbdata:/var/lib/postgresql/data
   volumes:
     dbdata: {}
   ```
2. Start the stack:
   ```bash
   docker compose up -d
   ```
3. Open the app, then tear down: `docker compose down`. Data in the volume remains; use `docker compose down -v` to remove volumes too.

---

## Part 8: Image best practices

**Goal:** Apply practices that keep images small, fast to build, and safer to run.

- **Base image:** Use a minimal base (e.g. `alpine`, `-slim`) when possible.
- **Layers:** Put dependency install (and rarely changing steps) first; copy app code last so code changes don’t invalidate the whole cache.
- **Single RUN:** Combine commands and clean up in one `RUN` (e.g. `apt-get update && apt-get install -y pkg && rm -rf /var/lib/apt/lists/*`).
- **Non-root:** Add a user and use `USER` so the container doesn’t run as root.
- **Multi-stage:** Use a build stage for compiling or building assets, then copy only the result into a minimal final image.

Revisit your Dockerfile and apply these; rebuild and run to confirm nothing breaks. Use the references below only when you want the official workshop pages or more examples.

---

## References

Use these only if you want the official workshop or extra detail.

- **Docker workshop:** [Workshop overview](https://docs.docker.com/get-started/workshop/), [Part 1: Containerize](https://docs.docker.com/get-started/workshop/02_our_app/), [Part 4: Persist data](https://docs.docker.com/get-started/workshop/05_persisting_data/), [Part 7: Compose](https://docs.docker.com/get-started/workshop/08_using_compose/), [Part 8: Best practices](https://docs.docker.com/get-started/workshop/09_image_best/), [Part 9: What next](https://docs.docker.com/get-started/workshop/10_what_next/)

[← Back to Docker deep dive](./README.md)

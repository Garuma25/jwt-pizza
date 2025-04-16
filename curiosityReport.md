# Curiosity Report: How Docker Works Under the Hood

## Why I Chose This Topic

Docker is one of those tools I use all the time, but I realized I didn’t actually know *how* it works behind the scenes. I can spin up containers and run services, but I couldn’t explain how Docker isolates processes or why it’s different from a virtual machine. So I got curious and decided to dig into it.

---

## What Even *Is* Docker?

Docker is a platform that lets you package your app and its dependencies into a lightweight, portable container. These containers can run pretty much anywhere—your laptop, a server, a cloud provider, etc.—and they’ll behave the same. It's super helpful for deployment and consistency across environments.

But the magic isn't in Docker itself—it's in the Linux features it builds on top of.

---

## How Docker Actually Works

Under the hood, Docker is just using Linux kernel features in a clever way:

- **Namespaces**  
  These isolate different aspects of a system (like processes, networking, user IDs). When you run a Docker container, it gets its own set of namespaces, which makes it *look* like it’s running on its own little computer, even though it’s just sharing the same kernel.

- **cgroups (Control Groups)**  
  These limit how much CPU, memory, and other resources a container can use. So if one container goes wild, it won’t take down your whole machine.

- **Union File Systems**  
  Docker images are built in layers (like your base image, then app code, then dependencies). This makes builds faster and more efficient since unchanged layers can be reused.

- **containerd**  
  Docker actually uses a container runtime behind the scenes called `containerd` (which itself uses `runc`). Docker is more like a wrapper that gives us nice commands like `docker run` or `docker build`.

---

## Docker vs Virtual Machines

Before Docker, people would spin up whole virtual machines to run apps. That meant booting a full OS every time, which is heavy and slow.

Docker skips that. Instead of emulating hardware, Docker containers just share the host OS’s kernel, which makes them way faster and more lightweight. You're not running a whole new computer—you’re just isolating a piece of the current one.

---

## Why This Matters in QA/DevOps

Understanding this helps me appreciate **why containers are so popular in modern DevOps**:

- Faster CI/CD pipelines (because containers start up fast)
- Easy to test in consistent environments
- Great for scaling microservices
- Helps avoid the “it works on my machine” problem

Plus, now I know Docker isn’t magic. It’s just clever use of Linux features wrapped in a nice UX.

---

## Final Thoughts

This deep dive made Docker feel less like a black box. I now know it’s not running tiny little computers—it’s just isolating processes with some smart kernel tricks. Knowing that makes me more confident when something breaks or when trying to optimize how containers run.

Definitely worth the curiosity trip.

---

*The more you understand your tools, the more powerful they become.*

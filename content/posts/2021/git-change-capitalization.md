---
title: Git 修改文件大小写
date: 2021-04-21
tag: Git
description: 今天和同事聊到 Git 是不区分大小写的，所以在写 React 组件的时候如果名称由 login 变成 Login，是看不到 git status 变化的。
---

# Git 修改文件大小写

今天和同事聊到 Git 是不区分大小写的，所以在写 React 组件的时候如果名称由 `login` 变成 `Login`，是看不到 `git status` 变化的。

好在 Git 给我们提供了 `git mv oldName newName` 的命令，方便我们重命名，本来以为事情简单解决了，但是在 `git mv login Login` 会报错 `fatal: renaming 'login' failed: Invalid argument`。

所以这里我们可以做个折中的操作

```bash

# 用 temp 来做一个中转就好啦
$ git mv login temp

$ git mv temp Login

```

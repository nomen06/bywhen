6#!/usr/bin/env node

import { loadTasks, saveTasks } from "./storage.js";

import { Command } from "commander";

const program = new Command();

program
  .name("bywhen")
  .description("CLI deadline tracker")
  .version("1.0.0");

program
.command("add <task> <date>")
.description("Add a new task with a deadline")
.action((task, date) => {
const tasks = loadTasks();


const newTask = {
id: tasks.length + 1,
task,
date,
done: false
};


tasks.push(newTask);
saveTasks(tasks);


console.log(`Added #${newTask.id}: ${task} (by ${date})`);
});

program
.command("list")
.description("List all tasks")
.action(() => {
const tasks = loadTasks();


if (tasks.length === 0) {
console.log("No tasks yet 🎉");
return;
}


tasks.forEach(t => {
const status = t.done ? "✔" : "✘";
console.log(`${t.id}. [${status}] ${t.task} (by ${t.date})`);
});
});

program
.command("done <id>")
.description("Mark a task as done")
.action((id) => {
const tasks = loadTasks();
const task = tasks.find(t => t.id === Number(id));


if (!task) {
console.log("Task not found ❌");
return;
}


task.done = true;
saveTasks(tasks);


console.log(`Marked #${id} as done ✔`);
});

program.parse(process.argv);

6

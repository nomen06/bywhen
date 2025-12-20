#!/usr/bin/env node

function isOverdue(dateStr) {
const today = new Date();
today.setHours(0, 0, 0, 0);


const due = new Date(dateStr);
return due < today;
}

import { loadData, saveData, clearTasks } from "./storage.js";
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
    const data = loadData();

    const newTask = {
      id: ++data.lastId,
      task,
      date,
      done: false
    };

    data.tasks.push(newTask);
    saveData(data);

    console.log(`Added #${newTask.id}: ${task} (by ${date})`);
  });


program
.command("list")
.description("List all tasks (sorted by deadline)")
.action(() => {
const { tasks } = loadData();

if (tasks.length === 0) {
console.log("Nothing to list");
return;
}


const sorted = [...tasks].sort(
(a, b) => new Date(a.date) - new Date(b.date)
);


sorted.forEach(t => {
const status = t.done ? "DONE!" : "TO-DO!";
const overdue = !t.done && isOverdue(t.date) ? "OVERDUE!!" : "";


console.log(`${t.id}. ${status}${overdue} — ${t.task} (by ${t.date})`);
});
});


program
.command("done <id>")
.action((id) => {
  const data = loadData();        // ✅ define data
  const task = data.tasks.find(t => t.id === Number(id));

  if (!task) {
    console.log("Task not found");
    return;
  }

  task.done = true;
  saveData(data);                 // ✅ now valid
  console.log(`Marked task #${id} as done`);
});



program
  .command("clear")
  .description("Remove all tasks")
  .option("--yes", "Confirm deletion")
  .action((options) => {
    if (!options.yes) {
      console.log("Warning!-This will delete all tasks.");
      console.log("Use: bywhen clear --yes to confirm.");
      return;
    }

    clearTasks();
    console.log("All tasks cleared");
  });


program.parse(process.argv);


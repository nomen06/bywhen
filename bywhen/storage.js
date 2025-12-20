import fs from "fs";
import path from "path";
import os from "os";

const dataFile = path.join(os.homedir(), ".bywhen", "data.json");

function initData() {
  return { lastId: 0, tasks: [] };
}

export function loadData() {
  if (!fs.existsSync(dataFile)) return initData();
  return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
}

export function saveData(data) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export function clearTasks() {
  saveData(initData());
}

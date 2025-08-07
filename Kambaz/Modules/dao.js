import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export function updateModule(moduleId, moduleUpdates) {  return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
}
export function deleteModule(moduleId) {
    return model.deleteOne({ _id: moduleId });
  //const { modules } = Database;
  //Database.modules = modules.filter((module) => module._id !== moduleId);
}
export function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
  // Database.modules = [...Database.modules, newModule];
  // return newModule;
}
export function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
  // const { modules } = Database;
  // return modules.filter((module) => module.course === courseId);
}

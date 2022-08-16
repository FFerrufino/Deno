import { Router } from "../../deps.ts";
import {
  findAll,
  findProd,
  createProd,
  updateProd,
  deleteProd,
} from "../handlers/prods.handler.ts";

export const router = new Router()
  .get("/api/prods", findAll)
  .get("/api/prods/:prodId", findProd)
  .post("/api/prods", createProd)
  .put("/api/prods/:prodId", updateProd)
  .delete("/api/prods/:prodId", deleteProd);

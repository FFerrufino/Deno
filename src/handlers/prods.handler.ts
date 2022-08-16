import { Context, helpers } from "../../deps.ts";
import logger from "../middlewares/logger.prods.ts";
import { Prod } from "../types/prods.type.ts";
import dbConn from "../middlewares/mongo.conn.ts";

const prods = dbConn.collection<Prod>("prods");

export const findAll = async (ctx: Context) => {
  try {
    ctx.response.status = 200;
    logger.debug(`status: ${ctx.response.status} method: findAll handler`);

    const resprods = await prods.find({}).toArray();
    ctx.response.body = await { code: "00", data: resprods };
  } catch (error) {
    ctx.response.status = 500;

    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { code: "99", msg: error };
  }
};

export const findProd = async (ctx: Context) => {
  try {
    const { prodId } = helpers.getQuery(ctx, { mergeParams: true });
    const prod = await prods.findOne({ uuid: prodId });

    if (prod) {
      ctx.response.body = await { code: "00", data: prod };
    } else {
      ctx.response.body = await {
        code: "01",
        msg: `Usuario con id ${prodId} no encontrado.`,
      };
    }
  } catch (error) {
    ctx.response.status = 500;

    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { code: "99", msg: error };
  }
};

export const createProd = async (ctx: Context) => {
  try {
    ctx.response.status = 201;
    logger.debug(`status: ${ctx.response.status} method: createProd handler`);

    const { name, description } = await ctx.request.body().value;

    const resProds = await prods.find({}).toArray();

    let newId = 0;
    if (resProds.length > 0) {
      newId = Number(resProds[resProds.length - 1].uuid) + 1;
    } else {
      newId = 1;
    }

    const prod: Prod = {
      uuid: newId.toString(),
      name: name,
      description: description,
    };
    await prods.insertOne(prod);

    ctx.response.body = await { code: "00", data: prod };
  } catch (error) {
    ctx.response.status = 500;

    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { code: "99", msg: error };
  }
};

export const updateProd = async (ctx: Context) => {
  try {
    ctx.response.status = 202;
    logger.debug(`status: ${ctx.response.status} method: updateprod handler`);

    const { prodId } = helpers.getQuery(ctx, { mergeParams: true });
    const prod = await prods.findOne({ uuid: prodId });

    if (prod) {
      const { name, description } = await ctx.request.body().value;
      await prods.updateOne(
        { uuid: prodId },
        { $set: { name: name, description: description } }
      );
      ctx.response.body = {
        code: "00",
        data: { uuid: prodId, name, description },
      };
    } else {
      ctx.response.body = {
        code: "01",
        msg: `Usuario con id ${prodId} no encontrado.`,
      };
    }
  } catch (error) {
    ctx.response.status = 500;

    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { msg: error };
  }
};

export const deleteProd = async (ctx: Context) => {
  try {
    ctx.response.status = 200;
    logger.debug(`status: ${ctx.response.status} method: deleteProd handler`);

    const { prodId } = helpers.getQuery(ctx, { mergeParams: true });
    const prod = await prods.findOne({ uuid: prodId });

    if (prod) {
      await prods.deleteOne({ uuid: prodId });

      ctx.response.body = {
        code: "00",
        msg: `Usuario con id ${prodId} eliminado`,
      };
    } else {
      ctx.response.body = {
        code: "01",
        msg: `Usuario con id ${prodId} no encontrado.`,
      };
    }
  } catch (error) {
    ctx.response.status = 500;

    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { msg: error };
  }
};

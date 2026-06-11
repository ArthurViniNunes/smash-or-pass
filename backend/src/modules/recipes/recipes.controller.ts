import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  RecipesService,
} from "./recipes.service";

import {
  createRecipeSchema,
  recipeIdParamSchema,
  updateRecipeSchema,
} from "./recipes.schemas";

import {
  getAuthUser,
} from "../../utils/get-auth-user";

export class RecipesController {
  private service =
    new RecipesService();

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user =
        getAuthUser(req);

      const data =
        createRecipeSchema.parse(
          req.body
        );

      const recipe =
        await this.service.create(
          user.id,
          data
        );

      return res
        .status(201)
        .json(recipe);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
        const recipes =
        await this.service.findAll();

        return res.json(recipes);
    } catch (error) {
        next(error);
    }
    };

    findById = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
        const { id } =
        recipeIdParamSchema.parse(
            req.params
        );

        const recipe =
        await this.service.findById(
            id
        );

        return res.json(recipe);
    } catch (error) {
        next(error);
    }
    };
  
  getSwipeFeed = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
      const cursor = req.query.cursor as string | undefined;

      const feed = await this.service.getSwipeFeed(
        req.user!.id,
        cursor
      );

      return res.json(feed);
    } catch (err) {
      next(err);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } =
        recipeIdParamSchema.parse(
          req.params
        );

      const user =
        getAuthUser(req);

      const data =
        updateRecipeSchema.parse(
          req.body
        );

      const recipe =
        await this.service.update(
          id,
          user.id,
          user.role,
          data
        );

      return res.json(recipe);
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } =
        recipeIdParamSchema.parse(
          req.params
        );

      const user =
        getAuthUser(req);

      await this.service.delete(
        id,
        user.id,
        user.role
      );

      return res
        .status(204)
        .send();
    } catch (error) {
      next(error);
    }
  };
}
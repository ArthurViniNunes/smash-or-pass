import { redisCache } from "./redis-cache.service";

const CACHE_TTL_SECONDS = 300;
const RECIPES_LIST_KEY = "recipes:approved:list";

function recipeDetailsKey(recipeId: string): string {
  return `recipes:approved:${recipeId}`;
}

export const recipeCache = {
  async getList<T>(): Promise<T | null> {
    return redisCache.get<T>(RECIPES_LIST_KEY);
  },

  async setList(value: unknown): Promise<void> {
    await redisCache.set(
      RECIPES_LIST_KEY,
      value,
      CACHE_TTL_SECONDS
    );
  },

  async getById<T>(
    recipeId: string
  ): Promise<T | null> {
    return redisCache.get<T>(
      recipeDetailsKey(recipeId)
    );
  },

  async setById(
    recipeId: string,
    value: unknown
  ): Promise<void> {
    await redisCache.set(
      recipeDetailsKey(recipeId),
      value,
      CACHE_TTL_SECONDS
    );
  },

  async invalidate(recipeId?: string): Promise<void> {
    const keys = [RECIPES_LIST_KEY];

    if (recipeId) {
      keys.push(recipeDetailsKey(recipeId));
    }

    await redisCache.delete(...keys);
  },
};
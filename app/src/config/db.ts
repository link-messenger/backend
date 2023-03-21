import mongoose from "mongoose";
import { createClient, RedisClientType } from "redis";
import { getEnv } from "../utils";

export const connectMongo = async () => {
  const MONGO_URI = getEnv('MONGO_URL');
  return mongoose.connect(MONGO_URI, {
		autoIndex: getEnv('NODE_ENV') === 'development',
	});
}

let redisClient: RedisClientType | null = null; 

export const connectRedis = async () => {
  redisClient = createClient();
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
  return redisClient;
}

export const getRedisClient = () => {
  if (!redisClient) throw new Error('Redis client not connected');
  return redisClient;
}
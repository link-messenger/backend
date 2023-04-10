import { Client } from 'minio';
import { getEnv } from '../utils';

class ObjectStorage {
	private static instance: ObjectStorage;
	private client: Client;

	private constructor() {
		this.client = new Client({
			endPoint: getEnv('MINIO_ENDPOINT'),
			accessKey: getEnv('MINIO_ACCESS'),
			secretKey: getEnv('MINIO_SECRET'),
			useSSL: true,
			port: parseInt(getEnv('MINIO_PORT')),
		});
  }
  
  public static getInstance(): ObjectStorage {
    if (!ObjectStorage.instance) {
      ObjectStorage.instance = new ObjectStorage();
    }
    return ObjectStorage.instance;
	}
}

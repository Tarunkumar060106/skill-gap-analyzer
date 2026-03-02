import { Client, Account, Databases, Storage, ID } from 'appwrite';

const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || 'dummy-project-id',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'dummy-database-id',
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users',
  testsCollectionId: import.meta.env.VITE_APPWRITE_TESTS_COLLECTION_ID || 'test_results',
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID || 'student-id-cards',
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, appwriteConfig };

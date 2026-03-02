import { account, databases, storage, ID, appwriteConfig } from '../lib/appwrite';

// Dummy data fallback
let dummyUser = null;
let dummySession = null;
let dummyUserDoc = null;
const dummyTestResults = [
  {
    $id: 't1',
    userId: 'student-1',
    testName: 'Full Stack Development Assessment',
    score: 68,
    readinessLevel: 'Intermediate',
    weakSkills: ['State Management', 'System Design'],
    createdAt: '2024-02-01T10:00:00.000Z'
  },
  {
    $id: 't2',
    userId: 'student-1',
    testName: 'Frontend Proficiency Test',
    score: 75,
    readinessLevel: 'Industry Ready',
    weakSkills: ['Animation', 'SEO'],
    createdAt: '2024-02-15T14:30:00.000Z'
  },
  {
    $id: 't3',
    userId: 'student-1',
    testName: 'Backend & API Security',
    score: 82,
    readinessLevel: 'Industry Ready',
    weakSkills: ['Rate Limiting'],
    createdAt: '2024-03-01T09:15:00.000Z'
  }
];
const dummyVerifications = [
  {
    $id: 'v1',
    userId: 'student-1',
    fullName: 'Student User',
    regNo: 'REG123',
    department: 'Computer Science',
    verificationStatus: 'verified',
    idCardUrl: 'https://via.placeholder.com/300x200?text=ID+Card'
  },
  {
    $id: 'v2',
    userId: 'student-2',
    fullName: 'Jane Smith',
    regNo: 'CS2023045',
    department: 'Information Technology',
    verificationStatus: 'pending',
    idCardUrl: 'https://via.placeholder.com/400x300?text=Jane+Smith+ID',
    createdAt: new Date().toISOString()
  }
];

// Auth Service
export const login = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    if (appwriteConfig.projectId === 'dummy-project-id') {
      console.log('Using dummy login');
      if (email === 'mentor@test.com' && password === 'password') {
        dummySession = { userId: 'mentor-1', role: 'mentor' };
        dummyUser = { $id: 'mentor-1', email, name: 'Mentor User' };
        dummyUserDoc = { userId: 'mentor-1', fullName: 'Mentor User', role: 'mentor' };
        return dummySession;
      }
      
      dummySession = { userId: 'student-1', role: 'student' };
      dummyUser = { $id: 'student-1', email, name: 'Student User' };
      if (!dummyUserDoc) {
        dummyUserDoc = { 
          userId: 'student-1', 
          fullName: 'Student User', 
          regNo: 'REG123', 
          department: 'Computer Science', 
          year: '3rd Year', 
          email: email, 
          verificationStatus: 'verified', 
          createdAt: new Date().toISOString(),
          role: 'student'
        };
      }
      return dummySession;
    }
    throw error;
  }
};

export const register = async (email, password, name, extraData) => {
  try {
    const userAccount = await account.create(ID.unique(), email, password, name);
    // Login to get session
    await account.createEmailPasswordSession(email, password);
    // Create User Document
    const userDoc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        userId: userAccount.$id,
        fullName: name,
        regNo: extraData.regNo,
        department: extraData.department,
        year: extraData.year,
        email: email,
        verificationStatus: 'pending',
        createdAt: new Date().toISOString()
      }
    );
    return userDoc;
  } catch (error) {
    if (appwriteConfig.projectId === 'dummy-project-id') {
      console.log('Using dummy register');
      dummyUser = { $id: ID.unique(), email, name };
      dummySession = { userId: dummyUser.$id };
      dummyUserDoc = {
        userId: dummyUser.$id,
        fullName: name,
        regNo: extraData.regNo,
        department: extraData.department,
        year: extraData.year,
        email: email,
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
        role: 'student'
      };
      return dummyUserDoc;
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const userDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [`equal("userId", "${currentAccount.$id}")`]
    );

    return { account: currentAccount, profile: userDocs.documents[0] };
  } catch (error) {
    if (appwriteConfig.projectId === 'dummy-project-id' && dummySession) {
      console.log('Using dummy user');
      return { account: dummyUser, profile: dummyUserDoc };
    }
    return null;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    if (appwriteConfig.projectId === 'dummy-project-id') {
      console.log('Using dummy logout');
      dummySession = null;
      dummyUser = null;
      return true;
    }
    throw error;
  }
};

// Storage Service
export const uploadIdCard = async (file) => {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    if (appwriteConfig.projectId === 'dummy-project-id') {
      console.log('Using dummy upload');
      return { $id: 'dummy-file-id', url: URL.createObjectURL(file) };
    }
    throw error;
  }
};

export const updateUserVerification = async (userId, fileId) => {
  try {
    // Find doc by userId (assuming we have logic to find exactly the doc ID), or just search and update
    const docs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [`equal("userId", "${userId}")`]
    );
    if(docs.documents.length > 0) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        docs.documents[0].$id,
        { verificationStatus: 'pending', fileId }
      );
    }
  } catch (error) {
    if (appwriteConfig.projectId === 'dummy-project-id') {
      console.log('Using dummy update verification');
      if (dummyUserDoc && dummyUserDoc.userId === userId) {
        dummyUserDoc.verificationStatus = 'pending';
        // Add to mentor reviews
        const exists = dummyVerifications.find(v => v.userId === userId);
        if(!exists) {
            dummyVerifications.push({
                $id: ID.unique(),
                userId: userId,
                fullName: dummyUserDoc.fullName,
                regNo: dummyUserDoc.regNo,
                department: dummyUserDoc.department,
                verificationStatus: 'pending',
                idCardUrl: 'https://via.placeholder.com/300x200?text=Uploaded+ID'
            });
        }
      }
      return true;
    }
    throw error;
  }
};

// Mentor actions
export const getPendingVerifications = async () => {
    try {
        const docs = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [`equal("verificationStatus", "pending")`]
        );
        return docs.documents;
    } catch(err) {
        if (appwriteConfig.projectId === 'dummy-project-id') {
            return dummyVerifications.filter(v => v.verificationStatus === 'pending');
        }
        throw err;
    }
}

export const reviewVerification = async (userId, status) => {
    try {
        const docs = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [`equal("userId", "${userId}")`]
        );
        if(docs.documents.length > 0) {
            await databases.updateDocument(
              appwriteConfig.databaseId,
              appwriteConfig.usersCollectionId,
              docs.documents[0].$id,
              { verificationStatus: status }
            );
        }
    } catch(err) {
        if (appwriteConfig.projectId === 'dummy-project-id') {
            if(dummyUserDoc && dummyUserDoc.userId === userId) {
                dummyUserDoc.verificationStatus = status;
            }
            const v = dummyVerifications.find(v => v.userId === userId);
            if(v) v.verificationStatus = status;
            return true;
        }
        throw err;
    }
}

// Test / Database
export const saveTestResult = async (data) => {
  try {
    const result = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.testsCollectionId,
      ID.unique(),
      data
    );
    return result;
  } catch (error) {
    if (appwriteConfig.projectId === 'dummy-project-id') {
      console.log('Using dummy save test');
      const doc = { ...data, $id: ID.unique(), createdAt: new Date().toISOString() };
      dummyTestResults.push(doc);
      return doc;
    }
    throw error;
  }
};

export const getTestResults = async (userId) => {
  try {
    const results = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.testsCollectionId,
      [`equal("userId", "${userId}")`]
    );
    return results.documents;
  } catch (error) {
    if (appwriteConfig.projectId === 'dummy-project-id') {
      return dummyTestResults.filter(r => r.userId === userId);
    }
    throw error;
  }
};

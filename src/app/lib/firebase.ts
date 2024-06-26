import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const init = () => {
  const apps = getApps();

  if (apps.length > 0) return;

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: "mmosh-app",
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  };

  initializeApp(firebaseConfig);
};

export const uploadFile = async (file: File, name: string): Promise<string> => {
  const storage = getStorage();

  const storageRef = ref(
    storage,
    `profile/${name}-${new Date().getTime()}.png`,
  );

  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);
};

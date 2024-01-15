import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const init = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyC0b9E2BeKQIjJkyWG5aDz1ij2ytb3SqPU",
    authDomain: "mmosh-app.firebaseapp.com",
    projectId: "mmosh-app",
    storageBucket: "mmosh-app.appspot.com",
    messagingSenderId: "1055598871582",
    appId: "1:1055598871582:web:6b34f891ede606e330da0f",
    measurementId: "G-6N7WZNRFVT",
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

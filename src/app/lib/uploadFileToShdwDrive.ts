import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { ShadowFile, ShdwDrive } from "@shadow-drive/sdk";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { v4 as uuidv4 } from "uuid";
import Config from "./../../anchor/web3Config.json";
import {File as BackendFile, Blob as BackendBlob} from '@web-std/file';

export const pinFileToShadowDrive = async (jsonData: any) => {
  try {
    const privateKey = process.env.NEXT_PUBLIC_SHDW_PRIVATE!;
    const private_buffer = bs58.decode(privateKey);
    const private_arrray = new Uint8Array(
      private_buffer.buffer,
      private_buffer.byteOffset,
      private_buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT,
    );
    const keypair = Keypair.fromSecretKey(private_arrray);
    const drive = await new ShdwDrive(
      new Connection(Config.mainRpcURL),
      new NodeWallet(keypair),
    ).init();

    const accounts = await drive.getStorageAccounts();
    let acc_str:any = process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY;
    const acc = new PublicKey(acc_str);

    const blobData = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const fileName = uuidv4() + ".json";
    const file = new File([blobData], fileName, { type: "application/json" });

    const upload = await drive.uploadFile(acc, file);
    return upload.finalized_locations[0];
  } catch (error) {
    console.log("error", error);
    return "";
  }
};


export const pinFileToShadowDriveUrl = async (jsonData: any) => {
  try {
    const privateKey: any = process.env.NEXT_PUBLIC_SHDW_PRIVATE;
    let private_buffer = bs58.decode(privateKey);
    let private_arrray = new Uint8Array(
      private_buffer.buffer,
      private_buffer.byteOffset,
      private_buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT,
    );
    const keypair = Keypair.fromSecretKey(private_arrray);
    const drive = await new ShdwDrive(
      new Connection(Config.mainRpcURL),
      new NodeWallet(keypair),
    ).init();

    const accounts = await drive.getStorageAccounts();
    let acc_str:any = process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY;
    const acc = new PublicKey(acc_str);
    
    const blobData = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const fileName = uuidv4() + ".json";
    const file = new File([blobData], fileName, { type: "application/json" });

    const upload = await drive.uploadFile(acc, file);
    return upload.finalized_locations[0];
  } catch (error) {
    console.log("error", error);
    return "";
  }
};

export const pinFileToShadowDriveWithName = async (jsonData: any, name: any) => {
  try {
    const privateKey = process.env.NEXT_PUBLIC_SHDW_PRIVATE!;
    const private_buffer = bs58.decode(privateKey);
    const private_arrray = new Uint8Array(
      private_buffer.buffer,
      private_buffer.byteOffset,
      private_buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT,
    );
    const keypair = Keypair.fromSecretKey(private_arrray);
    const drive = await new ShdwDrive(
      new Connection(Config.mainRpcURL),
      new NodeWallet(keypair),
    ).init();

    const accounts = await drive.getStorageAccounts();
    let acc_str:any = process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY;
    const acc = new PublicKey(acc_str);

    const blobData = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const file = new File([blobData], name, { type: "application/json" });

    const upload = await drive.uploadFile(acc, file);
    return upload.finalized_locations[0];
  } catch (error) {
    console.log("error", error);
    return "";
  }
};

export const pinFileToShadowDriveBackend = async (jsonData: any, name:any) => {
  try {
    const privateKey = process.env.NEXT_PUBLIC_SHDW_PRIVATE!;
    const private_buffer = bs58.decode(privateKey);
    const private_arrray = new Uint8Array(
      private_buffer.buffer,
      private_buffer.byteOffset,
      private_buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT,
    );
    const keypair = Keypair.fromSecretKey(private_arrray);
    const drive = await new ShdwDrive(
      new Connection(Config.mainRpcURL),
      new NodeWallet(keypair),
    ).init();

    let acc_str:any = process.env.NEXT_PUBLIC_SHDW_DRIVE_PUB_KEY;
    const acc = new PublicKey(acc_str);

    const blobData = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const arrayBuffer = await blobData.arrayBuffer();
    const fileName = uuidv4() + ".json";
    const fileToUpload: ShadowFile = {
      name: fileName,
      file: Buffer.from(arrayBuffer),
      };
    const upload = await drive.uploadFile(acc, fileToUpload);
    return upload.finalized_locations[0];
  } catch (error) {
    console.log("error", error);
    return "";
  }
};
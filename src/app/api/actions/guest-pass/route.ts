/**
 * Solana Actions Example
 */

import {
    ActionPostResponse,
    createPostResponse,
    ActionGetResponse,
    ActionPostRequest,
    createActionHeaders,
    ActionError,
  } from "@solana/actions";
  import {
    Authorized,
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    StakeProgram,
    Transaction,
  } from "@solana/web3.js";
  import { Connectivity as ProjectConn } from "@/anchor/community";
  import * as anchor from "@coral-xyz/anchor";
import { web3Consts } from "@/anchor/web3Consts";
import axios from "axios";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { pinFileToShadowDrive } from "@/app/lib/uploadFileToShdwDrive";
  

  const headers = createActionHeaders();
  
  export const GET = async (req: Request) => {
    try {
      let projectInfo:any = await axios.get("/api/project/detail?symbol=PTVG")
      const requestUrl = new URL(req.url);
      const {isValid, tokenInfo} = await validatedQueryParams(requestUrl, projectInfo.data);

      if(!isValid) {
        let actionError: ActionError = { message: "Project validation failed" };
        return Response.json(actionError, {
          status: 400,
          headers,
        });
      }
  
      const baseHref = new URL(
        `/api/actions/guest-pass?referer=${requestUrl.searchParams.get("referer")}`,
        requestUrl.origin,
      ).toString();
  
      const payload: ActionGetResponse = {
        type: "action",
        title: "Pump The Vote and Earn Crypto Rewards!",
        icon: "https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Blue.png",
        description: `Pump The Vote is the world’s first PolitiFi Super PAC. Mint your free Guest Pass, create your own political memecoins (free!) and earn 3% of all the trading fees!. Enter your first name or alias and email address, and we’ll send you details on how to claim $20 in crypto to start trading political memecoins today. Not only that, you’ll get your own Blink In Bio that you can share for additional crypto referral rewards. Drop us your Telegram and X usernames for extra valuable giveaways!`,
        label: "Mint Option", // this value will be ignored since `links.actions` exists
        links: {
          actions: [
            {
              label: "Stake 1 SOL", // button text
              href: `${baseHref}&amount=${"1"}`,
            },
            {
              label: "Stake 5 SOL", // button text
              href: `${baseHref}&amount=${"5"}`,
            },
            {
              label: "Stake 10 SOL", // button text
              href: `${baseHref}&amount=${"10"}`,
            },
            {
              label: "Mint Pass", // button text
              href: `${baseHref}&name={name}&email={email}&telegram={telegram}&twitter={twitter}&type={type}`, // this href will have a text input
              parameters: [
                {
                  type: "select",
                  name: "type", 
                  label: "Pass type", 
                  required: true,
                  options:[{
                    label: "Mint Blue Pass",
                    value: "Blue",
                    selected: true
                  },{
                    label: "Mint Red Pass",
                    value: "Red",
                    selected: true
                  }]
                },
                {
                  type:"text",
                  name: "name", 
                  label: "Enter your first name or alias", 
                  required: true,
                },
                {
                  type: "email",
                  name: "email", 
                  label: "Enter your email address to claim rewards", 
                  required: true,
                },
                {
                  type: "url",
                  name: "telegram", 
                  label: "Enter your Telegram username for bonus rewards", 
                  required: false,
                },
                {
                  type: "url",
                  name: "twitter", 
                  label: "Enter your X username for extra bonus rewards", 
                  required: false,
                },
              ],
            },
          ],
        },
      };
  
      return Response.json(payload, {
        headers,
      });
    } catch (err) {
      console.log(err);
      let actionError: ActionError = { message: "An unknown error occurred" };
      if (typeof err == "string") actionError.message = err;
      return Response.json(actionError, {
        status: 400,
        headers,
      });
    }
  };
  
  // DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
  // THIS WILL ENSURE CORS WORKS FOR BLINKS
  export const OPTIONS = async () => Response.json(null, { headers });
  
  export const POST = async (req: Request) => {
    try {
      let projectInfo:any = await axios.get("/api/project/detail?symbol=PTVG")
      const requestUrl = new URL(req.url);
      const {isValid, tokenInfo} = await validatedQueryParams(requestUrl, projectInfo.info);
      if(!isValid) {
        let actionError: ActionError = { message: "Project validation failed" };
        return Response.json(actionError, {
          status: 400,
          headers,
        });
      }
  
      const body: ActionPostRequest = await req.json();
  
      // validate the client provided input
      let account: PublicKey;
      try {
        account = new PublicKey(body.account);
      } catch (err) {
        throw 'Invalid "account" provided';
      }
      let rpcUrl:any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
      let connection = new Connection(rpcUrl)
      let wallet = new NodeWallet(new Keypair());
      const env = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
      });
      let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(projectInfo.project.key));
      let type= requestUrl.searchParams.get("type")
      const metaBody = {
        name:  type === "Red" ? "Pump The Vote Red" : "Pump The Vote Blue",
        symbol: type === "Red" ? "PTVR" : "PTVB",
        description: type === "Red" ? "Pump The Vote is a PolitiFi project within the MMOSH ecosystem. The Pump The Vote Red project pass is for conservatives united by a desire to protect and strengthen the principles that we believe have made America a great and prosperous nation, such as the principles of limited government, personal responsibility, and the preservation of traditional values. We are proponents of fiscal responsibility, advocating for lower taxes, reduced government spending, and balanced budgets to promote economic growth and ensure long-term sustainability." : "Pump The Vote is a PolitiFi project within the MMOSH ecosystem. The Pump The Vote Blue project pass is for progressives who are deeply committed to the principles of social justice, equality, and the protection of individual rights. We believe in a government that plays an active role in ensuring that all citizens have access to essential services like healthcare, education, and economic opportunities, and that it should work to reduce disparities and promote fairness in society. We are united by a vision of an inclusive America where government acts as a force for good, ensuring that every person has the opportunity to succeed and live a life of dignity, respect and personal freedom.",
        image: type === "Blue" ? "https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Blue.png" : "https://shdw-drive.genesysgo.net/Ejpot7jAYngByq5EgjvgEMgqJjD8dnjN4kSkiz6QJMsH/Pump%20the%20Vote%20Square%20Icon%20Only%20Red.png",
        enternal_url: process.env.NEXT_PUBLIC_APP_MAIN_URL + "create/project/" + projectInfo.data.project.symbol,
        family: "MMOSH",
        collection: "MMOSH Pass Collection",
        attributes: [
          {
            trait_type: "Project",
            value:projectInfo.data.project.key,
          },
          {
            trait_type: "Primitive",
            value:"Pass",
          },
          {
            trait_type: "Ecosystem",
            value:"MMOSH",
          },
          {
            trait_type: "Founder",
            value:"Moto",
          },
          {
            trait_type: "Seniority",
            value:projectInfo.data.project.seniority + 1,
          },
          {
            trait_type: "Party",
            value: type,
          },
          {
            trait_type: "Website",
            value:type === "Red" ? "https://www.pumpthevote.red" : "https://www.pumpthevote.blue",
          },
          {
            trait_type: "Telegram",
            value:projectInfo.data.project.telegram,
          },
          {
            trait_type: "X",
            value:projectInfo.data.project.twitter,
          },
        ],
    };

    const passMetaURI: any = await pinFileToShadowDrive(metaBody);

    let result = await projectConn.mintGuestPassTx({
      name: metaBody.name,
      symbol: metaBody.symbol,
      uriHash: passMetaURI,
      genesisProfile: projectInfo.data.project.key,
      commonLut: projectInfo.data.projec.lut
    },"");

    if(result.Ok?.info?.profile) {
      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction: result.Ok?.info?.profile,
          message: ``,
        },
        signers: [],
      });
      return Response.json(payload, {
        headers,
      });
    } else {
      let actionError: ActionError = { message: "Transaction preparation failed" };
      return Response.json(actionError, {
        status: 400,
        headers,
      });
    }
    } catch (err) {
      console.log(err);
      let actionError: ActionError = { message: "An unknown error occurred" };
      if (typeof err == "string") actionError.message = err;
      return Response.json(actionError, {
        status: 400,
        headers,
      });
    }
  };
  
  async function validatedQueryParams(requestUrl: URL, projectInfo:any) {
    try {
      if (requestUrl.searchParams.get("referer")) {
        let rpcUrl:any = process.env.NEXT_PUBLIC_SOLANA_CLUSTER;
        let connection = new Connection(rpcUrl)
        let wallet = new NodeWallet(new Keypair());
        const env = new anchor.AnchorProvider(connection, wallet, {
          preflightCommitment: "processed",
        });
        let projectConn: ProjectConn = new ProjectConn(env, web3Consts.programID, new anchor.web3.PublicKey(projectInfo.project.key));
        let pass = new PublicKey(requestUrl.searchParams.get("referer")!);
        let tokenInfo = await projectConn.metaplex.nfts().findByMint({
          mintAddress: pass
        })
        let creator = tokenInfo.creators[0].address
        let userInFo:any = await axios.get("/api/get-wallet-data?wallet="+creator)
        if(userInFo.data.profilenft) {
          return {
            isValid: true,
            tokenInfo: tokenInfo
          }
        }
      } 
      return {
        isValid: false,
        tokenInfo: null
      }
    } catch (err) {
      return {
        isValid: false,
        tokenInfo: null
      }
    }
  }
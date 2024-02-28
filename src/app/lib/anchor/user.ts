import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, Program, web3, BN } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { IDL, Sop } from "./sop";
import {
  LineageInfo,
  Result,
  TxPassType,
  _MintProfileByAtInput,
  _MintProfileInput,
  _MintSubscriptionToken,
} from "./web3Types";
import { BaseMpl } from "./base/baseMpl";
import { web3Consts } from "./web3Consts";
import {
  getAssociatedTokenAddressSync,
  unpackAccount,
} from "@solana/spl-token";
import { Metaplex } from "@metaplex-foundation/js";
import { BaseSpl } from "./base/baseSpl";
import axios from "axios";

const {
  systemProgram,
  associatedTokenProgram,
  mplProgram,
  tokenProgram,
  sysvarInstructions,
  Seeds,
  oposToken,
  LAMPORTS_PER_OPOS,
  addressLookupTableProgram,
} = web3Consts;
const log = console.log;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class Connectivity {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  txis: web3.TransactionInstruction[] = [];
  extraSigns: web3.Keypair[] = [];
  multiSignInfo: any[] = [];
  program: Program<Sop>;
  mainState: web3.PublicKey;
  connection: web3.Connection;
  metaplex: Metaplex;
  baseSpl: BaseSpl;

  constructor(provider: AnchorProvider, programId: web3.PublicKey) {
    // web3.SystemProgram.programId;
    // this.connection = new web3.Connection(Config.rpcURL);
    // this.provider = new anchor.AnchorProvider(this.connection, wallet, {
    //   commitment: "confirmed",
    // });
    this.provider = provider;
    this.connection = provider.connection;
    this.programId = programId;
    this.program = new Program(IDL, programId, this.provider);
    this.metaplex = new Metaplex(this.connection);
    this.baseSpl = new BaseSpl(this.connection);
    this.mainState = web3.PublicKey.findProgramAddressSync(
      [Seeds.mainState],
      this.programId,
    )[0];
  }

  reinit() {
    this.txis = [];
    this.extraSigns = [];
    this.multiSignInfo = [];
  }

  ixCallBack = (ixs?: web3.TransactionInstruction[]) => {
    if (ixs) {
      this.txis.push(...ixs);
    }
  };
  __getProfileStateAccount(mint: web3.PublicKey | string): web3.PublicKey {
    if (typeof mint == "string") mint = new web3.PublicKey(mint);
    return web3.PublicKey.findProgramAddressSync(
      [Seeds.profileState, mint.toBuffer()],
      this.programId,
    )[0];
  }

  __getCollectionStateAccount(mint: web3.PublicKey): web3.PublicKey {
    return web3.PublicKey.findProgramAddressSync(
      [Seeds.collectionState, mint.toBuffer()],
      this.programId,
    )[0];
  }

  __getActivationTokenStateAccount(mint: web3.PublicKey): web3.PublicKey {
    return web3.PublicKey.findProgramAddressSync(
      [Seeds.activationTokenState, mint.toBuffer()],
      this.programId,
    )[0];
  }
  __getValutAccount(profile: web3.PublicKey): web3.PublicKey {
    return web3.PublicKey.findProgramAddressSync(
      [Seeds.vault, profile.toBuffer()],
      this.programId,
    )[0];
  }

  async getProfileMintingStatus(address: string) {
    try {
      const result = await axios.get(`/api/get-whitelist?wallet=` + address);
      return result.data;
    } catch (error) {
      return false;
    }
  }

  async getProfileMetadata(uri: string) {
    try {
      const result = await axios.get(uri);
      if (result.data) {
        let userData: any = {
          _id: "",
          wallet: "",
          username: "",
          bio: "",
          pronouns: "",
          name: "",
          image: "",
          descriptor: "",
          nouns: "",
          seniority: "",
        };
        for (let index = 0; index < result.data.attributes.length; index++) {
          const element = result.data.attributes[index];
          if (element.trait_type == "Seniority") {
            userData.seniority = element.value;
          } else if (element.trait_type == "Username") {
            userData.username = element.value;
          } else if (element.trait_type == "Full Name") {
            userData.name = element.value;
          } else if (element.trait_type == "Adjective") {
            userData.descriptor = element.value;
          } else if (element.trait_type == "Noun") {
            userData.nouns = element.value;
          } else if (element.trait_type == "Pronoun") {
            userData.seniority = element.value;
          }
        }
        return userData;
      } else {
        return null;
      }
      return result.data;
    } catch (error) {
      console.log("metadata error", error);
      return null;
    }
  }

  async updateProfileMintingStatus(address: String, is_available: boolean) {
    try {
      await axios.post("/api/update-whitelist", {
        wallet: address,
        is_available: is_available,
      });
    } catch (error) {
      console.log("error updating total mints ", error);
    }
  }

  async getUserNFTs(userKey: any) {
    const filters = [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 32,
          bytes: userKey, //wallet address string
        },
      },
    ];

    const accounts: any = await this.connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID, //importing from solana spl-token library
      { filters },
    );
    let mintKeys = [];
    let mintList: any = [];
    for (let i in accounts) {
      let details = accounts[i].account?.data?.parsed?.info;
      if (
        parseInt(details.tokenAmount.decimals) == 0 &&
        parseInt(details.tokenAmount.amount) > 0
      ) {
        const mintKey = new anchor.web3.PublicKey(details?.mint);
        mintKeys.push(mintKey);
      }
    }

    if (mintKeys.length > 0) {
      mintList = await this.metaplex
        .nfts()
        .findAllByMintList({ mints: mintKeys });
    }
    return mintList;
  }

  async getUserInfo() {
    const user = this.provider.publicKey;
    if (!user) throw "Wallet not found";
    const userOposAta = getAssociatedTokenAddressSync(oposToken, user);
    const infoes = await this.connection.getMultipleAccountsInfo([
      new anchor.web3.PublicKey(user.toBase58()),
      new anchor.web3.PublicKey(userOposAta.toBase58()),
    ]);
    let oposTokenBalance = 0;
    let solBalance = 0;
    if (infoes[0]) {
      solBalance = infoes[0].lamports / 1000_000_000;
    }

    if (infoes[1]) {
      const tokenAccount = unpackAccount(userOposAta, infoes[1]);
      oposTokenBalance =
        (parseInt(tokenAccount?.amount?.toString()) ?? 0) / LAMPORTS_PER_OPOS;
    }
    let profilelineage = {
      promoter: "",
      scout: "",
      recruiter: "",
      originator: "",
    };
    let generation = "0";

    try {
      const mainStateInfo = await this.program.account.mainState.fetch(
        this.mainState,
      );
      const profileCollection = mainStateInfo.profileCollection;
      const profileCollectionState =
        await this.program.account.collectionState.fetch(
          this.__getCollectionStateAccount(profileCollection),
        );

      const _userNfts = await this.getUserNFTs(user.toBase58());

      let activationTokenBalance: any = 0;
      let profiles: any = [];
      const activationTokens = [];
      let totalChild = 0;
      let seniority = 0;
      for (let i of _userNfts) {
        const nftInfo: any = i;
        const collectionInfo = i?.collection;
        if (
          collectionInfo?.address.toBase58() == profileCollection.toBase58()
        ) {
          const metadata = await this.getProfileMetadata(i?.uri);
          if (metadata) {
            if (seniority == 0 || seniority > metadata.seniority) {
              profiles = [
                {
                  name: i.name,
                  address: nftInfo.mintAddress.toBase58(),
                  userinfo: metadata,
                },
              ];
              seniority = metadata.seniority;
            }
          }
        }
      }

      if (profiles.length > 0) {
        const genesisProfile = new anchor.web3.PublicKey(profiles[0].address);
        const profileState = this.__getProfileStateAccount(genesisProfile);
        const profileStateInfo =
          await this.program.account.profileState.fetch(profileState);
        if (profileStateInfo.activationToken) {
          const userActivationAta = getAssociatedTokenAddressSync(
            profileStateInfo.activationToken,
            user,
          );
          activationTokenBalance = await this.getActivationTokenBalance(
            profileStateInfo.activationToken,
          );
        }
        totalChild = profileStateInfo.lineage.totalChild.toNumber();
        generation = profileStateInfo.lineage.generation.toString();

        for (let i of _userNfts) {
          const collectionInfo = i?.collection;
          if (collectionInfo?.address.toBase58() == genesisProfile.toBase58()) {
            activationTokens.push({
              name: i.name,
              genesis: genesisProfile.toBase58(),
              activation: profileStateInfo.activationToken
                ? profileStateInfo.activationToken.toBase58()
                : "",
            });
          }
        }

        if (this.getAddressString(profileState) != "") {
          const {
            currentGreatGrandParentProfileHolder,
            currentGgreatGrandParentProfileHolder,
            currentGrandParentProfileHolder,
            currentParentProfileHolder,
          } = await this.__getProfileHoldersInfo(
            profileStateInfo.lineage,
            genesisProfile,
            web3Consts.genesisProfile,
          );
          profilelineage = {
            promoter: this.getAddressString(currentParentProfileHolder),
            scout: this.getAddressString(currentGrandParentProfileHolder),
            recruiter: this.getAddressString(
              currentGgreatGrandParentProfileHolder,
            ),
            originator: this.getAddressString(
              currentGreatGrandParentProfileHolder,
            ),
          };
        }
      } else {
        for (let i of _userNfts) {
          if (i) {
            if (i.symbol) {
              if (i.symbol == "INVITE") {
                try {
                  const nftInfo: any = i;
                  const activationTokenState =
                    this.__getActivationTokenStateAccount(nftInfo.mintAddress);
                  const activationTokenStateInfo =
                    await this.program.account.activationTokenState.fetch(
                      activationTokenState,
                    );
                  const parentProfile = activationTokenStateInfo.parentProfile;

                  activationTokens.push({
                    name: i.name,
                    genesis: parentProfile.toBase58(),
                    activation: nftInfo.mintAddress.toBase58(),
                  });
                  const generationData =
                    await this.getProfileChilds(parentProfile);
                  totalChild = generationData.totalChild;
                  generation = generationData.generation;
                  profilelineage = await this.getProfileLineage(parentProfile);
                } catch (error) {
                  console.log("error invite ", error);
                }
              }
              if (activationTokens.length > 0) {
                break;
              }
            }
          }
        }
      }
      const profileInfo = {
        solBalance,
        oposTokenBalance,
        profiles,
        activationTokens,
        activationTokenBalance,
        totalChild: totalChild,
        profilelineage,
        generation,
      };

      return profileInfo;
    } catch (error) {
      console.log("error profile", error);
      const profiles: any = [];
      const profileInfo = {
        solBalance,
        oposTokenBalance,
        profiles: profiles,
        activationTokens: profiles,
        activationTokenBalance: 0,
        totalChild: 0,
        profilelineage,
        generation,
      };
      return profileInfo;
    }
  }

  getAddressString(pubKey: web3.PublicKey) {
    try {
      return pubKey.toBase58();
    } catch (error) {
      return "";
    }
  }

  async getProfileLineage(parentProfile: web3.PublicKey) {
    try {
      const profileStateInfo = await this.program.account.profileState.fetch(
        this.__getProfileStateAccount(parentProfile),
      );

      const {
        currentGreatGrandParentProfileHolder,
        currentGgreatGrandParentProfileHolder,
        currentGrandParentProfileHolder,
        currentParentProfileHolder,
      } = await this.__getProfileHoldersInfo(
        profileStateInfo.lineage,
        parentProfile,
        web3Consts.genesisProfile,
      );

      return {
        promoter: this.getAddressString(currentParentProfileHolder),
        scout: this.getAddressString(currentGrandParentProfileHolder),
        recruiter: this.getAddressString(currentGgreatGrandParentProfileHolder),
        originator: this.getAddressString(currentGreatGrandParentProfileHolder),
      };
    } catch (error: any) {
      return {
        promoter: "",
        scout: "",
        recruiter: "",
        originator: "",
      };
    }
  }

  async getActivationTokenBalance(userActivationAta: web3.PublicKey) {
    try {
      const infoes = await this.connection.getTokenSupply(userActivationAta);
      return infoes.value.amount;
    } catch (error) {
      return 0;
    }
  }

  async getProfileChilds(parentProfile: web3.PublicKey) {
    try {
      const profileStateInfo = await this.program.account.profileState.fetch(
        this.__getProfileStateAccount(parentProfile),
      );
      return {
        totalChild: profileStateInfo.lineage.totalChild.toNumber(),
        generation: profileStateInfo.lineage.generation.toString(),
      };
    } catch (error: any) {
      return {
        totalChild: 0,
        generation: "0",
      };
    }
  }

  async __getProfileHoldersInfo(
    input: LineageInfo,
    parentProfile: web3.PublicKey,
    genesisProfile: web3.PublicKey,
  ): Promise<{
    //profiles:
    parentProfile: web3.PublicKey;
    grandParentProfile: web3.PublicKey;
    greatGrandParentProfile: web3.PublicKey;
    ggreateGrandParentProfile: web3.PublicKey;
    genesisProfile: web3.PublicKey;
    //Profile holder ata
    currentParentProfileHolderAta: web3.PublicKey;
    currentGrandParentProfileHolderAta: web3.PublicKey;
    currentGreatGrandParentProfileHolderAta: web3.PublicKey;
    currentGgreatGrandParentProfileHolderAta: web3.PublicKey;
    currentGenesisProfileHolderAta: web3.PublicKey;
    // profile owners
    currentParentProfileHolder: web3.PublicKey;
    currentGrandParentProfileHolder: web3.PublicKey;
    currentGreatGrandParentProfileHolder: web3.PublicKey;
    currentGgreatGrandParentProfileHolder: web3.PublicKey;
    currentGenesisProfileHolder: web3.PublicKey;
    // opos accounts
    parentProfileHolderOposAta: web3.PublicKey;
    grandParentProfileHolderOposAta: web3.PublicKey;
    greatGrandParentProfileHolderOposAta: web3.PublicKey;
    ggreatGrandParentProfileHolderOposAta: web3.PublicKey;
    genesisProfileHolderOposAta: web3.PublicKey;
  }> {
    const grandParentProfile = input.parent;
    const greatGrandParentProfile = input.grandParent;
    const ggreateGrandParentProfile = input.greatGrandParent;

    const currentParentProfileHolderAta = (
      await this.connection.getTokenLargestAccounts(parentProfile)
    ).value[0].address;
    const currentGrandParentProfileHolderAta = (
      await this.connection.getTokenLargestAccounts(grandParentProfile)
    ).value[0].address;
    const currentGreatGrandParentProfileHolderAta = (
      await this.connection.getTokenLargestAccounts(greatGrandParentProfile)
    ).value[0].address;
    const currentGgreatGrandParentProfileHolderAta = (
      await this.connection.getTokenLargestAccounts(ggreateGrandParentProfile)
    ).value[0].address;
    const currentGenesisProfileHolderAta = (
      await this.connection.getTokenLargestAccounts(genesisProfile)
    ).value[0].address;

    const atasInfo = await this.connection.getMultipleAccountsInfo([
      currentParentProfileHolderAta,
      currentGrandParentProfileHolderAta,
      currentGreatGrandParentProfileHolderAta,
      currentGgreatGrandParentProfileHolderAta,
      currentGenesisProfileHolderAta,
    ]);

    const currentParentProfileHolder = unpackAccount(
      currentParentProfileHolderAta,
      atasInfo[0],
    ).owner;
    const currentGrandParentProfileHolder = unpackAccount(
      currentGrandParentProfileHolderAta,
      atasInfo[1],
    ).owner;
    const currentGreatGrandParentProfileHolder = unpackAccount(
      currentGreatGrandParentProfileHolderAta,
      atasInfo[2],
    ).owner;
    const currentGgreatGrandParentProfileHolder = unpackAccount(
      currentGgreatGrandParentProfileHolderAta,
      atasInfo[3],
    ).owner;
    const currentGenesisProfileHolder = unpackAccount(
      currentGenesisProfileHolderAta,
      atasInfo[4],
    ).owner;

    return {
      //profiles:
      parentProfile,
      grandParentProfile,
      greatGrandParentProfile,
      ggreateGrandParentProfile,
      genesisProfile,
      // profile holder profile ata
      currentParentProfileHolderAta,
      currentGrandParentProfileHolderAta,
      currentGreatGrandParentProfileHolderAta,
      currentGgreatGrandParentProfileHolderAta,
      currentGenesisProfileHolderAta,

      // profile holders
      currentParentProfileHolder,
      currentGrandParentProfileHolder,
      currentGreatGrandParentProfileHolder,
      currentGgreatGrandParentProfileHolder,
      currentGenesisProfileHolder,

      // profile holder oposAta
      parentProfileHolderOposAta: getAssociatedTokenAddressSync(
        oposToken,
        currentParentProfileHolder,
      ),
      grandParentProfileHolderOposAta: getAssociatedTokenAddressSync(
        oposToken,
        currentGrandParentProfileHolder,
      ),
      greatGrandParentProfileHolderOposAta: getAssociatedTokenAddressSync(
        oposToken,
        currentGreatGrandParentProfileHolder,
      ),
      ggreatGrandParentProfileHolderOposAta: getAssociatedTokenAddressSync(
        oposToken,
        currentGgreatGrandParentProfileHolder,
      ),
      genesisProfileHolderOposAta: getAssociatedTokenAddressSync(
        oposToken,
        currentGenesisProfileHolder,
      ),
    };
  }
}

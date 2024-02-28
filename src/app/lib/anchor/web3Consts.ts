import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { web3 } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const web3Consts = {
  programID: new web3.PublicKey("62toyp2z8hsx3xj1Mx2vHMdsXMfgxTCvJ1tT6BehXpxF"),
  systemProgram: web3.SystemProgram.programId,
  sysvarInstructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
  tokenProgram: TOKEN_PROGRAM_ID,
  mplProgram: new web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
  associatedTokenProgram: new web3.PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  ),
  addressLookupTableProgram: web3.AddressLookupTableProgram.programId,
  oposToken: new web3.PublicKey(process.env.NEXT_PUBLIC_OPOS_TOKEN!),
  rootProfile: new web3.PublicKey(process.env.NEXT_PUBLIC_ROOT_PROFILE!),
  genesisProfile: new web3.PublicKey(process.env.NEXT_PUBLIC_GENESIS_PROFILE!),
  commonLut: new web3.PublicKey(process.env.NEXT_PUBLIC_COMMON_LUT!),
  LAMPORTS_PER_OPOS: 1000_000_000,
  Seeds: {
    mainState: utf8.encode("main_state4"),
    profileState: utf8.encode("profile_state1"),
    collectionState: utf8.encode("collection_state1"),
    activationTokenState: utf8.encode("activation_token_state1"),
    vault: utf8.encode("vault1"),
  },
};

import { db } from "@/app/lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const collection = db.collection("mmosh-app-transaction-history");
    const body = await req.json();

    const { transactionType, membershipRoyalty, tokenExchange, offerPurchase, transfer } = body;
    const validateResult = validate(transactionType, { membershipRoyalty, tokenExchange, offerPurchase, transfer });
    if (!validateResult.status) {
      return NextResponse.json(
        {
          status: false,
          message: validateResult.message,
          result: null,
        },
        { status: 400 }
      );
    }

    let data = [];
    if (transactionType === "membership_royalty") {
      for (let index = 0; index < membershipRoyalty.royalty.length; index++) {
        const ninetyDaysInMs = 90 * 24 * 60 * 60 * 1000;
        const element = membershipRoyalty.royalty[index];
        data.push({
          transactionType: transactionType,
          wallet: element.receiver,
          currency: "USDT",
          description: formatTransactionDescription({ transactionType: transactionType, referrerName: membershipRoyalty.referrerName, membershipLevel: getMembershipLevel(index) }),
          isSend: false,
          amount: element.amount,
          isStaked: membershipRoyalty.isStaked,
          isUnlocked: false,
          purchaseId: membershipRoyalty.purchaseId,
          created_date: Date.now(),
          updated_date: Date.now(),
          unlock_date: Date.now() + ninetyDaysInMs,
        })
      }
    } else if (transactionType === "token_exchange") {
      data.push({
        transactionType: transactionType,
        wallet: tokenExchange.wallet,
        currency: tokenExchange.currency,
        description: formatTransactionDescription({ transactionType: transactionType, amount: tokenExchange.amount, fromCurrency: tokenExchange.fromCurrency, exchangedAmount: tokenExchange.exchangedAmount, toCurrency: tokenExchange.currency }),
        isSend: false,
        amount: tokenExchange.exchangedAmount,
        isStaked: false,
        isUnlocked: true,
        purchaseId: "",
        created_date: Date.now(),
        updated_date: Date.now(),
        unlock_date: Date.now(),
      })
    } else if (transactionType === "offer_purchase") {
      data.push({
        transactionType: transactionType,
        wallet: offerPurchase.wallet,
        currency: offerPurchase.currency,
        description: formatTransactionDescription({ transactionType: transactionType, botName: offerPurchase.botName }),
        isSend: true,
        amount: offerPurchase.amount,
        isStaked: false,
        isUnlocked: true,
        purchaseId: "",
        created_date: Date.now(),
        updated_date: Date.now(),
        unlock_date: Date.now(),
      })
    } else if (transactionType === "transfer") {
      data.push({
        transactionType: transactionType,
        wallet: transfer.wallet,
        currency: transfer.currency,
        description: formatTransactionDescription({ transactionType: transactionType, amount: transfer.amount, fromCurrency: transfer.fromCurrency, referrerName: transfer.referrerName }),
        isSend: true,
        amount: transfer.amount,
        isStaked: false,
        isUnlocked: true,
        purchaseId: "",
        created_date: Date.now(),
        updated_date: Date.now(),
        unlock_date: Date.now(),
      })
    }

    if (data.length > 0) {
      const result = await collection.insertMany(data);
    }

    return NextResponse.json(
      {
        status: true,
        message: getSuccessMessage(transactionType),
        result: null,
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Internal server error",
        result: null,
      },
      { status: 500 }
    );
  }
}

const validate = (transactionType: string, params: any) => {
  const throwError = (msg: string) => {
    return {
      status: false,
      message: `Validation failed: ${msg}`
    }
  };

  if (transactionType === "membership_royalty") {
    if (params.membershipRoyalty === undefined) {
      return throwError("membershipRoyalty objects is required");
    }
    const { royalty, referrerName, isStaked } = params.membershipRoyalty || {};
    if (!Array.isArray(royalty) || royalty.length === 0) {
      return throwError("royalty must be a non-empty array");
    }
    royalty.forEach((r: any, i: number) => {
      if (!r.receiver) return throwError(`royalty[${i}].receiver is required`);
      if (typeof r.amount !== "number") return throwError(`royalty[${i}].amount must be a number`);
    });
    if (!referrerName) return throwError("referrerName is required");
    if (typeof isStaked !== "boolean") return throwError("isStaked must be a boolean");

  } else if (transactionType === "token_exchange") {
    if (params.tokenExchange === undefined) {
      return throwError("tokenExchange objects is required");
    }
    const { wallet, currency, amount, fromCurrency, exchangedAmount } = params.tokenExchange || {};
    if (!wallet) return throwError("wallet is required");
    if (!currency) return throwError("currency is required");
    if (!fromCurrency) return throwError("fromCurrency is required");
    if (typeof amount !== "number") return throwError("amount must be a number");
    if (typeof exchangedAmount !== "number") return throwError("exchangedAmount must be a number");

  } else if (transactionType === "offer_purchase") {
    if (params.offerPurchase === undefined) {
      return throwError("offerPurchase objects is required");
    }
    const { wallet, currency, botName, amount } = params.offerPurchase || {};
    if (!wallet) return throwError("wallet is required");
    if (!currency) return throwError("currency is required");
    if (!botName) return throwError("botName is required");
    if (typeof amount !== "number") return throwError("amount must be a number");

  } else if (transactionType === "transfer") {
    if (params.transfer === undefined) {
      return throwError("transfer objects is required");
    }
    const { wallet, currency, amount, referrerName } = params.transfer || {};
    if (!wallet) return throwError("wallet is required");
    if (!currency) return throwError("currency is required");
    if (!referrerName) return throwError("referrerName is required");
    if (typeof amount !== "number") return throwError("amount must be a number");
  } else {
    return throwError("Invalid transactionType");
  }

  return {
    status: true,
    message: "",
  };
};

const getMembershipLevel = (index: number) => {
  const levels = ["1st", "2nd", "3rd"];
  return levels[index] || `${index + 1}th`;
}




const formatTransactionDescription = (params: { transactionType?: string, referrerName?: string, membershipLevel?: string, amount?: number, fromCurrency?: string, exchangedAmount?: number, toCurrency?: string, botName?: string }) => {
  switch (params.transactionType) {
    case "membership_royalty":
      return `Earnings from ${params.referrerName} ${params.membershipLevel} Level Membership`;
    case "token_exchange":
      return `Exchanged ${params.amount} ${params.fromCurrency} tokens to ${params.exchangedAmount} ${params.toCurrency}`;
    case "offer_purchase":
      return `You successfully bought an offer on ${params.botName} Bot`;
    case "transfer":
      return `You have successfully transferred ${params.amount} ${params.fromCurrency} to ${params.referrerName}`;
    default:
      return "Transaction completed";
  }
}

function getSuccessMessage(transactionType: string) {
  switch (transactionType) {
    case "membership_royalty":
      return "Membership earnings recorded successfully";
    case "token_exchange":
      return "Token exchange recorded successfully";
    case "offer_purchase":
      return "Purchase recorded successfully";
    default:
      return "Transaction recorded successfully";
  }
}
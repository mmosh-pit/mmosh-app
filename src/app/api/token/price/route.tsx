import { db } from "../../../lib/mongoClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const collection = db.collection("mmosh-app-token-price");

  const { key, price, type } = await req.json();

  collection.insertOne({
    key,
    price,
    type,
    created_date: new Date(),
    updated_date: new Date(),
  });
  return NextResponse.json("", { status: 200 });
}


export async function GET(req: NextRequest) {
    const collection = db.collection("mmosh-app-token-price");

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ? searchParams.get("type") : "day";
    const key = searchParams.get("key")

    let priceresult = await collection.find({key: key}).sort("-created_date").toArray()

    let price = 0;
    if(priceresult.length > 0) {
        price = priceresult[0].price
    }


    let data = [];
    for (let index = 0; index < 7; index++) {
        let startDate;
        let endDate;
        if(type == "day") {
            startDate = new Date(new Date(new Date().setDate(new Date().getDate() - index)).setHours(0,0,0,0));
            endDate = new Date(new Date(new Date().setDate(new Date().getDate() - index)).setHours(23,59,59,59));
        } else if(type == "week") {
            startDate = new Date(new Date(new Date().setDate(new Date().getDate() - index * 7)).setHours(0,0,0,0));
            let indexMinus = index == 0 ? index : index - 1
            endDate = new Date(new Date(new Date().setDate(new Date().getDate() - indexMinus * 7)).setHours(23,59,59,59));
        } else if(type == "month") {
            let monthDate = new Date(new Date().setMonth(new Date().getMonth() - index))
            startDate = new Date(new Date(monthDate.getFullYear(),monthDate.getMonth(),1).setHours(0,0,0,0));
            endDate = new Date(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).setHours(23,59,59,59));
        } else if(type == "year") {
            let xValue = new Date().getFullYear() - index;

            startDate = new Date(new Date(xValue,1, 1).setHours(0,0,0,0));
            endDate = new Date(new Date(xValue, 12, 31).setHours(23,59,59,59));
        }

        if(startDate && endDate) {
            let result = await collection.find({key: key, created_date:{$gte:startDate, $lt: endDate}}).sort("-created_date").toArray()

            let chartData = parsePriceByInterval(startDate, endDate,result)
            for (let index = 0; index < chartData.length; index++) {
                const element = chartData[index];
                data.push(element)
            }
        }

    }


    return NextResponse.json({
        price: price,
        prices: data
    },
        {
          status: 200,
        },
    );
}

const parsePriceByInterval = (startDate: Date, endDate: Date, data:any) => {
    let currentDate = endDate;
    let chartData = []

    console.log(data)

    while(currentDate.getTime() > startDate.getTime()) {
        let newDate = new Date(currentDate.getTime() - 30*60000);
        let series = data.filter((item: any) => {
            return new Date(item.created_date).getTime() >= newDate.getTime() &&  new Date(item.created_date).getTime() < currentDate.getTime();
        });
        let prices = []
        for (let index = 0; index < series.length; index++) {
            const element = series[index];
            prices.push(element.price)
        }
        chartData.push({
            x: currentDate.getTime(),
            y: prices
        })
        currentDate = newDate;
    }
    return chartData
}
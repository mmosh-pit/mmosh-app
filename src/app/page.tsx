"use client";

import { Bars } from "react-loader-spinner";

export default function Home() {
  return (
    <div className="background-content flex w-full h-full justify-center">
      <div className="mt-16">
        <Bars
          height="8vmax"
          width="8vmax"
          color="rgba(255, 0, 199, 1)"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass="bars-loading"
          visible={true}
        />
      </div>
    </div>
  );
}

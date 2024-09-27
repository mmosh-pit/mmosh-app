import { userWeb3Info } from "@/app/store";
import { useAtom } from "jotai";
import moment from 'moment';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Notification = (props:any) => {
  const router = useRouter();

  const openProfile = () => {
    router.push("/"+props.data.receiver.profile.username)
  }

  return (
    <div className="notification-item relative border-b border-white border-opacity-20 pb-3.5 mb-3.5 last:border-b-0 cursor-pointer" onClick={()=>{openProfile()}}>
        <img src={props.data.sender[0].profile.image} className="w-8 h-8 rounded-full absolute left-0 top-0" />
        <div className="notification-content min-h-8 pl-10 ">
            <p className="text-base">{props.data.message}</p>
            <p className="text-tiny text-light-gray">{moment(props.data.created_date).fromNow()}</p>
        </div>
    </div>
  );
};

export default Notification;

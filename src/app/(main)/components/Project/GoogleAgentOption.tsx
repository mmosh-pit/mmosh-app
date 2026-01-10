import * as React from 'react';
import Button from '../common/Button';
import { data } from '@/app/store';
import { useAtom } from 'jotai';
import internalClient from '@/app/lib/internalHttpClient';
import { set } from '@coral-xyz/anchor/dist/cjs/utils/features';
// import { getGoogleClient, listEmails } from '@/app/lib/google';
// import { getGoogleToken } from '@/app/lib/googleMongo';

interface GoogleAppProps {
  type?: string | undefined,
  agentId?: string | undefined
}
const GoogleAgentOption = (props: GoogleAppProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [userData, setUserData] = useAtom(data);
  const connectGoogleAccount = React.useCallback(() => {
    // Implement Google OAuth flow here
    if (props.agentId) {
      window.location.href = `/api/auth/google/start?user=&agentId=${props.agentId}&type=${props.type}`;
    } else {
      window.location.href = `/api/auth/google/start?user=${(userData as any).ID}&type=${props.type}`;
    }
  }, []);
  React.useEffect(() => {
    setIsLoading(true);
    fetchGoogleStatus();
  }, []);

  const fetchGoogleStatus = async () => {
    try {
      let res: any = null;

      if (props.agentId) {
        res = await internalClient("/api/google/status?agentId=" + props.agentId);
      } else {
        res = await internalClient("/api/google/status?user=" + (userData as any).ID);
      }

      const data: any = res.data;

      if (data.error) {
        setCurrentUser((prev: any) => ({ ...prev, google: null }));
        return;
      }

      setCurrentUser((prev: any) => ({
        ...prev,
        google: {
          id: data.data.id,
          email: data.data.email,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch google status:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const removeGoogleAccount = React.useCallback(() => {
    // Implement Google account removal logic here
    internalClient.delete('/api/google/status').then(() => {
      setCurrentUser((prev: any) => ({
        ...prev,
        google: null,
      }));
    }).catch((error) => {
    });
  }, []);


  return (
    <>
      <div
        className={`flex flex-col justify-center items-center 
    ${props.type == "studio" ? "md:min-w-[40%]" : "md:min-w-[60%]"} 
    min-w-[80%] my-2 bg-[#03000754] backdrop-filter backdrop-blur-[8px] 
    rounded-lg p-6 min-h-[200px] mt-12 
    ${currentUser?.telegram?.id && "border-[1px] border-[#FF00AE59]"}`}
      >

        {isLoading && <p className="text-white">Loading...</p>}
        {!isLoading && !currentUser?.google?.id && (
          <Button
            size="large"
            title="Connect a Google Account"
            isLoading={isLoading}
            action={connectGoogleAccount}
            isPrimary
          />
        )}

        {!!currentUser?.google?.id && (
          <div className="w-full h-full flex flex-col justify-between items-center rounded-lg py-2 px-2">
            <div className="flex flex-col items-center">
              Connected google account:
              <p className="text-sm text-white ml-2">
                {currentUser!.google.email}
              </p>
              {/* <img src={currentUser!.google.picture} className="w-14 h-14 rounded-full absolute left-3.5 top-3.5"/> */}
            </div>

            <button
              className="border-[1px] border-white rounded-lg px-4 py-2 cursor-pointer self-center"
              onClick={() => removeGoogleAccount()}
            >
              <p className="text-base text-white">Disconnect</p>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default GoogleAgentOption;


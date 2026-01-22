"use client";

import KinshipMainIcon from "@/assets/icons/KinshipMainIcon";
import { usePathname } from "next/navigation";
import YoutubeIcon from "@/assets/icons/YoutubeIcon";
import TiktokIcon from "@/assets/icons/TiktokIcon";
import TwitterIcon from "@/assets/icons/TwitterIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import ThreadsIcon from "@/assets/icons/ThreadsIcon";
import FacebookIcon from "@/assets/icons/FacebookIcon";
import SubstackIcon from "@/assets/icons/SubstackIcon";
import BlueskyIcon from "@/assets/icons/BlueskyIcon";
import LinkedinIcon from "@/assets/icons/LinkedinIcon";

const Footer = () => {
  const pathname = usePathname();

  if (
    ["/login", "/sign-up", "/forgot-password", "/preview"].includes(pathname)
  ) {
    return <></>;
  }

  return (
    <footer className="items-start pb-12 md:px-16 xl:px-32 px-8 pt-8">
      <div className=" items-center xl:flex md:place-self-center">
        <div className="">
          <KinshipMainIcon />
        </div>

        <div className=" xl:ml-[20rem] xl:w-[50.063rem] md:place-self-center mt-8 xl:mt-0">
          <ul className="xl:flex xl:justify-between font-normal">
            <li>
              <a href="#">Bots</a>
            </li>
            <li>
              <a href="#">Coins</a>
            </li>
            <li>
              <a href="#">Offers</a>
            </li>
            <li>
              <a href="#">Launchpad</a>
            </li>
            <li>
              <a href="#">Members</a>
            </li>{" "}
          </ul>
        </div>
      </div>

      <div className="xl:flex justify-between items-center mt-12 place-self-center">
        <div>
          <p className="text-sm">
            © 2025 Kinship Intelligence Cooperative, PBC. All Rights Reserved.

          </p>
          <p className="text-sm">
            Kinship Intelligence™ Kinship Bots™ and Where AI Belongs™ are trademarks of
          </p>
          <p className="text-sm">Kinship Intelligence, a Colorado Cooperative and Public Benefit Corporation.</p>
        </div>
        <div>
          <ul className="flex max-md:flex-wrap max-md:justify-center max-md:gap-3 xl:ml-96 space-x-6 items-center mt-6 xl:mt-0">
            <li>
              <a href="#">
                <YoutubeIcon width={24} height={24} />
              </a>
            </li>
            <li>
              <a href="#">
                <TiktokIcon width={24} height={24} />
              </a>
            </li>
            <li>
              <a href="#">
                <TwitterIcon width={24} height={24}/>
              </a>
            </li>
            <li>
              <a href="#">
                <InstagramIcon width={24} height={24} />
              </a>
            </li>
            <li>
              <a href="#">
                <ThreadsIcon width={24} height={24} />
              </a>
            </li>
            <li>
              <a href="#">
                <FacebookIcon width={24} height={24}/>
              </a>
            </li>
            <li>
              <a href="#">
                <SubstackIcon width={24} height={24}/>
              </a>
            </li>
            <li>
              <a href="#">
                <BlueskyIcon width={24} height={24}/>
              </a>
            </li>
            <li>
              <a href="#">
                <LinkedinIcon  width={24} height={24}/>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

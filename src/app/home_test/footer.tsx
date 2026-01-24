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
import KinshipBots from "@/assets/icons/KinshipBots";

const Footer = () => {
  const pathname = usePathname();

  const scrollTo = (id: string, offset = 120) => {
    const element = document.getElementById(id);
    if (!element) return;

    const top =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };



  if (
    ["/login", "/sign-up", "/forgot-password", "/preview"].includes(pathname)
  ) {
    return <></>;
  }

  return (
    <footer className="items-start pb-12 md:px-16 xl:px-32 px-8 pt-8">
      <div className=" items-center xl:flex md:place-self-center">
        <div className="">
          <KinshipBots />
        </div>

        <div className=" xl:ml-[20rem] xl:w-[50.063rem] md:place-self-center mt-8 xl:mt-0">
          <ul className="xl:flex xl:justify-between font-normal">
            <li>
              <a className="cursor-pointer" onClick={() => scrollTo("origin-story")}> Origin Story</a>
            </li>
            <li>
              <a className="cursor-pointer" onClick={() => scrollTo("kinship-intelligence")}> Kinship Intelligence</a>
            </li>
            <li>
              <a className="cursor-pointer" onClick={() => scrollTo("collective-economic")}> Co-op Economics</a>
            </li>
            <li>
              <a className="cursor-pointer" onClick={() => scrollTo("founding-creator")}> Founding Sages </a>
            </li>
            <li>
              <a
                href="https://deeper.kinshipbots.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                {" "}
                Go Deeper
              </a>
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
            Kinship Intelligence™ and Kinship Bots™ are trademarks of
          </p>
          <p className="text-sm">
            Kinship Intelligence, a Colorado Cooperative and Public Benefit
            Corporation.
          </p>
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
                <TwitterIcon width={24} height={24} />
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
                <FacebookIcon width={24} height={24} />
              </a>
            </li>
            <li>
              <a href="#">
                <SubstackIcon width={24} height={24} />
              </a>
            </li>
            <li>
              <a href="#">
                <BlueskyIcon width={24} height={24} />
              </a>
            </li>
            <li>
              <a href="#">
                <LinkedinIcon width={24} height={24} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

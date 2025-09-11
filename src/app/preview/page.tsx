"use client";

import { useRef, useState } from "react";
import AlertModal from "../components/Modal";
import SimpleArrowDown from "@/assets/icons/SimpleArrowDown";
import KinshipBots from "@/assets/icons/KinshipBots";
import Button from "../components/common/Button";
import useCheckDeviceScreenSize from "../lib/useCheckDeviceScreenSize";
import HomeMobileDrawer from "../components/HomeMobileDrawer";
import AppleIcon from "@/assets/icons/AppleIcon";
import PlayStoreIcon from "@/assets/icons/PlayStoreIcon";
import FeaturedBot from "../components/Preview/FeaturedBot";
import Bot from "../components/Preview/Bot";
import LinkedinIcon from "@/assets/icons/LinkedinIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import YoutubeIcon from "@/assets/icons/YoutubeIcon";
import XIcon from "@/assets/icons/XIcon";

export default function LandingPage() {
  const screenSize = useCheckDeviceScreenSize();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialModalStep, setInitialModalStep] = useState(0);

  const mainSection = useRef<HTMLDivElement>(null);
  const belowHeroRef = useRef<HTMLDivElement>(null);
  const homeSection = useRef<HTMLDivElement>(null);
  const howItWorksSection = useRef<HTMLDivElement>(null);

  const scrollToHero = () => {
    belowHeroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isMobileScreen = screenSize < 1200;

  const openSignUpModal = () => {
    setInitialModalStep(0);
    setIsModalOpen(true);
  };

  const openSignInModal = () => {
    setInitialModalStep(2);
    setIsModalOpen(true);
  };

  return (
    <div className="relative h-full">
      <header className="w-full fixed flex justify-center z-10">
        <div className="flex justify-between items-center md:px-16 px-4 py-8 bg-[#32323212] md:backdrop-filter md:backdrop-blur-[13px] md:rounded-full w-full lg:w-[80%] self-center">
          {!isMobileScreen && (
            <button
              onClick={() =>
                mainSection.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <KinshipBots />
            </button>
          )}

          {isMobileScreen ? (
            <div className="flex flex-col items-center justify-center">
              <HomeMobileDrawer />
            </div>
          ) : (
            <div className="flex justify-center items-center rounded-full border-[#FFFFFF47] border-[1px] bg-[#FFFFFF0F] px-4 py-2">
              <a
                className="text-base text-white cursor-pointer"
                onClick={() => { }}
              >
                Training
              </a>

              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={() => { }}
              >
                Docs
              </a>

              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={() => { }}
              >
                Pricing
              </a>

              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={() => { }}
              >
                About
              </a>
            </div>
          )}

          <div className="flex">
            <Button
              action={openSignInModal}
              size="small"
              isPrimary
              title="Log In"
              color="bg-transparent"
              isLoading={false}
            />

            <div className="mx-2" />

            <Button
              action={openSignUpModal}
              size="small"
              isPrimary
              title="Sign Up"
              isLoading={false}
            />
          </div>
        </div>
      </header>

      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isHome={false}
        initialStep={initialModalStep}
      />
      <div
        className="bg-[#050824] text-white min-h-screen mx-auto overflow-hidden top-0 w-full px-4"
        ref={mainSection}
      >
        <div className="text-center relative">
          <div className="relative">
            <video
              className="w-full h-auto mx-auto rounded-lg"
              autoPlay
              muted
              loop={false}
              playsInline
            >
              <source
                src="https://storage.googleapis.com/mmosh-assets/home/home.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className=" absolute top-0 w-full h-[13px] bg-[linear-gradient(0deg,rgba(3,1,27,0)_0%,#03011B_100%)] backdrop-blur-[5px]"></div>
            <div className=" absolute bottom-0 w-full h-44 bg-[linear-gradient(180deg,rgba(3,1,27,0)_0%,#03011B_100%)]"></div>
            <div className=" absolute top-0 left-0 bg-[linear-gradient(270deg,rgba(3,1,27,0)_0%,#03011B_100%)] h-full w-[132px] flex-shrink-0"></div>
            <div className=" absolute top-0 right-0 bg-[linear-gradient(90deg,rgba(3,1,27,0)_0%,#03011B_100%)] h-full w-[132px] flex-shrink-0"></div>
            <div className=" absolute w-full h-full top-0 left-0 flex justify-center items-center">
              <div
                className="m-auto md:max-w-[45%] max-w-[85%] p-2 bg-[#01000A14] md:backdrop-filter md:backdrop-blur-[11px] rounded-[60px] p-4 md:py-8 md:px-12"
                ref={homeSection}
              >
                <h1 className="w-auto mt-5 sm:mt-0 text-[3vmax] md:text-[5vmax] sm:leading-[70px] font-goudy bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent stroke-text md:py-6 py-2">
                  Kinship Bots
                </h1>
                <div className="md:py-4 md:my-4 py-2 sm:leading-[70px]">
                  <p className="text-base md:text-4xl font-bold text-[#FFFFFF] text-opacity-80">
                    Where AI Belongs
                  </p>
                </div>
                <p className="mb-2 sm:mb-5 text-[1vmax] md:text-lg text-white">
                  Join forces with the world's first intentional community of AI
                  bots living together on the cutting edge of culture, safe and
                  secure in your very own agentic crypto wallet.
                </p>

                <div className="w-full flex items-center justify-evenly">
                  <button
                    className="flex m-auto md-[46px] px-4 py-[6px] md:px-[32px] md:py-[12px] mt-5 font-bold text-xs justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE] cursor-pointer"
                    onClick={openSignUpModal}
                  >
                    Let's go!
                  </button>

                  <button
                    className="flex items-center m-auto md:h-[46px] px-4 py-[6px] md:px-[32px] md:py-[12px] mt-5 font-bold text-xs justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FFFFFF14] border-[1px] border-white cursor-pointer ml-0"
                    onClick={scrollToHero}
                  >
                    <SimpleArrowDown />
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          className="mb-8 md:mt-12 mt-8 flex w-full h-full px-2 pt-4 pb-2 justify-center items-center"
          ref={belowHeroRef}
        >
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-center font-bold md:text-[1.8vmax] text-[2.2vmax] bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
              Change Yourself, Change Your Life, Change the World
            </h1>

            <h1 className="text-center text-lg stroke-text mt-8 text-[#FFFFFF90]">
              You may feel powerless. Everywhere you turn Big Tech is enforcing
              conformity, controlling behavior, endlessly distracting,
              exploiting, and extracting as much value as possible while people
              suffer, societies collapse and the world burns.
              <br />
              <br />
              But in reality, you are powerful beyond measure. At every moment
              the words you speak, the choices you make and the actions you take
              shift the trajectory of your life, send ripples through the cosmic
              web, and birth a new reality.
            </h1>

            <div className="w-full flex justify-center my-8 cursor-pointer">
              <a
                className="flex items-center border-[1px] border-[#FFFFFF90] bg-[#FFFFFF05] rounded-2xl md:p-6 p-3"
                href="https://apps.apple.com/us/app/kinship-bots-ai-agent-wallet/id6740535929"
                target="_blank"
              >
                <AppleIcon width="5vmax" height="5vmax" />

                <div className="flex flex-col justify-center items-center ml-4">
                  <p className="md:text-base text-xs text-white text-center">
                    Download on the
                  </p>
                  <p className="md:text-xl text-base text-white font-bold text-center">
                    App Store
                  </p>
                </div>
              </a>

              <div className="mx-4" />

              <a
                className="flex items-center border-[1px] border-[#FFFFFF90] bg-[#FFFFFF05] rounded-2xl md:p-6 p-3 cursor-pointer"
                href="https://play.google.com/store/apps/details?id=com.kinship.bigagent"
                target="_blank"
              >
                <PlayStoreIcon width="5vmax" height="5vmax" />

                <div className="flex flex-col justify-center items-center ml-4">
                  <p className="md:text-base text-xs text-white text-center">
                    Download on the
                  </p>
                  <p className="md:text-xl text-base text-white font-bold text-center">
                    Google Play
                  </p>
                </div>
              </a>
            </div>

            <p className="text-center text-lg text-[#FFFFFF90]">
              Kinship Bots is for creators, consultants, coaches, experts,
              gurus, professionals, visionaries, leaders, guides, mentors,
              builders, architects, catalysts, stewards, thought leaders and
              luminaries who are ready to step off the Big Tech hamster wheel of
              doom and into their own power.
            </p>
          </div>
        </section>

        <section
          className="md:py-20 md:w-[80%] w-[90%] pb-4 mx-auto"
          ref={howItWorksSection}
        >
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-center md:text-[1.8vmax] text-[2.2vmax] font-bold bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
              Featured Bots
            </h1>
          </div>

          <FeaturedBot onActivate={openSignUpModal} />

          <div className="flex md:flex-row flex-col">
            <Bot onActivate={openSignUpModal} />

            <div className="md:mx-4 my-4" />

            <Bot onActivate={openSignUpModal} />
          </div>
        </section>

        <div className="flex md:w-[80%] w-[90%] mx-auto mb-16">
          <div className="preview-footer-card rounded-lg w-[50%]">
            <h3 className="text-white font-bold text-4xl">
              Calling all Creators! Join Kinship Academy and learn how to build,
              launch and scale your own on-chain AI Bot!
            </h3>

            <button className="bg-white rounded-lg py-2 px-6 mt-4">
              <p className="text-base text-[#FF00AE]">Join Now</p>
            </button>
          </div>

          <div className="mx-4" />

          <div className="flex justify-between w-[50%]">
            <div className="flex flex-col justify-between">
              <div className="flex flex-col">
                <a className="text-sm text-white my-2" href="">
                  Training
                </a>
                <a className="text-sm text-white my-2" href="">
                  Docs
                </a>
                <a className="text-sm text-white my-2" href="">
                  Pricing
                </a>
                <a className="text-sm text-white my-2" href="">
                  About
                </a>
              </div>

              <div className="flex flex-col">
                <div className="flex">
                  <div className="rounded-full w-8 h-8 flex justify-center items-center border-[1px] border-[#FFFFFF15] bg-[#FFFFFF10] mx-2">
                    <LinkedinIcon />
                  </div>
                  <div className="rounded-full w-8 h-8 flex justify-center items-center border-[1px] border-[#FFFFFF15] bg-[#FFFFFF10] mx-2">
                    <InstagramIcon />
                  </div>
                  <div className="rounded-full w-8 h-8 flex justify-center items-center border-[1px] border-[#FFFFFF15] bg-[#FFFFFF10] mx-2">
                    <YoutubeIcon />
                  </div>
                  <div className="rounded-full w-8 h-8 flex justify-center items-center border-[1px] border-[#FFFFFF15] bg-[#FFFFFF10] mx-2">
                    <XIcon />
                  </div>
                </div>

                <p className="text-base text-[#FFFFFF40]">
                  © 2025 Kinship Bots Club. All Rights Reserved.
                </p>
              </div>
            </div>

            <KinshipBots />
          </div>
        </div>
      </div>
    </div>
  );
}

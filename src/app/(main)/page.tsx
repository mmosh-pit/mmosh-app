"use client";

import React from "react";
import { useRef, useState } from "react";
import AlertModal from "../(main)/components/Modal";
import KinshipBots from "@/assets/icons/KinshipBots";
import Button from "../(main)/components/common/Button";
import LandingPageDrawer from "../(main)/components/LandingPageDrawer";
import { testimonials } from "@/constants/testimonials";
import { Step1 } from "../(main)/components/EarlyAccess/Step1/Step1";
import { Step2 } from "../(main)/components/EarlyAccess/Step2/Step2";
import { Step3 } from "../(main)/components/EarlyAccess/Step3/Step3";
import { Step4 } from "../(main)/components/EarlyAccess/Step4/Step4";
import { Step5 } from "../(main)/components/EarlyAccess/Step5/Step5";
import { Step6 } from "../(main)/components/EarlyAccess/Step6/Step6";
import { Step7 } from "../(main)/components/EarlyAccess/Step7/Step7";
import { Step8 } from "../(main)/components/EarlyAccess/Step8/Step8";
import { ErrorContainerVW } from "../(catfawn)/catfawn/components/ErrorContainer/ErrorContainerVW";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { data, isAuth, isAuthModalOpen, isAuthOverlayOpen } from "../store";
import HomeLoggedInPage from "./components/HomeLoggedInPage";
import client from "../lib/httpClient";
import WizardEditButton from "./components/AiPageEditor/WizardEditButton";
import AiPageEditor from "./components/AiPageEditor/AiPageEditor";

const STORAGE_KEY = "early-access-data";

type PricingPlan = {
  id: string;
  title: string;
  subtitle: string;
  seats: string;
  description: string;
  pricing: string;
};

type Pathway = {
  id: string;
  name: string;
  theme: string;
  description: string;
};

type Principle = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
};

type PlatformItem = {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  description: string;
};

const pricingPlans: PricingPlan[] = [
  {
    id: "citizens",
    title: "Citizens",
    subtitle: "The Foundation",
    seats: "",
    description:
      "Every member starts here. You use the platform, you earn loyalty rewards for participation, you own a stake in the cooperative, and you can earn royalties from the agents you create and earn commissions based on members you enroll. Your data, agents, creations, and relationships belong to you. Your vote counts. Your progress funds the system and the system funds your progress.",
    pricing: "",
  },
  {
    id: "champions",
    title: "Champions",
    subtitle: "The Network",
    seats: "",
    description:
      "When twelve people you've invited become active members, you become a Champion. It's an ongoing threshold — you maintain your community, not just launch it. Champions earn commissions on membership revenue distributed across four levels of relationships. This structure rewards the deep work of building and supporting real networks, not just collecting sign-ups. Champions who enroll Creators also earn curator royalties — a direct cut of what their Creators earn. The incentive is clear: find talented builders, bring them in, and grow together.",
    pricing: "",
  },
  {
    id: "creators",
    title: "Creators",
    subtitle: "The Builders",
    seats: "",
    description:
      "When at least one of your agents is voted into public listing by the cooperative membership, you become a Creator. Until then, your agents can be listed as secret or private. Creators earn monthly royalties from the Creator pool based on engagement with their agents. But that's the floor, not the ceiling. Creators can  also sell directly — premium agents, goods, services, experiences — and keep what they earn. This can be a real business built on a platform that wants you to succeed.",
    pricing: "",
  },
  // {
  //   id: "creator",
  //   title: "Creator",
  //   subtitle: "For designers of transformation",
  //   seats: "Individual membership",
  //   description:
  //     "Creator membership includes full access to Kinship Studio and the Exchange. Design immersive scenarios, publish your work, and earn based on usage and engagement—or create private experiences and set your own pricing. Creators are paid from a shared pool and retain ownership of their work within cooperative governance.",
  //   pricing: "$120/month or $950/year",
  // },
];

const pathways: Pathway[] = [
  {
    id: "four-arrows",
    name: "Four Arrows",
    theme: "Indigenous Worldview",
    description:
      "Worldview reflection, sacred communication, self- hypnosis, and fearless courage—rooted in a living, interconnected universe where all beings are kin.",
  },
  {
    id: "howard-teich",
    name: "Howard Teich",
    theme: "Complementary Consciousness",
    description:
      "Archetypal depth psychology and alchemy—integrating shadow, embracing paradox, and restoring the partnership between Solar and Lunar consciousness.",
  },
  {
    id: "renee-smith",
    name: "Renée Smith",
    theme: "The Nature of Work",
    description:
      "Transforming work into play, fear into love. Building stronger, more resilient teams and cultures across organizations, institutions, and movements.",
  },
  {
    id: "bill-thatcher",
    name: "Bill Thatcher",
    theme: "Soulsteading",
    description:
      "Self-authorship through authentic community. Withdraw projections, lower masks, and cultivate the deep trust that holds us through change.",
  },
  {
    id: "hephzibah-light",
    name: "Hephzibah Light",
    theme: "The Feathered Nest",
    description:
      "Creating homes and families that are purposeful, meaningful, and filled with joy—where belonging and beauty sustain everyday life.",
  },
  {
    id: "warren-kahn",
    name: "Warren Kahn",
    theme: "Let Life Lead",
    description:
      "Relating in flow, living in truth, and navigating with presence, ease, and trust rather than force, conflict, and control.",
  },
];

const principles: Principle[] = [
  {
    id: "harmony",
    title: "Harmony",
    subtitle: "",
    description:
      "Connection that holds under pressure. The capacity to stay present, repair what breaks, and build deep, honest relationships of love and mutual care.",
  },
  {
    id: "empowerment",
    title: "Empowerment",
    subtitle: "",
    description:
      "Agency that comes from your center, with confidence, clarity, conviction, and the courage to show up in your full power.",
  },
  {
    id: "artistry",
    title: "Artistry",
    subtitle: "",
    description:
      "Openness, versatility, and craft. The capacity to adapt, experiment, and refine your way through everything life has on offer.",
  },
  {
    id: "reason",
    title: "Reason",
    subtitle: "",
    description:
      "Purpose in motion. The capacity to align what you do with what matters the most — so meaning can be lived rather than declared.",
  },
  {
    id: "trust",
    title: "Trust",
    subtitle: "",
    description:
      "The deep capacity to feel safe in relationships and trust the process. Vulnerability, reliability and the sense that the world you inhabit is fundamentally sound.",
  },
  {
    id: "synthesis",
    title: "Synthesis",
    subtitle: "",
    description:
      "Complementary consciousness. Reflection and direction. Inward and outward. Reception and expression. The capacity to move between worlds without losing yourself.",
  },
];

const platformItems: PlatformItem[] = [
  {
    id: "today",
    title: "Kinship Agents",
    subtitle: "The Experience",
    intro: "",
    description:
      "Where members live, work, and play in an environment populated by caring, capable, and supportive Kinship Agents",
  },
  {
    id: "studio",
    title: "Kinship Studio",
    subtitle: "The Workshop",
    intro: "",
    description:
      "Where creators build the agents that care, the adventures that transform, the tools that connect, and the experiences that matter. ",
  },
  {
    id: "exchange",
    title: "Kinship Exchange",
    subtitle: "The Economy",
    intro: "",
    description:
      "An agent marketplace where value circulates. Creators earn royalties. Champions earn commissions. Citizens earn rewards.",
  },
  {
    id: "intelligence",
    title: "Kinship Intelligence",
    subtitle: "The Heart and Soul",
    intro: "",
    description:
      "The orchestration layer that ensures every agent cooperates, all context is shared, and every member is honored across the entire network.",
  },
];

export default function LandingPage() {
  const searchParams = useSearchParams();
  const [isUserAuthenticated, setIsUserAuthenticated] = useAtom(isAuth);
  const router = useRouter();
  const [_, setShowAuthOverlay] = useAtom(isAuthOverlayOpen);
  const [__, setIsAuthModalOpen] = useAtom(isAuthModalOpen);
  const [currentUser, setCurrentUser] = useAtom(data);

  const [mounted, setMounted] = useState(false);
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialModalStep, setInitialModalStep] = useState(0);

  const originStoryRef = useRef<HTMLDivElement>(null);
  const kinshipIntelligenceRef = useRef<HTMLDivElement>(null);
  const collectiveEconomicsRef = useRef<HTMLDivElement>(null);
  const foundingCreatorsRef = useRef<HTMLDivElement>(null);
  const earlyAccessRef = useRef<HTMLDivElement>(null);

  const mainSection = useRef<HTMLDivElement>(null);
  const belowHeroRef = useRef<HTMLDivElement>(null);
  const homeSection = useRef<HTMLDivElement>(null);
  const testimonialsSection = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3;

  const totalSlides = Math.ceil((testimonials?.length || 0) / itemsPerSlide);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentStep(Number(parsed.currentStep) || 1);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(1);
    }
  }, []);

  const checkIfIsAuthenticated = React.useCallback(async () => {
    const url = `/is-auth`;

    try {
      const result = await client.get(url);

      const user = result.data?.data?.user;

      setShowAuthOverlay(!user);
      setIsAuthModalOpen(!user);
      setIsUserAuthenticated(!!user);
      setCurrentUser(user);
    } catch (err) {
      // router.replace("/");
    }
  }, [STORAGE_KEY]);

  const prevSlide = () => {
    if (!totalSlides) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    if (!totalSlides) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const visibleTestimonials = (testimonials ?? []).slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide,
  );

  const [currentStep, setCurrentStep] = useState<number>(1);

  React.useEffect(() => {
    checkIfIsAuthenticated();
  }, []);

  React.useEffect(() => {
    const menuType = searchParams.get("menu_type");
    console.log("=========== menuType ===============", menuType);
    if (menuType === "origin_story") {
      return scrollWithOffset(originStoryRef);
    } else if (menuType === "kinship_intelligence") {
      return scrollWithOffset(kinshipIntelligenceRef);
    } else if (menuType === "co_op_economics") {
      return scrollWithOffset(collectiveEconomicsRef);
    } else if (menuType === "founding_sages") {
      return scrollWithOffset(foundingCreatorsRef);
    } else if (menuType === "join_early_access") {
      return scrollWithOffset(earlyAccessRef);
    }
  }, []);

  const scrollWithOffset = (
    ref: React.RefObject<HTMLElement>,
    offset = 120,
  ) => {
    if (!ref.current) return;

    const elementTop =
      ref.current.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: elementTop - offset,
      behavior: "smooth",
    });
  };

  const logout = async () => {
    if (isLoadingLogout) return;

    setIsLoadingLogout(true);
    await client.delete("/logout", {});
    window.localStorage.removeItem("token");
    setIsLoadingLogout(false);

    setIsUserAuthenticated(false);
    setCurrentUser(null);
    setIsAuthModalOpen(false);
    setShowAuthOverlay(true);
  };

  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("success");
  const [msgText, setMsgText] = React.useState("");

  // When loaded in the preview iframe, hide editor UI
  const isPreviewMode = searchParams.get("_wizard_preview") === "1";

  if (isUserAuthenticated && currentUser?.role !== "wizard")
    return <HomeLoggedInPage />;

  return (
    <div className="relative h-full">
      {!isPreviewMode && <AiPageEditor />}
      <header className="w-full fixed flex justify-center z-10">
        <div className="flex justify-between items-center max-2xl:container px-4 max-xl:py-4 py-8 bg-[#32323212] backdrop-filter backdrop-blur-[13px] sm:rounded-full w-full 2xl:mx-40 self-center">
          <button
            className="hidden xl:block"
            onClick={() =>
              mainSection.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <KinshipBots />
          </button>

          <div className="flex xl:hidden flex-col items-center justify-center">
            <LandingPageDrawer
              scrollWithOffset={scrollWithOffset}
              originStoryRef={originStoryRef}
              kinshipIntelligenceRef={kinshipIntelligenceRef}
              collectiveEconomicsRef={collectiveEconomicsRef}
              foundingCreatorsRef={foundingCreatorsRef}
            />
          </div>
          <div className="hidden xl:flex justify-center items-center rounded-full border-[#FFFFFF47] border-[1px] bg-[#FFFFFF0F] px-4 py-2">
            <a
              className="text-base text-white cursor-pointer"
              onClick={() => scrollWithOffset(originStoryRef)}
            >
              Origin Story
            </a>

            <div className="xl:mx-4 md:mx-2" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => scrollWithOffset(kinshipIntelligenceRef)}
            >
              Kinship Intelligence
            </a>

            <div className="xl:mx-4 md:mx-2" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => scrollWithOffset(collectiveEconomicsRef)}
            >
              Co-op Economics
            </a>

            <div className="xl:mx-4 md:mx-2" />

            <a
              className="text-base text-white cursor-pointer"
              onClick={() => scrollWithOffset(foundingCreatorsRef)}
            >
              Founding Sages{" "}
            </a>
            <div className="xl:mx-4 md:mx-2" />

            <a
              href="https://kinship.systems"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-white cursor-pointer"
            >
              Go Deeper
            </a>
          </div>

          <div className="flex items-center gap-3">
            {currentUser == null && (
              <div className="font-bold">
                <Button
                  action={() => router.push("/login")}
                  size="small"
                  isPrimary
                  title="Login"
                  isLoading={false}
                />
              </div>
            )}

            {currentUser != null && (
              <div className="font-bold">
                <Button
                  action={logout}
                  size="small"
                  isPrimary
                  title="Logout"
                  isLoading={false}
                />
              </div>
            )}

            {!isPreviewMode && <WizardEditButton />}
            <div className="font-bold">
              <Button
                action={() => scrollWithOffset(earlyAccessRef)}
                size="small"
                isPrimary
                title="Join Early Access"
                isLoading={false}
              />
            </div>
          </div>
        </div>
        <ErrorContainerVW
          showMessage={showMsg}
          className={msgClass}
          messageText={msgText}
        />
      </header>

      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isHome={false}
        initialStep={initialModalStep}
      />
      <div
        className="bg-[#050824] text-white min-h-screen mx-auto overflow-hidden top-0 w-full"
        ref={mainSection}
      >
        <div className="text-center relative min-h-screen flex justify-center items-center bg-[url('/background/RetreatCenterhero.jpg')] bg-cover bg-center bg-no-repeat py-[6.875rem]">
          {/* <video
              className="w-full h-auto mx-auto rounded-lg "
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
            </video> */}
          {/* <div className="max-md:hidden absolute top-0 w-full h-[13px] bg-[linear-gradient(0deg,rgba(3,1,27,0)_0%,#03011B_100%)] backdrop-blur-[5px]"></div>
            <div className="max-md:hidden absolute bottom-0 w-full h-44 bg-[linear-gradient(180deg,rgba(3,1,27,0)_0%,#03011B_100%)]"></div>
            <div className="max-md:hidden absolute top-0 left-0 bg-[linear-gradient(270deg,rgba(3,1,27,0)_0%,#03011B_100%)] h-full w-[132px] flex-shrink-0"></div>
            <div className="max-md:hidden absolute top-0 right-0 bg-[linear-gradient(90deg,rgba(3,1,27,0)_0%,#03011B_100%)] h-full w-[132px] flex-shrink-0"></div> */}
          <div
            className="m-auto max-w-[85%] xl:w-[50.063rem] border-[0.031rem] border-[#FFFFFF] bg-[#3F3E3E54] md:backdrop-filter backdrop-blur-[30px] rounded-[3rem] xl:p-[20px] p-[10px]"
            ref={homeSection}
          >
            <h1 className="w-auto md:text-[2.813rem] text-4xl leading-relaxed xl:leading-[2.813rem] font-bold font-poppinsNew bg-[linear-gradient(135deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent stroke-text">
              Welcome Home
            </h1>

            <div className="mt-3.5">
              <p className="xl:text-base text-xs text-[#FFFFFF] font-avenir text-opacity-90 xl:px-12">
                Kinship Agents is where creators turn their life's work into living AI agents — and where their people can find them. A cooperative ecosystem governed by members and dedicated to transforming how we grow, connect, live, and work together.
              </p>
            </div>

            <h1 className="w-auto xl:text-[1.375rem] text-[0.75rem] leading-[1.2] font-bold font-poppinsNew bg-[linear-gradient(135deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent stroke-text mt-4">
              Change Yourself. Change Your Life. Change The World.{" "}
            </h1>

            <div className="w-full mt-6">
              <button
                className="btn bg-[#EB8000] text-white border-none hover:bg-[#EB8000] w-[12rem]"
                onClick={() => scrollWithOffset(earlyAccessRef)}
              >
                Join Early Access
              </button>
            </div>
          </div>

          <div className=" absolute bottom-0 w-full h-[8.25rem] bg-[linear-gradient(180deg,rgba(3,1,27,0)_0%,#03011B_100%)] "></div>
        </div>

        <section
          className="mb-8 md:mt-12 mt-8 flex flex-col w-full h-full px-2 pt-4 pb-2 justify-center items-center"
          ref={belowHeroRef}
        >
          <div>
            <div
              ref={originStoryRef}
              className=" scroll-mt-[120px]"
              id="origin-story"
            >
              <h1 className="text-center font-bold xl:px-5 leading-[1] xl:w-[65.063rem] text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl m-auto font-goudy ">
                A creator marketplace for what matters the most.
              </h1>
              {/* <p className="max-md:text-sm text-center text-lg text-[#FFFFFFC7] mt-2.5 mb-5 px-3 leading-[110%] font-avenir">
                A journey to Mexico, a conversation with Four Arrows, and the
                moment Kinship Intelligence was born.
              </p> */}

              <div className="my-5 relative">
                <iframe
                  className=" w-[100%] xl:h-[35rem] h-64 rounded-lg"
                  // src="https://www.youtube.com/embed/Njj2c3BFDps?si=3NnN-km0Ggo35le6"
                  src="https://www.youtube.com/embed/OM5V7DlLa74"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>

                {/* Bottom shadow */}
                <div className="pointer-events-none absolute bottom-0 w-full h-[10.75rem] bg-[linear-gradient(180deg,rgba(3,1,27,0)_0%,#03011B_100%)]"></div>

                {/* Right shadow */}
                <div className="pointer-events-none absolute top-0 right-0 w-[8.25rem] h-full bg-[linear-gradient(90deg,rgba(3,1,27,0)_0%,#03011B_100%)]"></div>

                {/* Left shadow */}
                <div className="pointer-events-none absolute top-0 left-0 w-[8.25rem] h-full bg-[linear-gradient(-90deg,rgba(3,1,27,0)_0%,#03011B_100%)]"></div>
              </div>
            </div>

            <div className="xl:w-[64.313rem] m-auto">
              <p className="max-md:text-sm max-md:px-2 text-center text-lg text-[#FFFFFFC7] px-[2rem] mt-5 font-avenir">
                Creators have always had platforms for their content. Kinship Agents is something different — a marketplace for living AI agents that carry forward the full depth of who you are. In this short film, our founder shares the unlikely path that led here, and what it means for creators, communities, and the people they serve.
              </p>

              {/* <p className="bg-[linear-gradient(180deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent text-xl text-center font-bold mt-5">
                David Levine, Founder & CEO <br />
                Kinship Bots Club
              </p> */}
            </div>
          </div>

          <div className="mt-[3rem] max-md:mt-8">
            <div
              ref={kinshipIntelligenceRef}
              className="scroll-mt-[120px]"
              id="kinship-intelligence"
            >
              <h1 className="text-center font-bold xl:px-12 leading-[1.2] xl:w-[65.063rem] text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl max-md:leading-relaxed m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
                AI is the Most Powerful Infrastructure Ever Built.
              </h1>
              <p className="max-sm:text-xl text-3xl leading-[110%] tracking-[-0.02em] font-bold text-center text-[#FFFFFFC7] font-avenirNext mt-2 mb-5">
                And It’s Pointed in the Wrong Direction.
              </p>
            </div>
            <div className="my-5">
              <p className="font-avenir max-md:text-sm max-md:px-2 max-md:mt-4 text-[1.188rem] leading-[110%] font-normal text-center text-[#FFFFFFC7] xl:px-[2rem] xl:w-[64.313rem] m-auto">
                AI systems around the world are being optimized for engagement,
                efficiency, productivity, and profit. <br />
                <br />
                The result: we’re massively accelerating the velocity of a
                civilization already headed toward a cliff. Authoritarianism,
                poverty, mass displacement, disease, war, the mental health
                crisis, and planetary ecosystem collapse are the major symptoms
                of a society that is out of control and running on autopilot.
                <br />
                <br />
                The only two options on the table are accelerate or regulate.
                <br />
                <br />
                Until now.
                <br />
                <br />
                Kinship is a new choice. A network where creators turn their
                deepest wisdom into living AI agents — and where those agents
                reach people everywhere, through an exchange and affiliate
                network that rewards real impact.
                <br />
                <br />
                We're not standing outside the system pointing at what's broken.
                We're building inside it, with creators who know what it takes
                to create real change.
                <br />
                <br />
                And here's the thing… when you point AI agents at the deepest,
                most critical issues facing our society, then engagement,
                efficiency, productivity, and profit all follow.
              </p>
            </div>
          </div>
        </section>

        <div className="xl:w-[64.313rem] m-auto">
          <h1 className="text-center font-bold leading-[1] xl:w-[60.063rem] md:text-3xl max-md:text-xl max-md:leading-relaxed m-auto font-goudy bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            Infrastructure for what comes next.
          </h1>
          <p className="max-md:text-sm font-avenir text-center text-[#FFFFFFC7] mt-[1rem]">
            A cooperative agent network, built on four integrated systems. Every Kinship agent is aware of the others — sharing context, coordinating with creators, cooperating on behalf of members. The result is a living ecosystem that compounds in value: for creators who build, for members who engage, and for the network as a whole.
          </p>
        </div>
        <div className="container xl:max-w-[79.5rem] mx-auto grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-5 px-3 max-xl:mt-5 xl:mt-10 mb-4">
          {platformItems.map((item) => (
            <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] xl:w-[18.938rem] rounded-xl">
              <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl py-6 px-3 h-full">
                <p className="text-white font-bold text-[1.375rem] text-center font-avenirNext">
                  {item.title}
                </p>
                <p className="text-white font-bold text-lg text-center font-avenirNext">
                  {item.subtitle}
                </p>
                <div className="text-[0.938rem] font-avenir leading-[100%] text-center mt-2">
                  <p className="text-[#CDCDCDE5] font-avenir">{item.intro} </p>
                  <p className="text-[#CDCDCDE5] font-avenir">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 scroll-mt-[120px]" id="founding-creator">
          <h1 className="text-center font-bold xl:px-10 leading-tight xl:w-[65.063rem] text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            The Vibes Are Immaculate
          </h1>

          <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[60rem] mt-5 mb-2 m-auto">
            Creators set the Vibes, the tone, personality, style, and emotional
            texture of their agents, which are always, underneath it all, attuned
            to the Harmony, Empowerment, Artistry, Reason, Trust, and Synthesis
            (HEARTS) of the members.
            <br />
            <br />
            HEARTS is a scientific framework rooted in neuroscience, developmental
            psychology, motivation science, depth psychology, organizational
            development, and systems theory.
            <br />
            <br />
            The conditions for individual, organizational, and ecosystem
            flourishing are well-understood, measurable, and now, for the first
            time, available throughout an agentic AI network.
            <br />
            <br />
            These capacities aren't metrics or objectives. They are qualities that
            every agent monitors, every experience cultivates, and every
            interaction quietly supports.
            <br />
            <br />
            They ensure coherence over chaos, cohesion over coercion, and
            cooperation over competition.
          </p>
        </div>

        <div className="px-3">
          <div className="max-md:px-3 max-w-[58.063rem] max-md:mt-5 grid max-md:grid-cols-1 max-lg:grid-cols-2 grid-cols-3 gap-[1.875rem] mt-[3rem] px-3 mx-auto">
            {principles.map((item) => (
              <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] w-full min-h-[12.313rem] rounded-xl  ">
                <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl ps-[0.375rem] pe-[0.313rem] pt-5 pb-[1.125rem] h-full">
                  <p className="text-white font-bold text-xl text-center font-avenirNext">
                    {item.title}
                  </p>
                  <p className="text-white font-bold text-[0.875rem] leading-[100%] -tracking-[1% text-center my-2.5 font-avenirNext">
                    {item.subtitle}
                  </p>
                  <p className="text-[#CDCDCDE5] text-[0.875rem] leading-[100%] font-avenir -tracking-[1%] text-center">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-[15rem] m-auto mt-10">
            <button
              className="btn bg-[#EB8000] text-white border-none hover:bg-[#EB8000] w-full"
              onClick={() => scrollWithOffset(earlyAccessRef)}
            >
              Join Early Access
            </button>
          </div>
        </div>

        <div className="mt-9 max-md:mt-6 max-md:px-3">
          <div
            ref={collectiveEconomicsRef}
            className="scroll-mt-[120px]"
            id="collective-economic"
          >
            <h1 className="text-center font-bold px-12 text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl leading-[1.2] m-auto font-goudy bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
              A Creator Economy that Works for You
            </h1>

            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[65rem] m-auto mt-2.5">
              On YouTube, you need a million views to make rent. On Spotify, a million streams pays less than a shift at a coffee shop. On Substack, readers are drowning in subscriptions and no longer willing to pay. TikTok and Instagram can change the algorithm tomorrow and erase your reach overnight. Facebook monetizes your audience and sells their attention to the highest bidder. Across all of these platforms, creators build on rented land, subject to rules they didn't write, optimized for engagement patterns that have nothing to do with the benefits of their work.
              <br />
              <br />
              Kinship is different.
              <br />
              <br />
              When you create an agent on Kinship, you own it. You inform it. You instruct it. You empower it. You align it. And you reap the rewards.
              You earn royalties every time a member engages with your agents. You can stock your online store with offerings, premium agents, goods and services delivered digitally or IRL. You have a built-in affiliate network of Champions who earn commissions by promoting your work. 
              <br />
              <br />
              The economics are transparent, the payouts are direct, and income scales with impact, not impressions.
            </p>

            <h3 className="my-4 text-center font-bold px-12 text-[2.5rem] max-xl:text-3xl max-md:text-2xl max-sm:text-lg leading-[1.2] m-auto font-goudy bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
              Your Life Has Many Facets. Your Agents Should Too.
            </h3>

            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] xl:w-[60rem] mx-auto font-medium">
              Kinship membership is nested. Individuals have a Presence. Teams and studios run Projects. Organizations and institutions operate Platforms. All three layers run on the same cooperative network, and all agents across every layer cooperate through Kinship Intelligence.
            </p>

            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] xl:w-[60rem] mx-auto font-medium">
              A single member can participate in multiple Projects and Platforms, each with different agents representing them in a particular context. Your work Presence might be focused, formal, and task-oriented. Your creative community Presence might be open, exploratory, and warm. Your family Presence might be something else entirely. Each one operates independently, with its own Vibes and its own Actors, but all of them serve you, are guided by you, and are aligned to your HEARTS.
            </p>

            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] xl:w-[60rem] mx-auto font-medium">
              The network holds it all together. The agents know each other, respect your privacy, and ensure you’re supported in each and every context. Signals flow. Nothing is siloed. Everyone cooperates. Everything is cohesive. Coherence is maintained.
            </p>

          </div>
        </div>
        <div className="max-xl:container grid grid-cols-3 gap-[1.875rem] max-xl:grid-cols-2 max-md:grid-cols-1 xl:my-10 xl:w-[78.125rem] mx-auto mt-12 px-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] xl:w-[18.125rem] rounded-xl"
            >
              <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] text-center rounded-xl pt-5 pb-[1.688rem] ps-1.5 pe-[0.313rem] flex flex-col justify-between max-lg:min-h-[19.688rem] max-xl:min-h-[17.5rem] max-md:min-h-[16.688rem] h-full">
                <div>
                  <p className="text-white font-bold text-xl leading-[110%] font-avenirNext">
                    {plan.title}
                  </p>
                  <p className="text-white font-bold text-[0.938rem] mt-[1.375rem] font-avenirNext">
                    {plan.subtitle}
                  </p>
                  <div className="text-[#CDCDCDE5] mt-2 font-avenir text-[0.938rem] leading-[110%] tracking-[-0.02em]">
                    {plan.seats}
                  </div>
                  <p className="text-[#CDCDCDE5] font-avenir text-[0.938rem] leading-[110%] tracking-[-0.02em]">
                    {plan.description}
                  </p>
                </div>

                {/* 
                <ul className="w-max mx-auto font-avenirNext text-[#FFFFFFE5] list-disc text-[0.875rem] leading-[110%] mt-5 font-normal">
                  <li className="font-bold">{plan.pricing}</li>
                </ul>  
                  */}
              </div>
            </div>
          ))}
        </div>

        <div className="xl:w-[60rem] m-auto mt-10 mb-[0.938rem] max-md:mt-8 max-md:mb-0">
          <div>
            <h1 className="text-center font-bold px-12 leading-[1] md:text-[30px] max-md:text-xl max-md:leading-relaxed m-auto font-PoppinsNew  text-[#FFFFFFC7]">
              Distribution of funds
            </h1>
            <div className="max-w-[49.813rem] mx-auto px-3">
              <p className="text-[#FFFFFFC7] max-md:text-sm mt-2 text-center font-avenir">
                Every penny of membership dues goes back into the ecosystem,
                creating a truly circular economy. No extraction, no
                exploitation, just wholesome goodness.
              </p>

              <ul className="w-max font-avenirNext text-[#FFFFFFE5] list-disc text-[0.875rem] leading-[110%] mt-5 font-normal m-auto">
                <p className="text-[#FFFFFFC7] max-md:text-sm font-avenir my-2">
                  <b>35%</b> pays for software development, moderation, systems,
                  and support.*
                </p>

                <p className="text-[#FFFFFFC7] max-md:text-sm font-avenir my-2">
                  <b>30%</b> goes to commissions for enrollment, distributed
                  across 4 levels of the lineage (<b>20%</b> goes to Level 1,{" "}
                  <b>5%</b> to goes to Level 2, <b>3%</b> to Level 3, <b>2%</b>{" "}
                  to Level 4)
                </p>

                <p className="text-[#FFFFFFC7] max-md:text-sm font-avenir my-2">
                  <b>25%</b> goes to creator royalties, distributed according to
                  agent usage
                </p>

                <p className="text-[#FFFFFFC7] max-md:text-sm font-avenir my-2">
                  <b>5%</b> goes to curators,
                  <p className="text-[#FFFFFFC7] max-md:text-sm font-avenir my-2">
                    <b>5%</b> is distributed as loyalty rewards (with <b>4%</b>{" "}
                    going to back to the member and <b>1%</b> going to the
                    Champion who enrolled the member)
                  </p>
                </p>
              </ul>

              <p className="text-[#FFFFFFC7] max-md:text-sm font-avenir mt-4">
                Payments for offerings, which include premium agents, goods,
                services, and experiences, go directly to the creators, with
                transaction fees paid to the platform and to the four levels of
                relationships of the purchaser.
              </p>

              <p className="text-[#FFFFFFC7] max-md:text-sm mt-2 font-avenir">
                *The cooperative licenses its software from Kinship Intelligent
                Software Syndicate (KISS), a Delaware C Corporation that handles
                engineering, infrastructure, and platform development. The
                license is irrevocable and includes full source code — the
                cooperative can operate independently even if KISS is acquired
                or dissolved. Kinship DAO SPC, a Cayman Islands Segregated
                Portfolio Company, manages the on-chain economic infrastructure.
                Kinship Intelligence Institute, a nonprofit public charity,
                advances research and the global mission. Kinship Systems, LLC
                provides consulting and enterprise integration. The cooperative
                runs the public platform, owns the member relationship, and
                governs itself. The 35% funds the development that makes
                everything else possible.
              </p>
            </div>
          </div>
        </div>

        <div className="xl:w-[60rem] m-auto mt-10 mb-[0.938rem] max-md:mt-8 max-md:mb-0">
          <div>
            <h1 className="text-center font-bold px-12 leading-[1] md:text-[30px] max-md:text-xl max-md:leading-relaxed m-auto font-PoppinsNew  text-[#FFFFFFC7]">
              Why This Matters
            </h1>

            <div className="max-w-[49.813rem] mx-auto px-3">
              <p className="text-[#FFFFFFC7] max-md:text-sm mt-2 text-center font-avenir">
                Platforms are organized around the purpose of whoever owns it.
              </p>
              <p className="text-[#FFFFFFC7] max-md:text-sm text-center font-avenir">
                Social platforms are organized around attention — yours, sold to
                advertisers. Business platforms are organized around workflow —
                you're a node in a pipeline. Entertainment platforms are
                organized around consumption — keep watching, keep subscribing.
              </p>

              <p className="text-[#FFFFFFC7] max-md:text-sm mt-2 text-center font-avenir">
                Kinship is organized around your life and your work — because
                you own it.
              </p>

              <p className="text-[#FFFFFFC7] max-md:text-sm mt-2 text-center font-avenir">
                When the members are the owners, the software serves the
                members. The incentives, the economics, the governance, and the
                AI all point in the same direction: toward the people on the
                platform.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            className="btn bg-[#EB8000] font-avenirNext py-[1.063rem] ps-[1.875rem] pe-[1.813rem] text-lg font-extrabold leading-[100%] text-white border-none hover:bg-[#EB8000]"
            onClick={() => scrollWithOffset(earlyAccessRef)}
          >
            Join Early Access
          </button>
        </div>

        <div
          className="mt-[2.875rem] max-md:mt-12 max-md:px-3"
          ref={foundingCreatorsRef}
        >
          <h1 className="text-center font-bold xl:px-12 leading-[1.2] xl:w-[65.063rem] text-[3.75rem]  max-xl:text-5xl max-md:text-4xl max-sm:text-2xl m-auto font-goudy bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            A Living Body of Wisdom
          </h1>
          <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[65rem] m-auto mt-5">
            Behind every experience in Kinship is a living body of wisdom—honed
            over decades by dedicated practitioners and guides. We call them
            Sages. Every creator can grow into a Sage. As your work deepens and
            resonates within the community, you can be recognized, nominated,
            and selected by fellow members—becoming part of this lineage of
            wisdom.
          </p>
          <p className="ttext-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[65rem] m-auto">
            Sages' work shows up throughout Kinship: in dialogue, stories,
            adventures, and shared challenges. Some of this wisdom is woven into
            the fabric of scenarios; some is available directly through the
            Sages themselves as AI companions trained on their teachings.
            Kinship holds this work with integrity—ensuring that even the most
            profound insights remain practical, accessible, and alive.
          </p>
        </div>
        <p className="text-center font-avenirNext text-[1.188rem] font-bold leading-[110%] tracking-[-0.02em] mt-6">
          Meet a Few of our Founding Sages.{" "}
        </p>

        <div className="max-xl:container max-xl:px-3 max-md:mt-5 grid max-md:grid-cols-1 max-lg:grid-cols-2 grid-cols-3 gap-x-[1.625rem] gap-y-[1.875rem] my-[2.563rem] xl:w-[57.625rem] mx-auto">
          {pathways.map((pathway) => (
            <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] xl:w-[18.125rem] max-md:min-h-[6rem] min-h-[13.063rem] rounded-xl">
              <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl py-[1.438rem] ps-[0.375rem] pe-[0.313rem] h-full">
                <p className="text-white font-avenirNext font-bold text-xl text-center">
                  {pathway.name}
                </p>
                <p className="text-white font-avenirNext font-bold text-lg text-center ">
                  {pathway.theme}
                </p>
                <p className="text-[#CDCDCDE5] font-avenir text-base text-center mt-2">
                  {pathway.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {currentStep === 1 && (
          <Step1
            onSuccess={() => setCurrentStep(2)}
            earlyAccessRef={earlyAccessRef}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 2 && (
          <Step2
            onSuccess={() => setCurrentStep(3)}
            earlyAccessRef={earlyAccessRef}
            onBack={() => setCurrentStep(1)}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 3 && (
          <Step3
            onSuccess={() => setCurrentStep(4)}
            earlyAccessRef={earlyAccessRef}
            onBack={() => setCurrentStep(1)}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 4 && (
          <Step4
            onSuccess={() => setCurrentStep(5)}
            earlyAccessRef={earlyAccessRef}
            onBack={() => setCurrentStep(3)}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 5 && (
          <Step5
            onSuccess={() => setCurrentStep(6)}
            earlyAccessRef={earlyAccessRef}
            onBack={() => setCurrentStep(4)}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 6 && (
          <Step6
            onSuccess={() => setCurrentStep(7)}
            earlyAccessRef={earlyAccessRef}
            onBack={() => setCurrentStep(4)}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 7 && (
          <Step7
            onSuccess={() => setCurrentStep(8)}
            earlyAccessRef={earlyAccessRef}
            onBack={() => setCurrentStep(6)}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        {currentStep === 8 && (
          <Step8
            onBack={() => setCurrentStep(7)}
            earlyAccessRef={earlyAccessRef}
            setShowMsg={setShowMsg}
            setMsgClass={setMsgClass}
            setMsgText={setMsgText}
          />
        )}
        <section className="max-md:pt-7 max-md:pb-0 pb-16 max-w-[1144px] mx-auto">
          <h3 className="transition duration-300 place-self-center sm:text-left md:text-[3.125rem] max-md:text-xl max-md:leading-relaxed sm:text-[52px] font-goudy font-bold leading-[3.75rem] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
            A Message from Moto
          </h3>
          <div className="xl:flex items-start mt-5">
            <div className="w-full h-[350px] xl:w-[433px] xl:h-[430px] shrink-0 rounded-[30px] bg-[lightgray] bg-center bg-cover bg-no-repeat bg-[url('https://storage.googleapis.com/mmosh-assets/home/home9.png')] xl:mr-4"></div>{" "}
            <div className="flex flex-col px-4 xl:w-[695px]">
              <p className="text-justify font-avenir text-base sm:text-[1.063rem] max-md:leading-relaxed font-normal leading-[100%] tracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                For as long as I can remember, I've lived two lives. One
                directed — a family member, a scholar, an entrepreneur building
                systems and running companies. The other reflective — a poet, a
                ceremonial leader, a trickster, a seer, someone drawn to the
                edges of consciousness and the deep inner work that doesn’t fit
                on a resume.
              </p>
              <p className="text-justify font-avenir text-base sm:text-[1.063rem] max-md:leading-relaxed font-normal leading-[100%] tracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                For most of my life I kept them separate, because I thought I
                had to. Maybe you can relate. You know how to perform in the
                world. You also know there's something deeper running underneath
                — something the culture doesn't have a name for. So you
                compartmentalize. The strategic mind goes to work. The deeper
                self lays dormant.
              </p>
              <p className="text-justify font-avenir text-base sm:text-[1.063rem] max-md:leading-relaxed font-normal leading-[100%] tracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                Together, we're building systems that notice, respond, steady,
                and strengthen—that help people meet themselves and one another
                more fully, and engage the world with greater clarity, courage,
                and care.
              </p>

              <p className="text-justify font-avenir text-base sm:text-[1.063rem] max-md:leading-relaxed font-normal leading-[100%] tracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                A few years ago that split became untenable — for me personally,
                and by my reckoning, for much of the world at large. So I went
                looking for integration. I worked with hypnotherapists, depth
                psychologists, intuitives, activists, and energy healers. I
                joined retreats, stargate activations, plant medicine
                ceremonies, and communities experiencing radically divergent
                models of reality. And I came back each time faced with the same
                challenge: carrying the value of the insights and experiences
                gained into my so-called “ordinary” daily life.
              </p>

              <p className="text-justify font-avenir text-base sm:text-[1.063rem] max-md:leading-relaxed font-normal leading-[100%] tracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                I built Kinship to solve that. A platform where the inner work
                and the outer work run on the same infrastructure. Where you
                don't have to choose between being effective and being whole.
                Where the community holds what you can't hold alone, and the AI
                agents hold space for you to become whole again.
              </p>

              <p className="text-justify font-avenir text-base sm:text-[1.063rem] max-md:leading-relaxed font-normal leading-[100%] tracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                If that split is something you recognize, and want to heal in
                yourself, come join us.
              </p>

              <div className="text-[16px] italic font-semibold leading-[110%] ttracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] mt-2.5">
                – David "Moto" Levine
                <br />
                Founder
              </div>
            </div>
          </div>
        </section>
        <section
          className="px-4 max-md:my-6 my-10 mx-auto"
          ref={testimonialsSection}
        >
          <div className="w-full px-4">
            <div className="relative max-w-[80rem] mx-auto">
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-[-2%] 2xl:left-[-5%] transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-[-2%] 2xl:right-[-5%] transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10"
              >
                {/* Right Arrow SVG */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Grid Layout */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                {visibleTestimonials.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] text-white rounded-xl p-6 shadow-xl text-center border border-[#FFFFFF42]"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="mx-auto mb-4 w-16 h-16 rounded-full object-cover border-2 border-white"
                    />
                    <p className="text-base italic mb-4 font-avenir">
                      "{item.text}"
                    </p>
                    <h3 className="font-extrabold text-lg font-avenirLtStd">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-300 font-avenirLtStd">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

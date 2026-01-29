"use client";

import React from "react";
import { useRef, useState } from "react";
import AlertModal from "../(main)/components/Modal";
import KinshipBots from "@/assets/icons/KinshipBots";
import Button from "../(main)/components/common/Button";
import useCheckDeviceScreenSize from "@/app/lib/useCheckDeviceScreenSize";
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
import { useSearchParams } from "next/navigation";

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
    id: "professional",
    title: "Professional",
    subtitle: "For individuals and small practices",
    seats: "1–4 seats",
    description:
      "Perfect for solo practitioners, coaches, consultants, and early adopters who want to develop their own capacity and explore Kinship's approach to transformation.",
    pricing: "$30/month or $100/year per seat",
  },
  {
    id: "team",
    title: "Team",
    subtitle: "For small groups and departments",
    seats: "5–34 seats (minimum 5)",
    description:
      "Designed for small teams, startups, boutique agencies, clinics, and studios building relational capacity and psychological safety together.",
    pricing: "$25/month or $80/year per seat",
  },
  {
    id: "organization",
    title: "Organization",
    subtitle: "For institutions and enterprises",
    seats: "35+ seats",
    description:
      "Built for larger companies, health systems, universities, associations, NGOs, governments, and networks embedding wholeness into culture and operations.",
    pricing: "$20/month or $70/year per seat",
  },
  {
    id: "creator",
    title: "Creator",
    subtitle: "For designers of transformation",
    seats: "Individual membership",
    description:
      "Creator membership includes full access to Kinship Studio and the Exchange. Design immersive scenarios, publish your work, and earn based on usage and engagement—or create private experiences and set your own pricing. Creators are paid from a shared pool and retain ownership of their work within cooperative governance.",
    pricing: "$120/month or $950/year",
  },
];

const pathways: Pathway[] = [
  {
    id: "four-arrows",
    name: "Four Arrows",
    theme: "Indigenous Worldview",
    description:
      "Worldview reflection, sacred communication, self-hypnosis, and fearless courage—rooted in a living, interconnected universe where all beings are kin.",
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
    subtitle: "Belonging you can rely on.",
    description:
      "Kinship strengthens your ability to connect, collaborate, repair, and stay present with others—even under pressure. Harmony isn't about avoiding conflict; it's about developing the relational capacity for empathy, honesty, and mutual care that holds through tension and change.",
  },
  {
    id: "empowerment",
    title: "Empowerment",
    subtitle: "Choice that's actually yours.",
    description:
      "Through real challenges, Kinship builds the capacity to say yes and no with clarity—without collapse, rebellion, or rigidity. Empowerment becomes grounded, flexible, and self-directed: the ability to act from your own center, especially when the stakes are real.",
  },
  {
    id: "artistry",
    title: "Artistry",
    subtitle: "Growth through practice.",
    description:
      "Kinship replaces abstract learning with lived skill. You develop competence by doing—experimenting, adapting, and refining your response to life's challenges. Artistry emerges through openness, persistence, and integration: the craft of showing up well.",
  },
  {
    id: "reason",
    title: "Reason",
    subtitle: "Meaning in motion.",
    description:
      "Reason isn't intellectual distance—it's the capacity to align action with what matters most. Kinship helps you discover and enact purpose through contribution, service, and creative engagement, so meaning becomes lived rather than declared.",
  },
  {
    id: "trust",
    title: "Trust",
    subtitle: "Let yourself rest and respond.",
    description:
      "Kinship trains trust as a capacity, not a condition. Through recovery, regulation, and relational support, you build the ability to stay grounded, recover from stress, and remain open—even in uncertainty. Trust allows you to move between effort and rest.",
  },
  {
    id: "synthesis",
    title: "Synthesis",
    subtitle: "Bringing inner and outer into wholeness.",
    description:
      "Kinship helps you integrate the expressive and receptive aspects of being—bridging psyche and cosmos, action and reflection, doing and being. Synthesis is the capacity to hold complexity, honor paradox, and move fluidly between worlds without fragmentation.",
  },
];

const platformItems: PlatformItem[] = [
  {
    id: "bots",
    title: "Kinship Bots",
    subtitle: "The Mobile Experience",
    intro: "A living, interactive environment where people learn by doing.",
    description:
      "Kinship Bots delivers immersive scenarios, challenges, and integrations that feel more like a retreat than a training program—while reliably building relational, emotional, and ethical capacity over time. This is where practice happens, alone and together.",
  },
  {
    id: "studio",
    title: "Kinship Studio",
    subtitle: "The Design Environment",
    intro:
      "A professional workspace for consultants, facilitators, and organizations",
    description:
      "Kinship Studio lets you design experiences—not content—by encoding your frameworks, practices, and insights into interactive scenarios that people return to, train with, and integrate over time. This is where transformation gets built.",
  },
  {
    id: "exchange",
    title: "Kinship Exchange",
    subtitle: "The Cooperative Marketplace",
    intro: "A values-aligned economy for living work.",
    description:
      "Through the Exchange, creators offer programs, templates, and experiences—earning through participation, engagement, and trusted referral. Value circulates within the community, supporting both sustainability and integrity. This is where contribution meets reciprocity.",
  },
  {
    id: "intelligence",
    title: "Kinship Intelligence",
    subtitle: "The Orchestration Layer",
    intro: "The connective tissue that brings it all together.",
    description:
      "Kinship Intelligence orchestrates context, memory, adaptation, and care—personalizing experiences, tracking growth, supporting safety, and ensuring that learning compounds rather than fades. This is the difference between a set of tools and a living system.",
  },
];

export default function LandingPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const screenSize = useCheckDeviceScreenSize();

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

  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("success");
  const [msgText, setMsgText] = React.useState("");

  return (
    <div className="relative h-full">
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
              href="https://kinship.today"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-white cursor-pointer"
            >
              Go Deeper
            </a>
          </div>

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
            className="m-auto max-w-[85%] xl:w-[50.063rem] border-[0.031rem] border-[#FFFFFF] bg-[#01000A14] md:backdrop-filter backdrop-blur-[20px] rounded-[3rem] xl:p-[20px] p-[10px]"
            ref={homeSection}
          >
            <h1 className="w-auto md:text-[2.813rem] text-4xl leading-relaxed xl:leading-[2.813rem] font-bold font-poppinsNew bg-[linear-gradient(135deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent stroke-text">
              Awaken Your Power{" "}
            </h1>
            <h1 className="w-auto xl:text-[1.375rem] text-[0.75rem] leading-[110%] font-bold font-poppinsNew bg-[linear-gradient(135deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent stroke-text">
              With a Retreat Center in the Palm of Your Hand{" "}
            </h1>
            <div className="mt-3.5">
              <p className="xl:text-base text-xs text-[#FFFFFF] font-avenir text-opacity-90 xl:px-12">
                Big Tech has given you countless tools for the mind
                (productivity, information, analysis) and for the body (fitness,
                nutrition, wearables). But your heart and soul—how you live,
                relate, choose, repair, grieve, create, and belong—are left to
                atrophy.
              </p>
            </div>
            <p className="xl:text-base text-xs text-[#ffffff]/90 xl:px-12 font-avenir">
              Kinship Bots is a mobile app that brings a fully staffed retreat
              center into the palm of your hand—built on rigorous science
              including Self-Determination Theory, neuroscience, and archetypal
              depth psychology.
            </p>
            <p className="xl:text-base text-xs text-center text-white xl:px-12 font-avenir">
              Anytime, anywhere, when you're at your peak or when you need it
              most, you can test your limits in the gym, recover and restore in
              our spa, or embark on luminous journeys of wonder and awe. Not
              therapy. Not social media. Not a game.{" "}
            </p>
            <p className="xl:text-base text-xs text-center text-white font-bold xl:px-12 font-avenir">
              This is resistance training for what makes us fully human.
            </p>

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
                I went to make a film. <br />I returned with a mission.
              </h1>
              {/* <p className="max-md:text-sm text-center text-lg text-[#FFFFFFC7] mt-2.5 mb-5 px-3 leading-[110%] font-avenir">
                A journey to Mexico, a conversation with Four Arrows, and the
                moment Kinship Intelligence was born.
              </p> */}

              <div className="my-5 relative">
                <iframe
                  className=" w-[100%] xl:h-[35rem] h-64 rounded-lg"
                  // src="https://www.youtube.com/embed/Njj2c3BFDps?si=3NnN-km0Ggo35le6"
                  src="https://www.youtube.com/embed/o-VRMB0-R98?si=y9WU6nEHsb2e7qJ7"
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
              <h1 className="text-center font-avenir font-[800] text-[30px] leading-[110%] tracking-[-0.02em] xl:w-[60.063rem] mx-auto">
                From Protest to Transformation
              </h1>
              <p className="max-md:text-sm max-md:px-2 text-center text-lg text-[#FFFFFFC7] px-[2rem] mt-5 font-avenir">
                I set out to make an activist film about my community fighting a
                polluting factory. Protest matters—it draws lines, surfaces
                harm, buys time for truth to emerge.
              </p>
              <p className="max-md:text-sm max-md:px-2 text-center text-lg text-[#FFFFFFC7] px-[2rem] font-avenir">
                But in Mexico, interviewing Four Arrows after our campaign had
                fractured and the factory went into production, I understood
                something deeper:{" "}
                <span className="text-white font-bold text-lg font-avenirNext">
                  {" "}
                  activism alone isn't enough.{" "}
                </span>{" "}
              </p>
              <p className="max-md:text-sm max-md:px-2 text-center text-lg text-[#FFFFFFC7] px-[3rem] font-avenir">
                You can't transform a system from the outside because there is
                no outside. Systems persist by design. They reward disconnection
                and compliance over integrity and care.
              </p>

              <p className="max-md:text-sm max-md:px-2 text-center text-lg text-[#FFFFFFC7] px-[3rem] font-avenir">
                The executives I opposed weren't villains. In another life, we
                might have been friends. They didn't want to exploit any more
                than communities want to be sacrificed. Everyone was trapped in
                the same invisible structure.
              </p>

              <p className="max-md:text-sm max-md:px-2 text-center text-lg text-[#FFFFFFC7] px-[2rem] font-avenir">
                Four Arrows showed me that{" "}
                <span className="text-white font-bold text-lg font-avenirNext">
                  lasting change doesn't come from fighting the system head-on.
                  It comes from changing the inner conditions
                </span>{" "}
                that shape how people think, choose, relate, and lead.
              </p>

              <p className="max-md:text-sm max-md:px-2 text-center text-lg text-[#FFFFFFC7] px-[3rem] font-avenir">
                When those conditions shift, culture shifts. When culture
                shifts, systems shift.
              </p>

              <p className="max-md:text-sm max-md:px-2 text-center text-lg text-[#FFFFFFC7] px-[3rem] font-avenir">
                This film captures that turning point, when Kinship Intelligence
                was born.
              </p>

              <p className="max-md:text-sm max-md:px-2 text-center text-lg text-[#FFFFFFC7] px-[2rem] font-avenir">
                <span className="text-white font-bold text-lg font-avenirNext">
                  Kinship is transformation operationalized
                </span>{" "}
                —a sociotechnical platform that brings emotional, relational,
                and ethical capacity into how we learn, work, and decide
                together. This isn’t content about change, but this creates the
                conditions for change.
              </p>
              <p className="max-md:text-sm max-md:px-2 text-center text-lg text-[#FFFFFFC7] px-[3rem] font-avenir">
                It's designed for people and organizations who know the future
                won't be built by ideology alone, but by leaders and teams
                capable of acting with clarity, courage, and care—inside the
                systems that shape our world.
              </p>

              {/* <p className="bg-[linear-gradient(180deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent text-xl text-center font-bold mt-5">
                David Levine, Founder & CEO <br />
                Kinship Bots Club
              </p> */}
            </div>
          </div>

          <div className="mt-24 max-md:mt-12">
            <div
              ref={kinshipIntelligenceRef}
              className="scroll-mt-[120px]"
              id="kinship-intelligence"
            >
              <h1 className="text-center font-bold xl:px-12 leading-[1] xl:w-[65.063rem] text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl max-md:leading-relaxed m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
                From Content to Capacity
              </h1>
              <p className="max-sm:text-xl text-3xl leading-[110%] tracking-[-0.02em] font-bold text-center text-[#FFFFFFC7] font-avenirNext mt-2.5 mb-5">
                From Content to Capacity
              </p>
            </div>
            <div className="my-5">
              <p className="font-avenir max-md:text-sm max-md:px-2 max-md:mt-4 text-[1.188rem] leading-[110%] font-normal text-center text-[#FFFFFFC7] xl:px-[2rem] xl:w-[64.313rem] m-auto">
                Most platforms deliver content to consume and tasks to track.
                Kinship Intelligence is different. It's a living system for
                shared learning and personal growth, where people stay in
                relationship, practice together, and evolve as a community.
                Traditional consulting, workshops, and training can spark
                insight—but insight alone rarely sticks. Without ongoing
                practice and real-world application, even the most powerful
                ideas are overwhelmed by old habits.{" "}
                <span className="text-white font-bold text-lg font-avenirNext">
                  {" "}
                  Kinship turns wisdom into lived capacity.{" "}
                </span>{" "}
                It gives consultants and learning teams a way to operationalize
                their work—embedding it into experiences people return to,
                practice together, and integrate over time. Instead of
                delivering insights and hoping they land, you create
                environments where learning holds, relationships deepen, and
                transformation becomes sustainable. Rather than packaging wisdom
                and moving on, you build living systems that grow with the
                people inside them—and generate lasting value for everyone
                involved.
              </p>
            </div>
          </div>
        </section>

        <div className="xl:w-[64.313rem] m-auto">
          <h1 className="text-center font-bold leading-[1] xl:w-[60.063rem] md:text-3xl max-md:text-xl max-md:leading-relaxed m-auto font-goudy bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            Living infrastructure for collective evolution.
          </h1>
          <p className="max-md:text-sm font-avenir text-center text-[#FFFFFFC7] mt-[1rem]">
            Together, these four components turn wisdom into practice, learning
            into capacity, and insight into lasting change—at the individual,
            organizational, and societal scale.
          </p>
        </div>
        <div className="container xl:max-w-[79.5rem] mx-auto grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1 gap-5 px-3 max-xl:my-5 xl:my-10">
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
        <div
          ref={foundingCreatorsRef}
          className="px-3 scroll-mt-[120px]"
          id="founding-creator"
        >
          <h1 className="text-center font-bold xl:px-10 leading-tight xl:w-[65.063rem] text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            Change Yourself, Change Your Life, Change The World.
          </h1>

          <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[60rem] mt-5 mb-2 m-auto">
            Kinship works like resistance training for the inner life—balanced
            with deep recovery. You'll face meaningful challenges that build
            courage, capacity, and connection, then integrate through rest,
            reflection, and shared experience. Inside immersive scenarios that
            feel like an ongoing retreat or workshop—not a checklist—growth
            happens naturally, with others, in a space that's engaging,
            intimate, and alive.
          </p>
        </div>

        <div className="mt-9 px-3">
          <h1 className="text-center text-[#FFFFFFC7] font-avenirNext font-bold leading-[1] xl:w-[60.063rem] md:text-3xl max-md:text-xl tracking-[-0.02em] max-md:leading-relaxed m-auto">
            Six Core Capacities for Human Flourishing{" "}
          </h1>
          <p className="text-center max-md:text-sm text-lg font-avenir text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[68.25rem] mt-5 mb-2 m-auto">
            Kinship is built on HEARTS—a framework grounded in
            Self-Determination Theory, neuroscience, and depth psychology. These
            six capacities work together as an integrated system:
            <span className="text-white font-bold text-lg font-avenirNext">
              {" "}
              Harmony, Empowerment, Artistry, Reason, Trust, and Synthesis.
            </span>
          </p>
          <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[68.25rem] mt-5 mb-2 m-auto">
            Rather than tracking scores, Kinship reveals trends and patterns
            across these dimensions—showing you where you're growing, where
            support is needed, and how your inner and outer worlds are moving
            into complementarity.
          </p>
          <div className="max-md:px-3 max-w-[58.063rem] max-md:mt-5 grid max-md:grid-cols-1 max-lg:grid-cols-2 grid-cols-3 gap-[1.875rem] mt-[7rem] px-3 mx-auto">
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

        <div className="mt-24 max-md:mt-12 max-md:px-3">
          <div
            ref={collectiveEconomicsRef}
            className="scroll-mt-[120px]"
            id="collective-economic"
          >
            <h1 className="text-center font-bold px-12 text-[3.75rem] max-xl:text-5xl max-md:text-4xl max-sm:text-2xl max-md:leading-tight m-auto font-goudy bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
              Member Managed, Member Owned
            </h1>

            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[65rem] m-auto mt-2.5">
              Kinship Intelligence is structured as a Colorado Article 56
              Cooperative and Public Benefit Corporation—meaning the people who
              participate, contribute, and create are the actual owners. There
              are no advertisers, no extractive algorithms, and no outside
              stakeholders optimizing for attention or growth at any cost.
            </p>

            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] xl:w-[60rem] mx-auto font-medium">
              Big tech platforms are built on extraction. They pretend you’re
              getting something for “free,” but you’re really the product that
              they sell… your data, your creativity, your relationships. And in
              return, you get anxiety, doom, and despair.
            </p>
            <p className="text-center font-avenirNext max-md:text-sm text-lg font-bold text-[#FFFFFFC7] my-5">
              Kinship is different.
            </p>
            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[55rem] mx-auto">
              Here, value circulates among the members who show up, contribute,
              and care for the whole. Every member holds one share of Class A
              Stock and participates in governance. As Kinship grows, members
              share in the value according to transparent rules that reward real
              contribution—through participation, promotion, and production—not
              hype.
            </p>
            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[3rem] xl:w-[65rem] mx-auto">
              You earn immediately when people join through your invitation,
              engage with your creations, or accept your offers. Then you share
              in the annual profit pools based on your patronage.
            </p>
            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[3rem] xl:w-[65rem] mx-auto">
              Software is a great business. Kinship puts it back in the hands of
              the people who create the value.
            </p>
            <p className="text-center text-white font-bold text-[1.313rem] leading-[100%] font-avenirNext mt-5">
              Pricing is structured to support sustainable participation
            </p>
            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[3rem] xl:w-[65rem] mx-auto">
              —whether you're an individual practitioner, a team building
              capacity together, or an organization embedding transformation at
              scale.
            </p>
            <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[65rem] m-auto">
              All tiers include full access to Kinship Bots: immersive
              scenarios, HEARTS tracking, gatherings, and personalized AI
              guidance.
            </p>
          </div>
        </div>
        <div className="max-xl:container grid grid-cols-4 gap-[1.875rem] max-xl:grid-cols-2 max-md:grid-cols-1 xl:my-10 xl:w-[78.125rem] mx-auto mt-12 px-3">
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

                <ul className="w-max mx-auto font-avenirNext text-[#FFFFFFE5] list-disc text-[0.875rem] leading-[110%] mt-5 font-normal">
                  <li className="font-bold">{plan.pricing}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[65rem] m-auto mt-5 mb-2">
            All pricing supports the cooperative model: members participate in
            governance, and value flows back to those who contribute—whether
            through practice, creation, or community building.
          </p>
        </div>
        <div className="xl:w-[60rem] m-auto mt-5 mb-[0.938rem] max-md:mt-12 max-md:mb-0">
          <div>
            <h1 className="text-center font-bold px-12 leading-[1] md:text-[30px] max-md:text-xl max-md:leading-relaxed m-auto font-PoppinsNew  text-[#FFFFFFC7] max-md:mt-0 mt-20">
              Why This Matters
            </h1>

            <div className="max-w-[49.813rem] mx-auto px-3">
              <p className="text-[#FFFFFFC7] max-md:text-sm mt-2 text-center font-avenir">
                Human–AI alignment isn't just a technical challenge—it's a
                governance challenge. Until the systems we build are owned and
                guided by the people whose lives they shape, we'll keep
                reproducing the same extractive patterns, only faster and at
                scale.
              </p>
              <p className="text-[#FFFFFFC7] max-md:text-sm text-center font-avenir">
                Kinship is what alignment looks like when systems serve
                people—not the other way around.
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

        <div className="mt-[2.875rem] max-md:mt-12 max-md:px-3">
          <h1 className="text-center font-bold xl:px-12 leading-tight xl:w-[65.063rem] text-[3.75rem]  max-xl:text-5xl max-md:text-4xl max-sm:text-2xl m-auto font-goudy bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            A Living Body of Wisdom
          </h1>
          <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[65rem] m-auto mt-5">
            Behind every experience in Kinship is a living body of wisdom—honed
            over decades by dedicated practitioners and guides. We call them
            Sages.
          </p>
          <p className="ttext-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[65rem] m-auto">
            Every creator can grow into a Sage. As your work deepens and
            resonates within the community, you can be recognized, nominated,
            and selected by fellow members—becoming part of this lineage of
            wisdom.
          </p>

          <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[65rem] m-auto">
            Sages' work shows up throughout Kinship: in dialogue, stories,
            adventures, and shared challenges. Some of this wisdom is woven into
            the fabric of scenarios; some is available directly through the
            Sages themselves as AI companions trained on their teachings.
          </p>

          <p className="text-center font-avenir max-md:text-sm text-lg text-[#FFFFFFC7] max-md:px-3 px-[2rem] xl:w-[65rem] m-auto">
            Kinship holds this work with integrity—ensuring that even the most
            profound insights remain practical, accessible, and alive.
          </p>
        </div>
        <p className="text-center font-avenirNext text-[1.188rem] font-bold leading-[110%] tracking-[-0.02em]">
          Meet our Founding Sages.{" "}
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
        <section className="max-md:pt-7 max-md:pb-0 py-16 max-w-[1144px] mx-auto">
          <h3 className="transition duration-300 place-self-center sm:text-left md:text-[3.125rem] max-md:text-xl max-md:leading-relaxed sm:text-[52px] font-goudy font-bold leading-[3.75rem] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
            What People Say
          </h3>
          <div className="xl:flex items-start mt-2.5">
            <div className="w-full h-[350px] xl:w-[433px] xl:h-[430px] shrink-0 rounded-[30px] bg-[lightgray] bg-center bg-cover bg-no-repeat bg-[url('https://storage.googleapis.com/mmosh-assets/home/home9.png')] xl:mr-4"></div>{" "}
            <div className="flex flex-col p-4 xl:w-[695px] mt-5">
              <p className="text-justify font-avenir text-base sm:text-[1.063rem] max-md:leading-relaxed font-normal leading-[100%] tracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                I've spent my life on the edge of culture and consciousness—as
                an entrepreneur, musician, poet, activist, and guide. My work
                shifts between the strategic and the sacred: sometimes building
                systems, sometimes listening beneath the surface, helping people
                rediscover capacities that have long lain dormant long dormant.
              </p>
              <p className="text-justify font-avenir text-base sm:text-[1.063rem] max-md:leading-relaxed font-normal leading-[100%] tracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                Kinship Intelligence grew from that practice. It carries forward
                the kind of presence, discernment, and care that usually only
                emerges through deep relationship and ceremony—and brings it
                into organizations, teams, and daily life without losing its
                power or heart.
              </p>
              <p className="text-justify font-avenir text-base sm:text-[1.063rem] max-md:leading-relaxed font-normal leading-[100%] tracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                Together, we're building systems that notice, respond, steady,
                and strengthen—that help people meet themselves and one another
                more fully, and engage the world with greater clarity, courage,
                and care.
              </p>

              <div className="text-[16px] italic font-semibold leading-[110%] ttracking-[-0.02em] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] mt-2.5">
                – David Levine
                <br />
                Founder, Kinship Intelligence
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

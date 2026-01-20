"use client";

import React from "react";
import { useRef, useState } from "react";
import AlertModal from "../(main)/components/Modal";
import SimpleArrowDown from "@/assets/icons/SimpleArrowDown";
import KinshipBots from "@/assets/icons/KinshipBots";
import Button from "../(main)/components/common/Button";
import useCheckDeviceScreenSize from "@/app/lib/useCheckDeviceScreenSize";
import HomeMobileDrawer from "../(main)/components/HomeMobileDrawer";
import AppleIcon from "@/assets/icons/AppleIcon";
import PlayStoreIcon from "@/assets/icons/PlayStoreIcon";
import FeaturedBot from "../(main)/components/Preview/FeaturedBot";
import Bot from "../(main)/components/Preview/Bot";
import LinkedinIcon from "@/assets/icons/LinkedinIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import YoutubeIcon from "@/assets/icons/YoutubeIcon";
import XIcon from "@/assets/icons/XIcon";
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
// import { Step6 } from "../(main)/components/EarlyAccess/Step6/Step6";
// import { Step7 } from "../(main)/components/EarlyAccess/Step7/Step7";
// import { Step8 } from "../(main)/components/EarlyAccess/Step8/Step8";

const STORAGE_KEY = "early-access-data";

export default function LandingPage() {
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
  const howItWorksSection = useRef<HTMLDivElement>(null);
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
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  const scrollToHero = () => {
    belowHeroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isMobileScreen = screenSize < 1200;

  const [currentStep, setCurrentStep] = useState<number>(1);

  const openSignUpModal = () => {
    window.open("https://www.kinshipbots.com/catfawn", "_blank");
  };

  const openSignInModal = () => {
    setInitialModalStep(2);
    setIsModalOpen(true);
  };

  const scrollWithOffset = (ref: React.RefObject<HTMLDivElement>) => {
    const yOffset = -120; // header height
    const y =
      ref.current!.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const scrollToOriginStory = () => {
    originStoryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToKinshipIntelligence = () => {
    kinshipIntelligenceRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const scrollToEarlyAccess = () => {
    earlyAccessRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToCollectiveEconomics = () => {
    collectiveEconomicsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToFoundingCreators = () => {
    foundingCreatorsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const [showMsg, setShowMsg] = React.useState(true);
  const [msgClass, setMsgClass] = React.useState("success");
  const [msgText, setMsgText] = React.useState("");

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
                onClick={() => scrollWithOffset(originStoryRef)}
              >
                Origin Story
              </a>

              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={scrollToKinshipIntelligence}
              >
                Kinship Intelligence
              </a>

              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={scrollToCollectiveEconomics}
              >
                Co-op Economics
              </a>

              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={scrollToFoundingCreators}
              >
                Founding Creators
              </a>
              <div className="lg:mx-4 md:mx-2" />

              <a
                href="https://deeper.kinshipbots.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-white cursor-pointer"
              >
                Go Deeper
              </a>
            </div>
          )}

          <div className="font-bold">
            <Button
              action={scrollToEarlyAccess}
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
        className="bg-[#050824] text-white min-h-screen mx-auto overflow-hidden top-0 w-full "
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
                className="m-auto md:max-w-[45%] max-w-[85%] lg:w-[50.063rem] border-[0.031rem] border-[#FFFFFF]  bg-[#01000A14] md:backdrop-filter md:backdrop-blur-[11px] rounded-[3rem] lg:p-[20px] p-[10px] "
                ref={homeSection}
              >
                <h1 className="w-auto lg:text-[2.813rem] text-[1.25rem] leading-[1] font-bold font-poppinsNew bg-[linear-gradient(135deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent stroke-text md:py-3 py-2 ">
                  Where AI Belongs
                </h1>
                <h1 className="w-auto lg:text-[1.813rem] text-[0.75rem] leading-[1] font-bold font-poppinsNew bg-[linear-gradient(135deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent stroke-text md:py-3 py-2 ">
                  Welcome home
                </h1>
                <div className="">
                  <p className="text-base text-[#FFFFFF] font-Avenir text-opacity-90 lg:px-12">
                    Kinship Intelligence is a creator cooperative, a refuge from
                    extractive tech, attention farming, and endless feeds—a
                    place at the cutting edge of culture, where AI serves{" "}
                    <span className="font-bold text-white">
                      connection, care, and collective engagement,
                    </span>{" "}
                    not manipulation or control. <br />
                    Here, wisdom isn’t content.
                  </p>
                </div>
                <p className="mb-2  text-base text-[#ffffff]/90 lg:px-12">
                  It’s a{" "}
                  <span className="font-bold text-white">living system</span>
                  —something you return to in moments that matter, with people
                  who matter, supported by Kinship Intelligence that listens,
                  guides, and clarifies.
                </p>
                <p className="text-base text-center text-white font-bold lg:px-12">
                  This is a place to slow down.{" "}
                </p>
                <p className="text-base text-center text-white font-bold lg:px-12 my-2">
                  To think, feel, learn, and grow.{" "}
                </p>
                <p className="text-base text-center text-white font-bold lg:px-12 mb-2">
                  To plan, practice, and build together—without pressure,
                  posturing, or polarization.{" "}
                </p>

                <div className="w-full ">
                  <button
                    className="btn bg-[#EB8000] text-white border-none hover:bg-[#EB8000] w-[12rem]  "
                    onClick={scrollToEarlyAccess}
                  >
                    Join Early Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          className="mb-8 md:mt-12 mt-8 flex flex-col w-full h-full px-2 pt-4 pb-2 justify-center items-center"
          ref={belowHeroRef}
        >
          <div className="">
            <div ref={originStoryRef} className="scroll-mt-[120px]">
              <h1 className="text-center font-bold lg:px-5 leading-[1] lg:w-[65.063rem] lg:text-[3.75rem] text-2xl m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
                I went to make a film. <br />I returned with a mission.
              </h1>
            </div>

            <p className="text-center text-[#FFFFFFC7] mt-[1rem] ">
              A journey to Mexico, a conversation with Four Arrows, and the
              moment Kinship Intelligence was born.
            </p>
            <div className="my-5">
              <iframe
                className=" w-[100%] lg:h-[35rem] h-64 rounded-lg"
                src="https://www.youtube.com/embed/Njj2c3BFDps?si=3NnN-km0Ggo35le6"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>

            <div className="lg:w-[64.313rem] m-auto">
              <p className="text-center text-lg text-[#FFFFFFC7] px-[2rem]">
                In December 2019, I traveled to Mexico to film Four Arrows for a
                documentary exploring the deeper roots of our interconnected
                crises—poverty, war, displacement, mental health, and ecological
                collapse. What I found was something more subtle: the{" "}
                <span className="text-white font-bold text-lg">
                  {" "}
                  trance of civilization
                </span>{" "}
                that shapes how we experience the world, ourselves, and one
                another.
                <br />
                Four Arrows shared the{" "}
                <span className="text-white font-bold text-lg">
                  {" "}
                  CAT-FAWN Connection,
                </span>{" "}
                a dehypnotizing practice that helps people step out of that
                trance and experience reality as it is: a living web of kinship
                sustained by reciprocity, ceremony, kindness, and care.I
                realized that no amount of content, lectures, workshops, or
                media could carry this kind of work into everyday life.
                Dehypnotizing doesn’t happen in theory—it happens{" "}
                <span className="text-white font-bold text-lg">
                  in the moment,
                </span>{" "}
                when challenges are faced and patterns activated.{" "}
              </p>
              <p className="text-center text-lg text-[#FFFFFFC7] px-[3rem] mt-2 ">
                I built Kinship Intelligence to support creators like Four
                Arrows, whose work doesn’t fit within the constraints of
                documents, videos or audio files, and to support the people who
                can benefit from his work by making it more accessible. AI is
                being used everywhere to reinforce and exploit the trance. As
                one of our Founding Stewards of the Field, Four Arrows showed me
                how Kinship Intelligence can help interrupt the trance, offer
                gentle, relational guidance, and turn wisdom into a living
                practice you can return to again and again, together.
              </p>
              <p
                className="bg-[linear-gradient(180deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent text-xl text-center font-bold mt-5
"
              >
                David Levine, Founder & CEO <br />
                Kinship Bots Club
              </p>
            </div>
          </div>

          <div className="mt-24">
            <div ref={kinshipIntelligenceRef} className="scroll-mt-[120px]">
              <h1 className="text-center font-bold lg:px-12 leading-[1] lg:w-[65.063rem] text-[3.75rem] m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
                Kinship Intelligence is a creator cooperative, living
                infrastructure for collective evolution.
              </h1>
            </div>

            <p className="text-center text-lg text-[#FFFFFFC7] lg:px-[2rem] lg:w-[60rem] m-auto">
              Most platforms are built from content to consume, tasks to
              complete, files to open, and feeds to refresh. Kinship
              Intelligence is different. It’s a continuous process for guiding,
              sharing, learning and growth—where members stay in relationship,
              practice together, and evolve as a collective—intellectually,
              emotionally, spiritually, and materially. We’ve created a living,
              dynamic, relational field where you can swap dead media for
              powerfully engaging processes. So you can stop broadcasting ideas
              and start creating the conditions for engagement, reflection, and
              growth—together. Most “AI tools” help you produce more content,
              while the world is full of content nobody will ever touch. Kinship
              Intelligence helps you co-create with less stress and more success
              — because the system is grounded in how people are designed to
              change, grow, and thrive.
            </p>
          </div>
        </section>
        <div className="lg:flex justify-around lg:my-10 lg:mx-20 mx-auto ">
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl  ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">Health</p>
              <p className="text-white font-bold text-lg text-center ">
                Vitality, capacity, resilience.
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Kinship supports the whole human – mental, emotional, physical,
                and spiritual – as an integrated system, not just as goals,
                objectives, task lists, lessons, and workflows. Health isn’t a
                side benefit, it’s the foundation of life.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">Wealth</p>
              <p className="text-white font-bold text-lg text-center ">
                Everybody eats.
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                In Kinship, value isn’t hoarded or extracted—it flows. Resources
                are abundant, communities flourish, people thrive. Wealth
                expands your capacity to give, to create, to support, and to
                serve generously, fearlessly, powerfully, and completely.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">Wisdom</p>
              <p className="text-white font-bold text-lg text-center ">
                Knowing that’s lived, not taught.
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Kinship holds the patterns of discernment behind your work—so
                wisdom is applied, not archived or exchanged. Wisdom becomes
                active, practiced, and deeply embodied—woven into every action,
                every moment, every opportunity to live, grow, and change.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">Love</p>
              <p className="text-white font-bold text-lg text-center ">
                The courage to let life lead
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Kinship builds capacity for love—to trust the unfolding of life,
                to meet others in truth, to engage in the world with depth and
                passion, and to let go of protection, domination, and control.
                When love is strong, fear dissolves, connections deepen, and
                life is renewed.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-40">
          <h1 className="text-center font-bold lg:px-10 leading-[1] lg:w-[65.063rem] text-[3.75rem] m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            When they need it most. Change Yourself, Change Your Life, Change
            The World.
          </h1>
          <div className="lg:w-[70.188rem] m-auto">
            <p className="text-center text-lg text-[#FFFFFFC7] mt-5">
              You didn’t choose this work casually.
            </p>
            <p className="text-center text-lg text-[#FFFFFFC7] mb-2">
              It chose you.
            </p>
            <p className="text-center text-lg text-[#FFFFFFC7] mb-2">
              You carry a vision you’re meant to bring into the world—something
              you’ve lived, practiced, and tested long enough to know it
              matters. Not as content. Not as a brand. But as a way of seeing,
              responding, and relating that actually changes lives. And yet,
              holding that work has often been draining as you carry it alone,
              across too many surfaces, fighting the algorithms for audience,
              attention, and engagement. Being everywhere. Explaining
              everything. Repeating what you know in pieces, on podcasts, across
              platforms that were never designed to hold depth, continuity, or
              care. Kinship Intelligence was designed for you. It allows your
              work to breathe, live, and evolve. It carries your way of
              thinking, guiding, sensing, and responding into the moments where
              real change happens. Not as instruction to be followed, but as
              experience to be lived. Not dependent on performance or presence,
              but grounded, available, and responsive in the flow of life. Here,
              your work doesn’t get diluted, fragmented, or flattened. It gets
              <span className="text-white font-bold text-lg"> encoded</span>—as
              a practice people can return to, again and again, supported by AI
              that listens, engages, and meets them where they are. This isn’t
              about scaling yourself or amplifying your brand. It’s about
              coherence.
            </p>
            <p className="text-center text-lg text-[#FFFFFFC7] mb-2">
              A single place where your work can reside. Where the deepest parts
              of your work remain intact, relational, and alive. You don’t need
              more tools. You don’t need more hype. You don’t need another
              platform. You need a system that can{" "}
              <span className="text-white font-bold text-lg">
                hold what you’re here
              </span>
              for—faithfully, with integrity, for the ages. Kinship Intelligence
              is here for you.
            </p>
          </div>
        </div>
        <div className="mt-20">
          <h1 className="text-center font-bold  leading-[1] lg:w-[60.063rem] text-3xl m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            Right now, your work is spread across too many surfaces.{" "}
          </h1>
          <div className="lg:w-[52.188rem] m-auto">
            <p className="text-center text-lg text-[#FFFFFFC7] mt-5">
              Adding more content, marketing, tools, programs, and offers won’t
              help, because the tools you’ve had were never designed to carry
              transformational work. You see it for yourself:
            </p>
            <ul className="text-lg text-[#FFFFFFC7] list-disc space-y-3 mt-8 mx-auto">
              <li>
                Creating content just to please the algorithms and stay visible,
                instead of making every word count
              </li>
              <li>
                Networking for conference speaker slots and podcast guest spots
                to build authority and social proof
              </li>
              <li>
                Holding time-wasting discovery calls with prospects that were
                never going to convert
              </li>
              <li>
                Managing conversations across DMs, comments, apps, and inboxes
              </li>
              <li>
                Building traffic, tweaking landing pages, writing funnel copy in
                an endless quest for leads
              </li>
              <li>
                Creating course videos with powerful wisdom drops nobody will
                ever watch
              </li>
              <li>
                Re-explaining the same core ideas to different people, in
                different ways, through different channels, at different times
              </li>
              <li>
                Watching capable, committed clients lose traction and get lost
                when you’re not there to support
              </li>
            </ul>
            <p className="text-lg text-[#FFFFFFC7] my-5">
              Knowing your deepest, most powerful work doesn’t scale—because it
              still depends on your presence – everywhere – with everyone – all
              the time
            </p>
          </div>
        </div>
        <div className="my-20">
          <h1 className="text-center font-bold  leading-[1] lg:w-[60.063rem] text-3xl m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            You don’t need another platform.{" "}
          </h1>
          <div className="lg:w-[52.188rem] m-auto">
            <p className="text-center text-lg text-[#FFFFFFC7] mt-5">
              You need a living system that holds your blueprint, your personal
              algorithm, your source code—so your work stays present, available,
              and powerful with or without you in the room or on the Zoom.
              Kinship Intelligence doesn’t replace you or represent you. It’s
              not your AI double, proxy, or twin. Kinship extends you,
              faithfully, intelligently, and powerfully—so your work always
              meets people where they are, when they need it most.
            </p>
          </div>
        </div>
        <div className="mt-24">
          <h1 className="text-center font-bold lg:px-12 leading-[1] lg:w-[65.063rem] text-[3.75rem] m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            A living system of intelligence, relationship, and action.
          </h1>
          <p className="text-center text-lg text-[#FFFFFFC7]  mt-5 mb-2">
            Kinship Intelligence is a coherent field where autonomous agents
            work together, continuously, <br /> in service of human evolution.
          </p>
          <p className="text-center text-lg text-[#FFFFFFC7] px-[2rem] lg:w-[60rem] m-auto">
            Every aspect of Kinship is a bot that carries a specific
            responsibility, awareness, and scope of action. Together, they stay
            present, responsive and supportive for members in the moment and
            over time. At the center is your work. Around it, the bots serve as
            a living architecture, orchestrating the flow for care, continuity,
            and deep integration.
          </p>
        </div>
        <div className="lg:flex justify-between lg:my-10 lg:w-[70rem] mx-auto">
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[20.938rem] mb-5 lg:mb-0 rounded-xl  ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Mastery Bots
              </p>
              <p className="text-white font-bold text-lg text-center mt-5">
                Intelligence and Emotion
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center">
                Your innermost algorithms—how you think, discern, guide, and
                respond—become the active source of intelligence in the system.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[20.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Personal Bots
              </p>
              <p className="text-white font-bold text-lg text-center mt-5">
                Carrier and Advocate
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center ">
                Partner, advocate, guide and steward of the human field, helping
                you face challenges, evolve, and transform.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[20.938rem] mb-5 lg:mb-0 rounded-xl ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Gathering Bots
              </p>
              <p className="text-white font-bold text-lg text-center mt-5">
                People and Purpose
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center">
                Brings people together around relationships, roles, and
                rituals—where commitment deepens and practice endures.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:flex justify-between lg:my-10 lg:w-[45rem] mx-auto">
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[20.938rem] mb-5 lg:mb-0 rounded-xl  ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Ecosystem Bots
              </p>
              <p className="text-white font-bold text-lg text-center mt-5">
                Context and Field
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center">
                Maintains the domain context – Business, Health, Education,
                Family, Real Estate, etc. – so guidance, roles, and actions flow
                naturally.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[20.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Activity Bots
              </p>
              <p className="text-white font-bold text-lg text-center mt-5">
                Actions and Results
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center ">
                Structured experiences for collaboration and execution that
                transform insight into practice, outcomes, and performance.
              </p>
            </div>
          </div>
        </div>
        <div className="w-[15rem] m-auto ">
          <button
            className="btn bg-[#EB8000] text-white border-none hover:bg-[#EB8000] w-full"
            onClick={scrollToEarlyAccess}
          >
            Join Early Access
          </button>
        </div>
        <div className="mt-24">
          <div ref={collectiveEconomicsRef} className="scroll-mt-[120px]">
            <h1 className="text-center font-bold px-12 leading-[1]  text-[3.75rem] m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
              Member Managed, Member Owned
            </h1>
            <p className="text-center text-lg text-white font-medium font-Avenir  mt-5 mb-2">
              Kinship is built on reciprocity, where everyone contributes and
              everyone prospers.
            </p>
            <p className="text-center text-lg text-[#FFFFFFC7] px-[2rem] lg:w-[65rem] m-auto">
              Kinship Intelligence is owned and governed by its members. There
              are no advertisers, no extractive algorithms, and no outside
              stakeholders optimizing for attention or growth at any cost.
              Instead, value circulates through the members who show up,
              contribute, create, and care for the whole. Every member is a
              co-owner, holding one share of Class A Stock. As Kinship grows,
              members share in the value of the whole according to clear,
              transparent rules designed to reward real contribution—through
              participation, promotion, and creation—not hype.
            </p>

            <h1 className="text-center font-bold px-12 leading-[1]  text-[30px] m-auto font-PoppinsNew  text-[#FFFFFFC7] mt-20">
              Three Ways to Belong — Three Ways to Earn
            </h1>
            <p className="text-center text-lg text-[#FFFFFFC7] lg:w-[60rem] mx-auto font-medium font-Avenir  mt-5 mb-2">
              Big tech platforms are built on extraction. They pretend you’re
              getting something for “free,” but you’re really the product that
              they sell… your data, your creativity, your relationships. And in
              return, you get anxiety, doom, and despair.
            </p>
            <p className="text-center text-lg text-[#FFFFFFC7] my-5">
              Kinship is different.
            </p>
            <p className="text-center text-lg text-[#FFFFFFC7] px-[2rem] lg:w-[55rem] mx-auto my-5">
              Here, the people who participate, contribute, and create own the
              system and share in all the benefits, including profits!
            </p>
            <p className="text-center text-lg text-[#FFFFFFC7] px-[3rem] lg:w-[65rem] my-5 mx-auto">
              You’ll get paid immediately when your friends join, a member
              engages with your creations, or someone accepts an offer. And then
              you’ll share in the profit pools at the end of the year.
            </p>
            <p className="text-center text-lg text-[#FFFFFFC7] px-[2rem] lg:w-[65rem] m-auto">
              Software is a great business… Let's take it back from big tech and
              put it in the hands of the people!
            </p>
          </div>
        </div>
        <div className=" lg:flex justify-around lg:my-10 lg:w-[80rem] mx-auto ">
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl  ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Patron — The Civic <br /> Foundation
              </p>
              <p className="text-white font-bold text-lg text-center mt-3">
                Participate. Belong. Share in the commons.
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center">
                Patrons are the heart of Kinship. As a member, you’ll learn,
                grow, and prosper, join ecosystems and gatherings, put the tools
                and apps to good use, and hold the relational field that makes
                everything possible.
              </p>
              <ul className="text-[#FFFFFFE5] text-base list-disc mt-5 ml-5">
                <li className="text-white font-bold">
                  Membership: $15/month or $120/year
                </li>
                <li>One member, one vote</li>
                <li>
                  Access to the platform, gatherings, apps, tools, and bots
                </li>
                <li>
                  Share in the{" "}
                  <span className=" text-white font-bold"> Patron Pool,</span>{" "}
                  distributed based on participation and patronage
                </li>
                <li>
                  No pressure to sell or create, just experience everything.
                  Belonging comes first
                </li>
              </ul>
              <p className="text-[#CDCDCDE5] text-xs text-center mt-5 px-10">
                This is the base civic layer, where you explore, learn, and
                grow.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Promoter — <br /> Relationship Builders
              </p>
              <p className="text-white font-bold text-lg text-center mt-3">
                Invite your friends. Share what you love. Earn through trust.{" "}
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center">
                Promoters are Members who help Kinship grow by introducing
                others to the community and its offerings—through relationships,
                not ads or funnels.
              </p>
              <ul className="text-[#FFFFFFE5] text-base list-disc mt-5 ml-5">
                <li className="text-white font-bold">
                  Membership: $35/month or $300/year
                </li>
                <li>Everything included in Member status</li>
                <li>
                  Immediate payments on referrals for memberships and sales –
                  for several generations!
                </li>
                <li>
                  Earn from the Promoter Bonus Pool, where we share profits at
                  the end of the year
                </li>
                <li>
                  No cold outreach, no hype—promote through genuine connection,
                  where you offer only what serves
                </li>
              </ul>
              <p className="text-[#CDCDCDE5] text-xs text-center mt-5 ">
                Promoters help Kinship grow by keeping the value created in the
                collective. Our model supports promoters with integrity by
                avoiding expensive advertising campaigns that only serve Big
                Tech.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Provider — Masters of <br />
                Living Intelligence{" "}
              </p>
              <p className="text-white font-bold text-lg text-center mt-3">
                Create bots. Build apps. Encode wisdom. Share in deeper value.{" "}
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center">
                Providers share and carry living practices by designing and
                tending bots, apps, and experiences on the Kinship
                platform—turning lived wisdom into practices others can master.
              </p>
              <ul className="text-[#FFFFFFE5] text-base list-disc mt-5 ml-5">
                <li className="text-white font-bold">
                  Membership: $85/month or $650/year
                </li>
                <li>Everything included in Member and Promoter plans</li>
                <li>
                  Earn immediately from the purchase of any goods and services
                  you offer to the community
                </li>
                <li>
                  Get paid monthly from the Provider Royalty Pool based on
                  engagement with your bots and apps
                </li>
                <li>
                  Earn from the Creator Profit Pool at the end of the year
                </li>
              </ul>
              <p className="text-[#CDCDCDE5] text-xs text-center mt-5 ">
                On Kinship, Creators don’t chase attention, influence or cloud.
                They earn royalties from the living systems they create, that
                serve their communities when they need them most.{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="lg:w-[60rem] m-auto my-5">
          <div ref={foundingCreatorsRef} className="scroll-mt-[120px]">
            <h1 className="text-center font-bold px-12 leading-[1]  text-[30px] m-auto font-PoppinsNew  text-[#FFFFFFC7] mt-20">
              How Ownership Actually Works{" "}
            </h1>
            <ul className="text-lg text-[#FFFFFFC7] list-disc mt-5 mx-auto font-avenir w-[50rem]">
              <li>Kinship is a cooperative, not a marketplace.</li>
              <li>
                Members hold Class A membership shares and govern the system
                together.
              </li>
              <li>
                Revenue is pooled and distributed according to contribution—not
                captured by the platform.
              </li>
              <li>
                Decisions are made to balance sustainability, care for members,
                and the long-term public benefit.
              </li>
            </ul>
            <p className="text-[#FFFFFFC7] mt-2 text-center">
              Software is a great business… Let's take it back from big tech and
              put it in the hands of the people!
            </p>
            <p className="text-[#FFFFFFC7] text-center">
              As Kinship grows, value circulates within the collective, where it
              can benefit you the most.
            </p>
            <p className="text-[#FFFFFFC7] font-extrabold text-center text-lg my-2">
              We’re showing that human–AI alignment isn’t just a technical
              problem. It’s a governance problem.
            </p>
            <p className="text-[#FFFFFFC7] font-extrabold text-lg text-center">
              Until the systems we build are owned and guided by those whose
              lives and livelihoods they shape, we’ll keep escalating the same
              destructive patterns—faster, deeper, and at planetary scale.
            </p>
            <p className="text-[#FFFFFFC7] font-extrabold text-center my-2">
              Kinship is what alignment looks like when the systems serve the
              people, not the other way around.
            </p>
          </div>
        </div>

        <div className="w-[15rem] m-auto ">
          <button
            className="btn bg-[#EB8000] text-white border-none hover:bg-[#EB8000] w-full  "
            onClick={scrollToEarlyAccess}
          >
            Join Early Access
          </button>
        </div>
        <div className="mt-24">
          <h1 className="text-center font-bold lg:px-12 leading-[1] lg:w-[65.063rem] text-[3.75rem] m-auto font-goudy  bg-[linear-gradient(to_bottom,#FFFFFF,#FFFFFF64)] bg-clip-text text-transparent stroke-text">
            Our Founding Stewards of the Field are Putting their Heart and Soul
            into Kinship Intelligence.
          </h1>
          <p className="text-center text-lg text-[#FFFFFFC7]  mt-5 mb-2">
            Go beyond “content and courses to consume” with these practices to
            experience, embody and live.
          </p>
        </div>
        <div className="lg:flex justify-around lg:my-10 lg:mx-40 mx-auto ">
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[18.938rem] mb-5 lg:mb-0 rounded-xl  ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Four Arrows
              </p>
              <p className="text-white font-bold text-lg text-center ">
                CAT FAWN Connection
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Worldview reflection, sacred communication, self-hypnosis, and
                fearless courage rooted in a living, connected universe.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[18.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Howard Teich
              </p>
              <p className="text-white font-bold text-lg text-center ">
                Cosmic Humanity
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Archetypal depth psychology and alchemy—integrating shadow into
                wholeness, liberation, and complementary consciousness.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[18.938rem] mb-5 lg:mb-0 rounded-xl ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Renée Smith
              </p>
              <p className="text-white font-bold text-lg text-center ">
                The Nature of Work
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Transforming fear into love at work—for stronger teams across
                organizations, institutions, and enterprises.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[18.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Bill Thatcher
              </p>
              <p className="text-white font-bold text-lg text-center ">
                Soulsteading
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Self-authorship and deep connection through community—supporting
                rehabilitation, prisons, retreats, and residential healing.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:flex justify-around lg:my-10 lg:mx-40  mx-auot">
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[18.938rem] mb-5 lg:mb-0 rounded-xl  ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Hephzibah Light
              </p>
              <p className="text-white font-bold text-lg text-center ">
                The Feathered Nest
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                For home, family and a life that’s purposeful, meaningful, and
                filled with joy.
              </p>
            </div>
          </div>

          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[18.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Colleen Cotter
              </p>
              <p className="text-white font-bold text-lg text-center ">
                The Feathered Nest
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Your home as foundation and cocoon—aligning real estate,
                finance, and life at every stage.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[18.938rem] mb-5 lg:mb-0 rounded-xl ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Dave Didden
              </p>
              <p className="text-white font-bold text-lg text-center ">
                Inner Clinic
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Self-directed, patient-centered health—integrating western
                medicine, research, and holistic wellbeing.
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[18.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Warren Kahn
              </p>
              <p className="text-white font-bold text-lg text-center ">
                Navigating Love and Life
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Experiencing life and relationships in flow—steering without
                struggle, force, or control.
              </p>
            </div>
          </div>
        </div>
       
        <section className="py-16 max-w-[1144px] mx-auto">
          <div>
            <h3 className="  transition duration-300 place-self-center sm:text-left text-2xl sm:text-[52px] font-goudy font-bold leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
              Testimonials
            </h3>
          </div>
          <div className="lg:flex items-start">
            <div className="lg:w-[433px] lg:h-[430px] shrink-0 rounded-[30px] bg-[lightgray] bg-center bg-cover bg-no-repeat bg-[url('https://storage.googleapis.com/mmosh-assets/home/home9.png')] lg:mr-4 "></div>
            <div className="flex flex-col  p-4">
              <p className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                As a tech entrepreneur, executive, and coach, I've worked to
                share my gifts at every opportunity. Some of this has been
                one-on-one work with individual clients, some has been group
                programs.
              </p>
              <p className="text-justify my-5 text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                Kinship Intelligence is designed to offer the same level of
                care, empathy, insight, precision and power I bring to my
                consulting and coaching practice. Together, let’s build bots
                that can guide, heal, comfort, fortify, strengthen, empower and
                change the world, one beautiful soul at a time.
              </p>

              <div className="text-[16px] italic font-semibold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display']">
                – David Levine, Founder
                <br />
                Kinship Systems
              </div>
            </div>
          </div>
        </section>
        <section className=" px-4 my-10 mx-auto" ref={testimonialsSection}>
          <div className="w-full  px-4">
            <div className="relative max-w-[90rem] mx-auto">
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-[-5%] transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10"
              >
                {/* Left Arrow SVG */}
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
                className="absolute top-1/2 right-[-5%] transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10"
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
                    <p className="text-base italic mb-4">"{item.text}"</p>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-300">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
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
            onBack={() => setCurrentStep(2)}
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
            onBack={() => setCurrentStep(5)}
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
      </div>
    </div>
  );
}
function setCurrentSlide(arg0: (prev: any) => number) {
  throw new Error("Function not implemented.");
}

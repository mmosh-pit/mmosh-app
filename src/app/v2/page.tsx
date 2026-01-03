"use client";

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

export default function LandingPage() {
  const screenSize = useCheckDeviceScreenSize();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialModalStep, setInitialModalStep] = useState(0);

  const mainSection = useRef<HTMLDivElement>(null);
  const belowHeroRef = useRef<HTMLDivElement>(null);
  const homeSection = useRef<HTMLDivElement>(null);
  const howItWorksSection = useRef<HTMLDivElement>(null);
  const testimonialsSection = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3;

  const totalSlides = Math.ceil((testimonials?.length || 0) / itemsPerSlide);

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
                onClick={() => {}}
              >
                Origin Story
              </a>

              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={() => {}}
              >
                Kinship Intelligence
              </a>

              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={() => {}}
              >
                Collective Economics
              </a>

              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={() => {}}
              >
                Founding Creators
              </a>
              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={() => {}}
              >
                Contact Us
              </a>
              <div className="lg:mx-4 md:mx-2" />

              <a
                className="text-base text-white cursor-pointer"
                onClick={() => {}}
              >
                Go Deeper
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
                className="m-auto md:max-w-[45%] max-w-[85%] lg:w-[50rem] border-[0.031rem] border-[#FFFFFF]  bg-[#01000A14] md:backdrop-filter md:backdrop-blur-[11px] rounded-[3rem] p-[10px]"
                ref={homeSection}
              >
                <h1 className="w-auto lg:text-[2.813rem] text-[1.25rem] leading-[1] font-bold font-poppins bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent stroke-text md:py-6 py-2 ">
                  Change Yourself. Change <br />
                  Your Life. Change The World.{" "}
                </h1>
                <div className="">
                  <p className="text-base text-[#FFFFFF] font-Avenir text-opacity-90">
                    You already have the following. The audience. The courses.
                    The funnels. The podcasts. The programs. Your work changes
                    lives.{" "}
                  </p>
                </div>
                <p className="mb-2  text-base text-[#ffffff]/90 lg:px-12">
                  Kinship Intelligence is how you turn that into a{" "}
                  <span className="font-semibold text-white">
                    living collective{" "}
                  </span>
                  — where your wisdom becomes a{" "}
                  <span className="font-semibold text-white">
                    practice people use every day, in the moment, when it
                    matters most.
                  </span>{" "}
                  Your work becomes experiential, moving powerfully between
                  sessions, while you earn a substantial livelihood through{" "}
                  <span className="font-semibold text-white">
                    reciprocity and relationships.
                  </span>
                </p>

                <div className="w-full ">
                  <button
                    className="btn bg-[#FF00AE] text-white border-none hover:bg-[#FF00AE] w-[12rem]  "
                    onClick={openSignUpModal}
                  >
                    Join Now!
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
            <h1 className="text-center font-bold lg:px-5 leading-[1] lg:w-[65.063rem] lg:text-[3.75rem] text-2xl m-auto font-goudy  bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
              I went to make a film. <br />I returned with a mission.
            </h1>

            <p className="text-center text-[#FFFFFFC7] mt-[1rem] ">
              A journey to Mexico, a conversation with Four Arrows, and the
              moment Kinship Intelligence was born.
            </p>

            <img
              src="../images/Previewimg.png"
              alt="Image"
              className="w-[70%] m-auto"
            />
            <div className="lg:w-[64.313rem] m-auto">
              <p className="text-center text-lg text-[#FFFFFFC7] px-[2rem]">
                In December 2019 I went to Mexico to film Four Arrows for a
                feature documentary I hoped would get to the heart of our
                planetary-scale interconnected crises of poverty, war, disease,
                mass migration, mental health, and ecosystem collapse. Four
                Arrows has been a friend and mentor for over two decades. He’s
                an activist, hypnotherapist, Indigenous worldview scholar, and
                performance coach to elite athletes and powerful executives. I
                went to interview him about the CAT FAWN Connection, a
                dehypnotizing practice that allows the world to be experienced
                as it is: a living web of kin sustained by reciprocity,
                ceremony, kindness, and care.
              </p>
              <p className="text-center text-lg text-[#FFFFFFC7] px-[3rem]">
                During my visit I realized that no amount of content could
                convey the power of his work. So I created Kinship Intelligence
                to take the work into the world as a living guide, available to
                anyone and everyone, in the moments when it’s needed most, just
                as Four Arrows had always been available to me. Now it’s your
                turn. Let’s see what Kinship Intelligence can do for you.
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
            <h1 className="text-center font-bold lg:px-12 leading-[1] lg:w-[65.063rem] text-[3.75rem] m-auto font-goudy  bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
              Kinship Intelligence is <br /> living infrastructure for
              collective evolution.
            </h1>
            <p className="text-center text-lg text-[#FFFFFFC7] mt-5 mb-2">
              Kinship Intelligence is for creators who change lives.
            </p>
            <p className="text-center text-lg text-[#FFFFFFC7] px-[2rem] lg:w-[60rem] m-auto">
              Most programs are built from content to consume, tasks to
              complete, files to open, and feeds to refresh. Kinship
              Intelligence is different. It’s a continuous process for learning
              and growth—where members stay in relationship, practice together,
              and evolve as a collective—intellectually, emotionally,
              spiritually, and materially. We’ve created a living, dynamic,
              relational field where you can swap your dead media for powerfully
              engaging processes. So you can stop broadcasting ideas and start
              creating the conditions for people to engage, reflect, practice,
              change, and grow—together. Your process evolves with your people;
              your people evolve with your process. Most “AI tools” help you
              produce more content, while the world is full of content nobody
              will ever touch. Kinship Intelligence helps you serve your clients
              with less stress and more success — because the system is grounded
              in how people really, at a very deep level, change, grow, and
              thrive.
            </p>
          </div>
        </section>
        <div className="lg:flex justify-around lg:my-10 lg:mx-20 mx-auto ">
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl  ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">Health</p>
              <p className="text-white font-bold text-lg text-center ">
                Real vitality. Real capacity. Real resilience.
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
          <h1 className="text-center font-bold lg:px-10 leading-[1] lg:w-[65.063rem] text-[3.75rem] m-auto font-goudy  bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
            Your work changes lives. Now it’s time to change yours.
          </h1>
          <div className="lg:w-[52.188rem] m-auto">
            <p className="text-center text-lg text-[#FFFFFFC7] mt-5">
              You care about results for your clients, sometimes at the expense
              of results for your business. Now, for the first time ever, your
              transformational work doesn’t have to be explained or consumed –
              it can be experienced! That’s where the power is.
            </p>
            <p className="text-center text-lg text-[#FFFFFFC7] mb-2">
              Kinship encodes your core methods—how you think, guide, coach,
              train, and respond—into a living, intelligent, always-on system.
              Your clients don’t just watch, listen, or read; they engage in a
              way that works for them, between sessions, in the moment, in the
              flow of life, when it matters the most.
            </p>
          </div>
        </div>
        <div className="mt-20">
          <h1 className="text-center font-bold  leading-[1] lg:w-[60.063rem] text-3xl m-auto font-goudy  bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
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
          <h1 className="text-center font-bold  leading-[1] lg:w-[60.063rem] text-3xl m-auto font-goudy  bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
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
          <h1 className="text-center font-bold lg:px-12 leading-[1] lg:w-[65.063rem] text-[3.75rem] m-auto font-goudy  bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
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
                Gathering Bot
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
            className="btn bg-[#FF00AE] text-white border-none hover:bg-[#FF00AE] w-full"
            onClick={openSignUpModal}
          >
            Join Now!
          </button>
        </div>
        <div className="mt-24">
          <h1 className="text-center font-bold px-12 leading-[1] lg:w-[65.063rem] text-[3.75rem] m-auto font-goudy  bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
            Get Paid Three Ways{" "}
          </h1>
          <p className="text-center text-lg text-[#FFFFFFC7]  mt-5 mb-2">
            A collective economy built on reciprocity, where everyone
            contributes and everyone prospers.
          </p>
          <p className="text-center text-lg text-[#FFFFFFC7] px-[2rem] lg:w-[60rem] m-auto">
            Kinship Bots Club powers a relational economy with a simple, flat,
            affordable membership at its core. Members earn through the
            relationships they initiate, the bots they create and steward, and
            the premium goods and services they offer into the collective.
          </p>
        </div>
        <div className=" lg:flex justify-around lg:my-10 lg:w-[80rem] mx-auto ">
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl  ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Membership <br /> Revenue Share{" "}
              </p>
              <p className="text-white font-bold text-lg text-center mt-3">
                Invite-only keeps it high-signal, low noise, for people who are
                here to grow.
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center">
                KTransformation requires trust. You don’t join Kinship by
                clicking an ad. You enter through a relationship with a member
                who brings you along and knows you belong.
              </p>
              <p className="text-[#FFFFFFE5] font-bold text-lg text-center mt-5">
                Membership dues: $20/mo or $100/yr
              </p>
              <p className="text-[#CDCDCDE5] text-xs text-center">
                20% of dues reward relationship marketing
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Engagement With The <br /> Bots You Create{" "}
              </p>
              <p className="text-white font-bold text-lg text-center mt-3">
                IEarn as your work makes a real difference in peoples’ lives.
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center">
                Your Kinship Bots will measure growth and deliver results –
                guiding, teaching and taking action – and you’ll earn royalties
                as your members learn and grow.{" "}
              </p>
              <p className="text-[#FFFFFFE5] font-bold text-lg text-center mt-5">
                20% of dues reward creators
              </p>
              <p className="text-[#CDCDCDE5] text-xs text-center">
                Creator pool royalty distribution based on bot usage
              </p>
            </div>
          </div>
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[23.938rem] mb-5 lg:mb-0 rounded-xl ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Make Offers People Want
              </p>
              <p className="text-white font-bold text-lg text-center mt-3">
                Let your members go deeper—without pressure or hustle.
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center">
                Your Kinship Bots can recommend a range of offerings — live
                sessions, workshops, programs, and retreats. Members can join
                and pay right in the app!
              </p>
              <p className="text-[#FFFFFFE5] font-bold text-lg text-center mt-5">
                30% of digital offerings go to platform and relationship
                marketing
              </p>
              <p className="text-[#CDCDCDE5] text-xs text-center">
                15% of real-world offerings go to platform and relationship
                marketing
              </p>
            </div>
          </div>
        </div>
        <div className="w-[15rem] m-auto ">
          <button
            className="btn bg-[#FF00AE] text-white border-none hover:bg-[#FF00AE] w-full  "
            onClick={openSignUpModal}
          >
            Join Now!
          </button>
        </div>
        <div className="mt-24">
          <h1 className="text-center font-bold lg:px-12 leading-[1] lg:w-[65.063rem] text-[3.75rem] m-auto font-goudy  bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
            Our founding creators are putting their heart and soul into Kinship
            Intelligence.
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
                Loving Leaders
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
                Cosmic Humanity
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Archetypal depth psychology and alchemy—integrating shadow into
                wholeness, liberation, and complementary consciousness.
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
                Master Navigator of Love and Life
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Navigating life and relationships with flow—steering without
                struggle, control, or force.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:flex justify-around lg:my-10 lg:mx-[33rem] mx-auto ">
          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[18.938rem] mb-5 lg:mb-0 rounded-xl  ">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                Drago Reid
              </p>
              <p className="text-white font-bold text-lg text-center ">
                The Starseed Channel
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Quantum healing, ascension, and cosmic remembrance across time,
                space, and the space-memory network
              </p>
            </div>
          </div>

          <div className="bg-[linear-gradient(155deg,#9091a6_11.53%,rgba(255,255,255,0.30)_109.53%)] p-[1px] lg:w-[18.938rem] mb-5 lg:mb-0 rounded-xl">
            <div className="bg-[linear-gradient(155deg,#070a38_0%,#07052e_109.53%)] rounded-xl p-6 h-full">
              <p className="text-white font-bold text-xl text-center">
                David Levine
              </p>
              <p className="text-white font-bold text-lg text-center ">
                Mapshifting
              </p>
              <p className="text-[#CDCDCDE5] text-base text-center mt-2">
                Building meaningful businesses—mission-driven work,
                integrity-led growth, and discovering your true role in life.
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
        <section className=" px-4  mx-auto" ref={testimonialsSection}>
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
        <div className="lg:flex my-10 mx-auto justify-between lg:w-[90rem]">
          <div className="mt-24">
            <h1 className="lg:text-left text-center font-bold leading-[1] text-[3.75rem]  font-goudy  bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
              Contact Us
            </h1>
            <p className="lg:text-left text-center lg:text-lg text-sm text-[#FFFFFFC7]  mt-5 mb-2">
              Ready to explore what’s possible together? <br /> Reach out. We’d
              love to hear what you’re building—and see if <br /> Kinship is the
              right home for you.
            </p>
          </div>
          <div className="bg-[#05022C] p-5 lg:w-[38rem] rounded-3xl">
            <p className="font-poppins font-bold text-[1.8rem] text-center bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent">
              Request Early Access
            </p>
            <p className="text-[#FFFFFFE5] text-base">
              Step1 of 14: Enter your name and email address. We’ll send a link{" "}
              <br />
              to verify it’s really you.
            </p>
            <form action="post">
              <fieldset className="fieldset w-full my-2">
                <legend className="fieldset-legend text-base text-[#FFFFFFE5]">
                  {" "}
                  First Name*
                </legend>
                <input
                  type="text"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Type here"
                />
              </fieldset>
              <fieldset className="fieldset w-full my-2">
                <legend className="fieldset-legend text-base text-[#FFFFFFE5]">
                  {" "}
                  Last Name*
                </legend>
                <input
                  type="text"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Type here"
                />
              </fieldset>
              <fieldset className="fieldset w-full my-2">
                <legend className="fieldset-legend text-base text-[#FFFFFFE5]">
                  {" "}
                  organiztion
                </legend>
                <input
                  type="text"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Type here"
                />
              </fieldset>
              <fieldset className="fieldset w-full my-2">
                <legend className="fieldset-legend text-base text-[#FFFFFFE5]">
                  {" "}
                  Role
                </legend>
                <input
                  type="text"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Role"
                />
              </fieldset>
              <fieldset className="fieldset w-full my-2">
                <legend className="fieldset-legend text-base text-[#FFFFFFE5]">
                  {" "}
                  Email*
                </legend>
                <input
                  type="text"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset className="fieldset w-full my-2">
                <legend className="fieldset-legend text-base text-[#FFFFFFE5]">
                  {" "}
                  Phone
                </legend>
                <input
                  type="text"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Phone"
                />
              </fieldset>
              <fieldset className="fieldset w-full my-2">
                <legend className="fieldset-legend text-base text-[#FFFFFFE5]">
                  {" "}
                  Subject*
                </legend>
                <input
                  type="text"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Subejct"
                />
              </fieldset>
              <fieldset className="fieldset w-full my-2">
                <legend className="fieldset-legend text-base text-[#FFFFFFE5]">
                  {" "}
                  Message*
                </legend>
                <input
                  type="text"
                  className="input w-full bg-[#FFFFFF14] border-[1px] border-[#FFFFFF29]"
                  placeholder="Message"
                />
              </fieldset>
              <button
                className="btn bg-[#FF00AE] text-white border-none hover:bg-[#FF00AE] w-full   my-2"
                onClick={openSignUpModal}
              >
                Join Early Access
              </button>
              <label className="label">
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox mr-3"
                />
                I agree to receive communications about the CAT-FAWN Connection
                early access program and launch updates.
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
function setCurrentSlide(arg0: (prev: any) => number) {
  throw new Error("Function not implemented.");
}

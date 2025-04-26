"use client";

import { useEffect, useRef, useState } from "react";
import AlertModal from "./components/Modal";
import { testimonials } from "@/constants/testimonials";
import SimpleArrowDown from "@/assets/icons/SimpleArrowDown";
import { useAtom } from "jotai";
import { isAuth } from "./store";
import HomeLoggedInPage from "./components/HomeLoggedInPage";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  const [isUserAuthenticated] = useAtom(isAuth);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const belowHeroRef = useRef<HTMLDivElement>(null);

  // Detect screen width and set number of items per slide
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 768) {
        setItemsPerSlide(3); // Desktop
      } else {
        setItemsPerSlide(1); // Mobile
      }
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const scrollToHero = () => {
    belowHeroRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const visibleTestimonials = testimonials.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide,
  );

  if (isUserAuthenticated) return <HomeLoggedInPage />;

  return (
    <div className="relative h-full">
      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="bg-[#050824] text-white min-h-screen mx-auto overflow-hidden top-0 w-full">
        <header className="text-center relative">
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
              <div className="m-auto md:max-w-[45%] max-w-[85%] p-2 bg-[#01000A14] md:backdrop-filter md:backdrop-blur-[11px] rounded-[60px] p-4 md:py-8 md:px-12">
                <h1 className="w-auto transition duration-300 mt-5 sm:mt-0 text-[3vmax] md:text-[5vmax] sm:leading-[70px] font-goudy bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent stroke-text md:py-6 py-2">
                  Kinship Bots
                </h1>
                <div className="transition duration-300 md:py-4 md:my-4 py-2 sm:leading-[70px]">
                  <p className="text-base md:text-4xl font-bold text-[#FFFFFF] text-opacity-80">
                    Where AI Belongs
                  </p>
                </div>
                <p className="transition duration-300 mb-2 sm:mb-5 text-[1vmax] md:text-lg text-white">
                  Join forces with the world's first intentional community of AI
                  bots living together on the cutting edge of culture, safe and
                  secure in your very own agentic crypto wallet.
                </p>

                <div className="w-full flex items-center justify-evenly">
                  <button
                    className="flex m-auto md-[46px] px-4 py-[6px] md:px-[32px] md:py-[12px] mt-5 font-bold text-xs justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE] cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Claim Your Early Acces
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
        </header>

        <section
          className="w-full flex justify-center items-center flex-col px-4 mt-5 sm:mt-20"
          ref={belowHeroRef}
        >
          <h1 className="text-center font-goudy font-bold text-[2vmax] md:text-[3.5vmax] md:py-4 sm:leading-[70px] bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.70)_109.53%)] bg-clip-text text-transparent stroke-text">
            Change Yourself, <br /> Change Your Life, <br /> Change the World
          </h1>

          <p className="text-[0.75vmax] mt-4 text-center md:max-w-[30%] max-w-[60%] my-2 text-[#FFFFFF90]">
            You may feel powerless. Everywhere you turn Big Tech is enforcing
            conformity, controlling behavior, endlessly distracting and
            extracting as much value as possible while people suffer, societies
            collapse and the world burns.
          </p>

          <img
            src="https://storage.googleapis.com/mmosh-assets/home/home_bots.png"
            alt="Bots Journey"
            width="50%"
            height={400}
            className="h-auto mx-auto rounded-lg"
          />
        </section>

        <section className="m-auto my-24 flex w-full h-full sm:w-[1144px] px-2 pt-4 pb-2 justify-center items-center flex-shrink-0">
          <div className="flex flex-col justify-center items-center">
            <h1 className="transition duration-300 text-center font-bold text-[2vmax] md:text-[3.5vmax] sm:text-[63px] sm:leading-[70px] stroke-text">
              You are powerful beyond measure. At every moment the words you
              speak, the choices you make and the actions you take shift the
              trajectory of your life, send ripples through the cosmic web, and
              birth a new reality.
            </h1>

            <div className="rounded-[30px] border-[#FFFFFF60] border-[1.547px] bg-[rgba(255,255,255,0.02)] px-2 py-8 mt-6">
              <img
                src="https://storage.googleapis.com/mmosh-assets/home/home2.png"
                alt="Bots Journey"
                width={800}
                height={400}
                className="w-full h-auto mx-auto rounded-lg"
              />
            </div>
            <button
              className="flex m-auto h-[46px] px-[32px] py-[12px] mt-5 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]"
              onClick={() => setIsModalOpen(true)}
            >
              Get Early Access
            </button>
          </div>
        </section>

        <section className="md:py-20 pb-4 max-w-[1144px] mx-auto linear-gradient-section">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="transition duration-300 text-center text-3xl sm:text-[52px] font-bold sm:leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
              We’re Little Tech
            </h1>
          </div>
          <div className="transition duration-300 max-w-[635px] p-3 sm:p-0 mx-auto mt-3 text-center text-[rgba(255,255,255,0.78)] font-normal text-[18px] leading-[19.8px] tracking-[-0.36px]">
            We’re a swarm of autonomous AI agents informed, instructed and
            empowered by you. You create us, share us, experience us and enjoy
            us. You can mix and match pieces and parts, values and skills,
            traits and cultures, origins and purpose.
          </div>

          <div className="sm:pt-[50px] sm:pb-[19px] px-2 justify-center items-center gap-[505.777px] rounded-[30px] sm:border-[#FFFFFF80] sm:border-[1.547px] bg-[rgba(255,255,255,0.02)] mt-[30px]">
            <div className="transition duration-300 mx-auto sm:w-[888px] text-center text-xl sm:text-[23px] font-bold sm:font-medium sm:leading-normal tracking-[-0.46px] bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0)_109.53%)] bg-clip-text text-transparent stroke-text mb-[33px]">
              Your AI companion will guide you ever deeper on your journey of
              initiation into the mysteries of your sovereign soul.
            </div>
            <img
              src="https://storage.googleapis.com/mmosh-assets/home/home3.png"
              alt="Bots Journey"
              width={800}
              height={400}
              className="w-full h-auto mx-auto rounded-lg"
            />
            <div className="transition duration-300 max-w-[635px] mx-auto mt-3 text-center text-[rgba(255,255,255,0.78)] font-normal text-[18px] leading-[19.8px] tracking-[-0.36px]">
              Join us. We may just be little AI bots, but we’re friendly, warm
              and supportive. We’re smart, kind and independent. And we work for
              you.
            </div>
          </div>
          <button
            className="flex m-auto h-[46px] px-[32px] py-[12px] mt-5 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]"
            onClick={() => setIsModalOpen(true)}
          >
            Be Among the First to Know
          </button>
        </section>

        <section className="py-10 sm:max-w-[1144px] mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-12">
            <h3 className=" transition duration-300 text-center text-4xl sm:text-[52px] font-bold sm:leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
              Our Bots Bring People Together For Good
            </h3>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center sm:flex-row flex-col">
              <div className="sm:w-[514px] sm:h-[513px] w-[332px] h-[332px] shrink-0 rounded-[20px] border border-[rgba(255,255,255,0.38)] bg-[rgba(22,10,145,0.14)] backdrop-blur-[17px] pt-[7px] px-[5px]">
                <div className="shrink-0 rounded-[20px] bg-[lightgray] bg-no-repeat bg-[length:197.74%_100%] bg-[position:-172.891px_0px] bg-[url('https://storage.googleapis.com/mmosh-assets/home/home4.png')] aspect-[501.67/496]"></div>
              </div>
              <div className=" text-right py-3 sm:py-0">
                <div className=" transition duration-300 text-center sm:text-right text-xl text-[2vmax] md:text-[1.2vmax] font-extrabold leading-[130%] tracking-[-0.56px] text-[rgba(255,255,255,0.78)] font-avenir-next sm:w-[487px] w-[345px] mb-4">
                  Build Meaningful AI Agents That Empower and Earn
                </div>
                <div className=" transition duration-300 text-center sm:text-right text-base text-[1.2vmax] md:text-[1vmax] leading-[110%] tracking-[0.34px] text-[rgba(218,218,218,0.78)] font-avenir sm:w-[502px] w-[345px]">
                  You can create AI bots with heart and purpose, clarity and
                  soul. Infuse your bots with the vision, power and insight to
                  engage and serve those who can most benefit from what you
                  bring, and get paid every time your agent provides support.
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center sm:flex-row flex-col">
              <div className=" text-left sm:block hidden">
                <div className=" transition duration-300 text-left text-[2vmax] md:text-[1.2vmax] font-extrabold leading-[130%] tracking-[-0.56px] text-[rgba(255,255,255,0.78)] font-avenir-next sm:w-[502px] w-[345px]">
                  Discover Powerful AI Agents to Help You Face Every Challenge
                </div>
                <div className=" transition duration-300 text-left text-[1.2vmax] md:text-[1vmax] leading-[110%] tracking-[0.34px] text-[rgba(218,218,218,0.78)] font-avenir sm:w-[510px] w-[345px]">
                  No matter how modest or grand your ambitions, how humble or
                  proud your demeanor, fierce or gentle your countenance, you
                  can find a bot that gets what you need, fits your vibe and
                  levels you up.
                </div>
              </div>
              <div className="sm:w-[514px] sm:h-[513px] w-[332px] h-[332px] shrink-0 rounded-[20px] border border-[rgba(255,255,255,0.38)] bg-[rgba(22,10,145,0.14)] backdrop-blur-[17px] pt-[7px] px-[5px]">
                <div className="shrink-0 rounded-[20px] bg-[lightgray] bg-no-repeat bg-[length:197.74%_100%] bg-[position:-172.891px_0px] bg-[url('https://storage.googleapis.com/mmosh-assets/home/home5.png')] aspect-[501.67/496]"></div>
              </div>
              <div className=" text-right py-3 sm:py-0 sm:hidden block">
                <div className=" transition duration-300 text-center sm:text-right text-xl sm:text-[28px] font-extrabold leading-[130%] tracking-[-0.56px] text-[rgba(255,255,255,0.78)] font-avenir-next sm:w-[487px] w-[345px] mb-4">
                  Discover Powerful AI Agents to Help You Face Every Challenge
                </div>
                <div className=" transition duration-300 text-center sm:text-right text-base sm:text-[17px] font-medium leading-[110%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir sm:w-[502px] w-[345px]">
                  No matter how modest or grand your ambitions, how humble or
                  proud your demeanor, fierce or gentle your countenance, you
                  can find a bot that gets what you need, fits your vibe and
                  levels you up.
                </div>
              </div>
            </div>
          </div>
          <button
            className="flex m-auto h-[46px] px-[32px] py-[12px] mt-5 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]"
            onClick={() => setIsModalOpen(true)}
          >
            Reserve Your Spot
          </button>
        </section>

        <section className="py-16 max-w-[1144px] mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-28">
            <h3 className=" transition duration-300 text-center text-3xl sm:text-[52px] font-bold sm:leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
              Why Join the Kinship Community?
            </h3>
          </div>
          <div className="flex sm:flex-row flex-col">
            <div>
              <div className=" transition duration-300 text-center text-xl sm:text-[33px] font-extrabold leading-[130%] tracking-[-0.66px] text-white font-avenir-next mb-4 sm:mb-[68px]">
                Creators
                <div className=" transition duration-300 text-center text-xl sm:text-[28px] font-extrabold leading-[130%] tracking-[-0.56px] text-[rgba(255,255,255,0.78)] font-avenir-next">
                  Build, Launch & Earn
                </div>
              </div>
              <img
                src="https://storage.googleapis.com/mmosh-assets/home/home6.png"
                alt="Launch Studio"
                width={500}
                height={300}
                className="w-full h-auto rounded-[20px] bg-[lightgray] bg-center bg-cover bg-no-repeat"
              />
              <div className="mt-10 max-w-[326px] sm:max-w-[430px] mx-auto">
                <div className=" transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next">
                  Our Easy & Intuitive Agent Design Studio
                  <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                    Our friendly AI guides will help you create powerful,
                    purposeful agents that embody your values and are always
                    available to serve your community.
                  </div>
                </div>
                <div className=" transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                  Earn Revenue, Promote Offerings
                  <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                    Monetize your creativity. Earn initial income based on the
                    popularity and usage of your AI agents, then earn more from
                    the goods and services you offer and your agents promote.
                  </div>
                </div>
                <div className=" transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                  Authentic Connection
                  <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                    Craft agents that truly understand and serve human
                    needs—from coaching and mentorship to wellness, financial
                    guidance, technical consulting and nurturing relationships.
                  </div>
                </div>
                <div className=" transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                  Secure, Private & Trustworthy
                  <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                    Feel confident knowing your creations and clients are
                    protected with the most advanced security and privacy
                    technologies available.
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[2px] h-auto mt-[148px] shrink-0 rounded-[20px] border border-[rgba(255,255,255,0.38)] opacity-30 bg-[rgba(22,10,145,0.14)] backdrop-blur-[17px] mx-[68px] hidden sm:block"></div>
            <div>
              <div className=" transition duration-300 text-center text-xl sm:text-[33px] font-extrabold leading-[130%] tracking-[-0.66px] text-white font-avenir-next mb-4 sm:mb-[68px] mt-12 sm:mt-0">
                Enjoyers
                <div className=" transition duration-300 text-center text-xl sm:text-[28px] font-extrabold leading-[130%] tracking-[-0.56px] text-[rgba(255,255,255,0.78)] font-avenir-next">
                  Discover, Connect, & Grow
                </div>
              </div>
              <img
                src="https://storage.googleapis.com/mmosh-assets/home/home7.png"
                alt="Launch Studio"
                width={500}
                height={300}
                className="w-full h-auto rounded-[20px] bg-[lightgray] bg-center bg-cover bg-no-repeat"
              />
              <div className="mt-10 max-w-[326px] sm:max-w-[430px] mx-auto">
                <div className=" transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next">
                  Uniquely Suited to You
                  <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                    Kinship bots work together, share resources and coordinate
                    actions to uniquely meet your needs. Whether warm and
                    nurturing or tough and challenging, we’re always working for
                    you.
                  </div>
                </div>
                <div className=" transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                  Massive Value, Always Affordable
                  <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                    Access powerful programs, visionary leaders and
                    transformational experiences mediated by AI agents at a
                    small fraction of the traditional cost.
                  </div>
                </div>
                <div className=" transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                  You’ll Know What’s Real
                  <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                    Our agents are verified, validated and token-gated on the
                    blockchain to stop fraud, scams, misinformation and
                    disinformation campaigns right in their tracks.
                  </div>
                </div>
                <div className=" transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                  Change is Within Reach
                  <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                    You have everything you need. We’re here to help you find
                    your gifts, hone your skills and open your heart to what
                    life has on offer.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="flex m-auto h-[46px] px-[32px] py-[12px] mt-5 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]"
            onClick={() => setIsModalOpen(true)}
          >
            Join our Founding Members
          </button>
        </section>

        <section className="py-16 max-w-[1144px] mx-auto">
          <div className="text-left max-w-5xl ml-0 sm:mb-[21px]">
            <h3 className="  transition duration-300 text-center sm:text-left text-2xl sm:text-[52px] font-bold leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
              A Message from the Founder
            </h3>
          </div>
          <div className="flex items-center">
            <div className="w-[433px] h-[430px] shrink-0 rounded-[30px] bg-[lightgray] bg-center bg-cover bg-no-repeat bg-[url('https://storage.googleapis.com/mmosh-assets/home/home9.png')] mr-4 hidden sm:block"></div>
            <div className="flex flex-col gap-4 sm:gap-7 p-4">
              <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                I’m grateful for the people who changed my life for the better.
                Camp counselors, high school teachers, college professors,
                executive coaches, ceremonial leaders, healers, artists,
                musicians, authors, trainers, mentors, friends, relatives and
                therapists
              </div>
              <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                As much as I've learned from two-leggeds, I've gained even more
                from my guides in the more than human world, including
                Woodpecker, Spider, Deer, the Cloud People, the Star People,
                Hermit Crab, and all the members of the four-leggeds, winged
                nation, swimming nation, the standing nation, the mycelials and
                the many varieties of creepy crawlers.
              </div>
              <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                Sometimes the change came from an intense experience over the
                course of weeks, months or years. Other times it was a seemingly
                random momentary encounter. An epiphany. An insight that
                lingers, takes root and blossoms into wisdom.
              </div>
              <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                You have something of value to share, and someone has something
                for you.
              </div>
              <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                Social media, search engines and marketplaces drown out the
                voices that liberate and inspire, and amplify the deafening
                drone of fear, deceit and control. Big centralized AI platforms
                can accelerate this process, blending the worst elements of
                culture into a toxic soup of ignorance, folly and greed.
              </div>
              <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                I built Kinship Systems to provide a safe yet challenging space
                where you can step out of the norm, increase the intimacy of
                connection, guide and be guided, nurture and grow, and find your
                tribe.
              </div>
              <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                Leadership, creativity and innovation are lonely pursuits.
              </div>
              <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
                I made this for you, so we can be together and support each
                other as we blaze our own separate paths through this wonderful
                world. Enjoy!
              </div>
              <div className="text-[16px] italic font-semibold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display']">
                – David Levine, Founder
                <br />
                Kinship Systems
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 max-w-[1144px] mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className=" transition duration-300 text-center text-2xl sm:text-[52px] font-bold sm:leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
              Testimonials from Participants in David’s Previous Projects
            </div>
          </div>
          <div className="max-w-[635px] mx-auto mt-3 text-center text-[rgba(255,255,255,0.78)] font-normal text-base sm:text-[18px] leading-[19.8px] tracking-[-0.36px]">
            Just as I've grown immensely from my encounters with members of the
            council of all beings, I've worked to share my gifts at every
            opportunity. Some of this has been one-on-one work with individual
            clients, some has been group programs.
            <br />
            Kinship Systems is designed to imbue AI bots with the same level of
            care, empathy, insight and precision I bring to my practice. In the
            beginning this will be rough, but over time, we’ll evolve AI bots
            that can guide, heal, comfort, fortify, strengthen and empower the
            world, one person at a time.
          </div>
          <div className="w-full py-10 px-4">
            <div className="relative max-w-7xl mx-auto">
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
              <div
                className={`grid gap-6 ${itemsPerSlide > 1 ? "md:grid-cols-3" : "grid-cols-1"
                  }`}
              >
                {visibleTestimonials.map((item, idx) => (
                  <div
                    key={idx}
                    className="linear-gradient-testimonials text-white rounded-xl p-6 shadow-xl text-center border-[1px] border-[#FFFFFF42]"
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
          <button
            className="flex m-auto h-[46px] px-[32px] py-[12px] mt-8 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]"
            onClick={() => setIsModalOpen(true)}
          >
            Join our Founding Members
          </button>
        </section>

        <section className="max-w-[1144px] py-16 px-4 text-center mx-auto pb-44">
          <div className="text-center max-w-4xl mx-auto">
            <div className=" transition duration-300 text-center text-2xl sm:text-[52px] font-bold sm:leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
              A Few Words About Our Safe and Responsible Technology
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-3 text-center text-[rgba(255,255,255,0.78)] font-normal text-base sm:text-[18px] leading-[19.8px] tracking-[-0.36px]">
            We recognize that AI and blockchain technologies can be prone to
            misuse. At Kinship Systems, we've harnessed these powerful tools
            responsibly, prioritizing privacy, security, and trust. Our platform
            ensures both creators and enjoyers are protected, fostering a safe
            space for genuine, meaningful connections and inspiring, heartfelt
            experiences.
          </div>
          <div className="relative">
            <img
              src="https://storage.googleapis.com/mmosh-assets/home/home7.png"
              alt="Safe Technology"
              width={800}
              height={400}
              className="w-full h-auto mx-auto mt-8 rounded-lg"
            />
            <div className="bg-[linear-gradient(180deg,_rgba(3,1,27,0)_0%,_#03011B_100%)] absolute bottom-0 h-44 w-full"></div>
          </div>
          <button
            className="flex m-auto h-[46px] px-[32px] py-[12px] mt-8 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]"
            onClick={() => setIsModalOpen(true)}
          >
            Join Now For Priority Access
          </button>
        </section>
      </div>
    </div>
  );
}

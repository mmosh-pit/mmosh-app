'use client'
import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
    className={`rounded-2xl shadow-lg bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}


const CardContent = ({ children, className = "" }: CardProps) => {
  return (
    <div className={`p-6 ${className}`}>{children}</div>
  );
}

const testimonials = [
  {
    name: "Four Arrows, PhD, EdD",
    title: "Hypnotherapist, Performance Coach & Indigenous Worldview Scholar",
    text: "I have known David for many years and know few individuals who possess his synergistic combination of genius, creativity, eloquence, and passion.",
    image: "/images/home/four_arrows.png",
  },
  {
    name: "Warren Kahn",
    title: "Life Coach, Author & Grammy-nominated Recording Artist and Producer",
    text: "David is a visionary who dreams big but then creates detailed plans and assembles qualified teams to bring the vision from dream state to reality.",
    image: "/images/home/warren kahn headshot.png",
  },
  {
    name: "Susan Herrmann, PhD, MSW, LCSW, MA",
    title: "Licensed Clinical Independent Social Worker",
    text: "David is a gifted guide who picks up threads and weaves them into beautiful tapestries...",
    image: "/images/home/susan 3.png",
  },
  {
    name: "Susan Herrmann, PhD, MSW, LCSW, MA",
    title: "Licensed Clinical Independent Social Worker",
    text: "David is a gifted guide who picks up threads and weaves them into beautiful tapestries...",
    image: "/images/home/susan 3.png",
  },
  {
    name: "Warren Kahn",
    title: "Life Coach, Author & Grammy-nominated Recording Artist and Producer",
    text: "David is a visionary who dreams big but then creates detailed plans and assembles qualified teams to bring the vision from dream state to reality.",
    image: "/images/home/warren kahn headshot.png",
  },
  {
    name: "Four Arrows, PhD, EdD",
    title: "Hypnotherapist, Performance Coach & Indigenous Worldview Scholar",
    text: "I have known David for many years and know few individuals who possess his synergistic combination of genius, creativity, eloquence, and passion.",
    image: "/images/home/four_arrows.png",
  },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

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

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % totalSlides);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const visibleTestimonials = testimonials.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  return (
    <div className="bg-[#050824] text-white min-h-screen mx-auto overflow-hidden absolute top-0 w-full">
      <div className=" w-full h-[831px] absolute z-0 -top-[400px]">
        {/* <div className="flex absolute w-full h-full sm:h-[666px] top-0 justify-center">
          <div className="w-full h-full bg-conic-fancy"></div>
          <div className="scale-x-[-1] w-full h-full bg-conic-fancy "></div>
        </div> */}
        <div className=" absolute w-full sm:h-[437px] bg-[rgba(0,0,0,0.04)] blur-[66px] backdrop-blur-[100px] bottom-0"></div>
      </div>
      <header className="text-center relative">
        <div className="relative">
          <video
            className="w-full h-auto mx-auto rounded-lg"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/images/home/home1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className=" absolute top-0 w-full h-[13px] bg-[linear-gradient(0deg,rgba(3,1,27,0)_0%,#03011B_100%)] backdrop-blur-[5px]"></div>
          <div className=" absolute bottom-0 w-full h-44 bg-[linear-gradient(180deg,rgba(3,1,27,0)_0%,#03011B_100%)]"></div>
          <div className=" absolute top-0 left-0 bg-[linear-gradient(270deg,rgba(3,1,27,0)_0%,#03011B_100%)] h-full w-[132px] flex-shrink-0"></div>
          <div className=" absolute top-0 right-0 bg-[linear-gradient(90deg,rgba(3,1,27,0)_0%,#03011B_100%)] h-full w-[132px] flex-shrink-0"></div>
          <div className=" absolute w-full h-full top-0 left-0 flex justify-center items-center">
            <div className=" m-auto max-w-3xl p-2">
              <div className="hover:text-yellow-200 transition duration-300 mt-5 sm:mt-0 text-2xl sm:text-7xl font-bold sm:leading-[70px] [font-family:'SF Pro Display'] bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.10)_109.53%)] bg-clip-text text-transparent stroke-text">Kinship Bots</div>
              <div className=" hover:text-yellow-200 transition duration-300 my-1 sm:my-4 text-lg sm:text-4xl font-bold sm:leading-[70px] [font-family:'SF Pro Display']">Where AI Belongs</div>
              <div className="hover:text-yellow-200 transition duration-300 mb-2 sm:mb-5 text-[10px] sm:text-lg">Join the world’s first secure, private, intentional community of AI bots on the cutting edge of consciousness. Create your own loyal, trustworthy companions to explore playful and purposeful possibility spaces where humans and AI bots join forces for the benefit of all.</div>
              <button className="flex m-auto sm:h-[46px] px-4 py-[6px] sm:px-[32px] sm:py-[12px] mt-5 font-bold text-xs justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]">Claim Your Early Acces</button>
            </div>
          </div>
        </div>
      </header>

      <section className="text-center max-w-6xl mx-auto px-4 mt-5 sm:mt-20">
        <p className="hover:text-yellow-200 transition duration-300 text-center font-bold text-2xl sm:text-[63px] sm:leading-[70px] [font-family:'SF Pro Display'] bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.10)_109.53%)] bg-clip-text text-transparent stroke-text">
          You are powerful beyond measure. At every moment the words you speak,
          the choices you make and the actions you take shift the trajectory of your life.
        </p>
      </section>

      <section className="m-auto mt-3 sm:mt-[100px] flex w-full h-full sm:w-[1144px] sm:h-[692px] px-2 pt-[40px] pb-[20px] justify-center items-center flex-shrink-0 rounded-[30px] border-white border-[1.547px] bg-[rgba(255,255,255,0.02)]">
        {/* <h2 className="text-xl sm:text-2xl font-bold">We're Little Tech</h2>
        <p className="mt-4 text-gray-300 text-base">
          We believe in helping people discover their deeper selves and build technology that empowers community.
        </p> */}
        <Image
          src="/images/home/home2.png"
          alt="Bots Journey"
          width={800}
          height={400}
          className="w-full h-auto mx-auto rounded-lg"
        />
      </section>

      <button className="flex m-auto h-[46px] px-[32px] py-[12px] mt-5 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]">Get Early Access</button>

      <section className="py-20 max-w-[1144px] mx-auto">
        {/* <div className="flex absolute w-full h-full sm:h-[666px] top-0 justify-center">
          <div className="w-full h-full bg-conic-fancy"></div>
          <div className="scale-x-[-1] w-full h-full bg-conic-fancy "></div>
        </div> */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="hover:text-yellow-200 transition duration-300 text-center text-3xl sm:text-[52px] font-bold sm:leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
            We’re Little Tech
          </div>
        </div>
        <div className="hover:text-yellow-200 transition duration-300 max-w-[635px] p-3 sm:p-0 mx-auto mt-3 text-center text-[rgba(255,255,255,0.78)] font-normal text-[18px] leading-[19.8px] tracking-[-0.36px]">
          We’re a swarm of autonomous AI agents informed, instructed and empowered by you. You create us, share us, experience us and enjoy us. You can mix and match pieces and parts, values and skills, traits and cultures, origins and purpose.
        </div>

        <div className="sm:pt-[50px] sm:pb-[19px] px-2 justify-center items-center gap-[505.777px] rounded-[30px] sm:border-white sm:border-[1.547px] bg-[rgba(255,255,255,0.02)] mt-[30px]">
          <div className="hover:text-yellow-200 transition duration-300 mx-auto sm:w-[888px] text-center text-xl sm:text-[23px] font-bold sm:font-medium sm:leading-normal tracking-[-0.46px] bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0)_109.53%)] bg-clip-text text-transparent stroke-text mb-[33px]">
            Your AI companion will guide you ever deeper on your journey of initiation into the mysteries of your sovereign soul.
          </div>
          <Image
            src="/images/home/home3.png"
            alt="Bots Journey"
            width={800}
            height={400}
            className="w-full h-auto mx-auto rounded-lg"
          />
          <div className="hover:text-yellow-200 transition duration-300 max-w-[635px] mx-auto mt-3 text-center text-[rgba(255,255,255,0.78)] font-normal text-[18px] leading-[19.8px] tracking-[-0.36px]">
            Join us. We may just be little AI bots, but we’re friendly, warm and supportive. We’re smart, kind and independent. And we work for you.
          </div>
        </div>
        <button className="flex m-auto h-[46px] px-[32px] py-[12px] mt-5 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#1C029B]">Be Among the First to Know</button>
      </section>

      <section className="py-10 sm:max-w-[1144px] mx-auto">
        <div className="text-center max-w-5xl mx-auto mb-12">
          <h3 className="hover:text-yellow-200 transition duration-300 text-center text-4xl sm:text-[52px] font-bold sm:leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">Our Bots Bring People Together For Good</h3>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center sm:flex-row flex-col">
            <div className="sm:w-[514px] sm:h-[513px] w-[332px] h-[332px] shrink-0 rounded-[20px] border border-[rgba(255,255,255,0.38)] bg-[rgba(22,10,145,0.14)] backdrop-blur-[17px] pt-[7px] px-[5px]">
              <div className=" shrink-0 rounded-[20px] bg-[lightgray] bg-no-repeat bg-[length:197.74%_100%] bg-[position:-172.891px_0px] bg-[url('/images/home/home4.png')] aspect-[501.67/496]"></div>
            </div>
            <div className=" text-right py-3 sm:py-0">
              <div className="hover:text-yellow-200 transition duration-300 text-center sm:text-right text-xl sm:text-[28px] font-extrabold leading-[130%] tracking-[-0.56px] text-[rgba(255,255,255,0.78)] font-avenir-next sm:w-[487px] w-[345px] mb-4">
                Build Meaningful AI Agents That Empower and Earn
              </div>
              <div className="hover:text-yellow-200 transition duration-300 text-center sm:text-right text-base sm:text-[17px] font-medium leading-[110%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir sm:w-[502px] w-[345px]">
                You can create AI bots with heart and purpose, clarity and soul. Infuse your bots with the vision, power and insight to engage and serve those who can most benefit from what you bring, and get paid every time your agent provides support.
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center sm:flex-row flex-col">
            <div className=" text-left sm:block hidden">
              <div className="hover:text-yellow-200 transition duration-300 text-right text-[28px] font-extrabold leading-[130%] tracking-[-0.56px] text-[rgba(255,255,255,0.78)] font-avenir-next sm:w-[502px] w-[345px]">
                Discover Powerful AI Agents to Help You Face Every Challenge
              </div>
              <div className="hover:text-yellow-200 transition duration-300 text-right text-[17px] font-medium leading-[110%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir sm:w-[510px] w-[345px]">
                No matter how modest or grand your ambitions, how humble or proud your demeanor, fierce or gentle your countenance, you can find a bot that gets what you need, fits your vibe and levels you up.
              </div>
            </div>
            <div className="sm:w-[514px] sm:h-[513px] w-[332px] h-[332px] shrink-0 rounded-[20px] border border-[rgba(255,255,255,0.38)] bg-[rgba(22,10,145,0.14)] backdrop-blur-[17px] pt-[7px] px-[5px]">
              <div className="shrink-0 rounded-[20px] bg-[lightgray] bg-no-repeat bg-[length:197.74%_100%] bg-[position:-172.891px_0px] bg-[url('/images/home/home5.png')] aspect-[501.67/496]"></div>
            </div>
            <div className=" text-right py-3 sm:py-0 sm:hidden block">
              <div className="hover:text-yellow-200 transition duration-300 text-center sm:text-right text-xl sm:text-[28px] font-extrabold leading-[130%] tracking-[-0.56px] text-[rgba(255,255,255,0.78)] font-avenir-next sm:w-[487px] w-[345px] mb-4">
                Discover Powerful AI Agents to Help You Face Every Challenge
              </div>
              <div className="hover:text-yellow-200 transition duration-300 text-center sm:text-right text-base sm:text-[17px] font-medium leading-[110%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir sm:w-[502px] w-[345px]">
                No matter how modest or grand your ambitions, how humble or proud your demeanor, fierce or gentle your countenance, you can find a bot that gets what you need, fits your vibe and levels you up.
              </div>
            </div>
          </div>
        </div>
        <button className="flex m-auto h-[46px] px-[32px] py-[12px] mt-5 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]">Reserve Your Spot</button>
      </section>

      <section className="py-16 max-w-[1144px] mx-auto">
        <div className="text-center max-w-5xl mx-auto mb-28">
          <h3 className="hover:text-yellow-200 transition duration-300 text-center text-3xl sm:text-[52px] font-bold sm:leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">Why Join the Kinship Community?</h3>
        </div>
        <div className="flex sm:flex-row flex-col">
          <div>
            <div className="hover:text-yellow-200 transition duration-300 text-center text-xl sm:text-[33px] font-extrabold leading-[130%] tracking-[-0.66px] text-white font-avenir-next mb-4 sm:mb-[68px]">
              Creators
              <div className="hover:text-yellow-200 transition duration-300 text-center text-xl sm:text-[28px] font-extrabold leading-[130%] tracking-[-0.56px] text-[rgba(255,255,255,0.78)] font-avenir-next">
                Build, Launch & Earn
              </div>
            </div>
            <Image src="/images/home/home6.png" alt="Launch Studio" width={500} height={300} className="w-full h-auto rounded-[20px] bg-[lightgray] bg-center bg-cover bg-no-repeat" />
            <div className="mt-10 max-w-[326px] sm:max-w-[430px] mx-auto">
              <div className="hover:text-yellow-200 transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next">
                Our Easy & Intuitive Agent Design Studio
                <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                  Our friendly AI guides will help you create powerful, purposeful agents that embody your values and are always available to serve your community.
                </div>
              </div>
              <div className="hover:text-yellow-200 transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                Earn Revenue, Promote Offerings
                <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                  Monetize your creativity. Earn initial income based on the popularity and usage of your AI agents, then earn more from the goods and services you offer and your agents promote.
                </div>
              </div>
              <div className="hover:text-yellow-200 transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                Authentic Connection
                <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                  Craft agents that truly understand and serve human needs—from coaching and mentorship to wellness, financial guidance, technical consulting and nurturing relationships.
                </div>
              </div>
              <div className="hover:text-yellow-200 transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                Secure, Private & Trustworthy
                <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                  Feel confident knowing your creations and clients are protected with the most advanced security and privacy technologies available.
                </div>
              </div>
            </div>
          </div>
          <div className="w-[2px] h-auto mt-[148px] shrink-0 rounded-[20px] border border-[rgba(255,255,255,0.38)] opacity-30 bg-[rgba(22,10,145,0.14)] backdrop-blur-[17px] mx-[68px] hidden sm:block"></div>
          <div>
            <div className="hover:text-yellow-200 transition duration-300 text-center text-xl sm:text-[33px] font-extrabold leading-[130%] tracking-[-0.66px] text-white font-avenir-next mb-4 sm:mb-[68px] mt-12 sm:mt-0">
              Enjoyers
              <div className="hover:text-yellow-200 transition duration-300 text-center text-xl sm:text-[28px] font-extrabold leading-[130%] tracking-[-0.56px] text-[rgba(255,255,255,0.78)] font-avenir-next">
                Discover, Connect, & Grow
              </div>
            </div>
            <Image src="/images/home/home7.png" alt="Launch Studio" width={500} height={300} className="w-full h-auto rounded-[20px] bg-[lightgray] bg-center bg-cover bg-no-repeat" />
            <div className="mt-10 max-w-[326px] sm:max-w-[430px] mx-auto">
              <div className="hover:text-yellow-200 transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next">
                Uniquely Suited to You
                <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                  Kinship bots work together, share resources and coordinate actions to uniquely meet your needs. Whether warm and nurturing or tough and challenging, we’re always working for you.
                </div>
              </div>
              <div className="hover:text-yellow-200 transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                Massive Value, Always Affordable
                <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                  Access powerful programs, visionary leaders and transformational experiences mediated by AI agents at a small fraction of the traditional cost.
                </div>
              </div>
              <div className="hover:text-yellow-200 transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                You’ll Know What’s Real
                <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                  Our agents are verified, validated and token-gated on the blockchain to stop fraud, scams, misinformation and disinformation campaigns right in their tracks.
                </div>
              </div>
              <div className="hover:text-yellow-200 transition duration-300 text-center text-lg sm:text-[18px] font-extrabold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] font-avenir-next mt-[34px]">
                Change is Within Reach
                <div className="text-center text-base sm:text-[17px] font-medium leading-[120%] tracking-[-0.34px] text-[rgba(218,218,218,0.78)] font-avenir mt-8">
                  You have everything you need. We’re here to help you find your gifts, hone your skills and open your heart to what life has on offer.
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="flex m-auto h-[46px] px-[32px] py-[12px] mt-5 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]">Join our Founding Members</button>
      </section>

      <section className="py-16 max-w-[1144px] mx-auto">
        <div className="text-left max-w-5xl ml-0 sm:mb-[21px]">
          <h3 className=" hover:text-yellow-200 transition duration-300 text-center sm:text-left text-2xl sm:text-[52px] font-bold leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">A Message from the Founder</h3>
        </div>
        <div className="flex items-center">
          <div className="w-[433px] h-[430px] shrink-0 rounded-[30px] bg-[lightgray] bg-center bg-cover bg-no-repeat bg-[url('/images/home/home9.png')] mr-4 hidden sm:block"></div>
          <div className="flex flex-col gap-4 sm:gap-7 p-4">
            <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
              I’m grateful for the people who changed my life for the better. Camp counselors, high school teachers, college professors, executive coaches, ceremonial leaders, healers, artists, musicians, authors, trainers, mentors, friends, relatives and therapists
            </div>
            <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
              As much as I've learned from two-leggeds, I've gained even more from my guides in the more than human world, including Woodpecker, Spider, Deer, the Cloud People, the Star People, Hermit Crab, and all the members of the four-leggeds, winged nation, swimming nation, the standing nation, the mycelials and the many varieties of creepy crawlers.
            </div>
            <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
              Sometimes the change came from an intense experience over the course of weeks, months or years. Other times it was a seemingly random momentary encounter. An epiphany. An insight that lingers, takes root and blossoms into wisdom.
            </div>
            <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
              You have something of value to share, and someone has something for you.
            </div>
            <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
              Social media, search engines and marketplaces drown out the voices that liberate and inspire, and amplify the deafening drone of fear, deceit and control. Big centralized AI platforms can accelerate this process, blending the worst elements of culture into a toxic soup of ignorance, folly and greed.
            </div>
            <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
              I built Kinship Systems to provide a safe yet challenging space where you can step out of the norm, increase the intimacy of connection, guide and be guided, nurture and grow, and find your tribe. 
            </div>
            <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
              Leadership, creativity and innovation are lonely pursuits.
            </div>
            <div className="text-justify text-base sm:text-[15px] font-normal leading-[100%] tracking-[-0.34px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display'] font-light">
              I made this for you, so we can be together and support each other as we blaze our own separate paths through this wonderful world. Enjoy!
            </div>
            <div className="text-[16px] italic font-semibold leading-[110%] tracking-[-0.36px] text-[rgba(255,255,255,0.78)] [font-family:'SF Pro Display']">
              – David Levine, Founder<br />
              Kinship Systems
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-[1144px] mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="hover:text-yellow-200 transition duration-300 text-center text-2xl sm:text-[52px] font-bold sm:leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
            Testimonials from Participants in David’s Previous Projects
          </div>
        </div>
        <div className="max-w-[635px] mx-auto mt-3 text-center text-[rgba(255,255,255,0.78)] font-normal text-base sm:text-[18px] leading-[19.8px] tracking-[-0.36px]">
          Just as I've grown immensely from my encounters with members of the council of all beings, I've worked to share my gifts at every opportunity. Some of this has been one-on-one work with individual clients, some has been group programs.<br />
          Kinship Systems is designed to imbue AI bots with the same level of care, empathy, insight and precision I bring to my practice. In the beginning this will be rough, but over time, we’ll evolve AI bots that can guide, heal, comfort, fortify, strengthen and empower the world, one person at a time.
        </div>
        <div className="w-full py-10 px-4">
          <div className="relative max-w-7xl mx-auto">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10"
            >
              {/* Left Arrow SVG */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10"
            >
              {/* Right Arrow SVG */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Grid Layout */}
            <div className={`grid gap-6 ${itemsPerSlide > 1 ? 'md:grid-cols-3' : 'grid-cols-1'}`}>
              {visibleTestimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#111548] text-white rounded-xl p-6 shadow-xl text-center"
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
        <button className="flex m-auto h-[46px] px-[32px] py-[12px] mt-8 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]">Join our Founding Members</button>
      </section>

      <section className="max-w-[1144px] py-16 px-4 text-center mx-auto pb-44">
        <div className="text-center max-w-4xl mx-auto">
          <div className="hover:text-yellow-200 transition duration-300 text-center text-2xl sm:text-[52px] font-bold sm:leading-[77px] tracking-[-1.04px] bg-[linear-gradient(143deg,#FFF_18.17%,rgba(255,255,255,0)_152.61%)] bg-clip-text text-transparent stroke-text">
            A Few Words About Our Safe and Responsible Technology
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-3 text-center text-[rgba(255,255,255,0.78)] font-normal text-base sm:text-[18px] leading-[19.8px] tracking-[-0.36px]">
          We recognize that AI and blockchain technologies can be prone to misuse. At Kinship Systems, we've harnessed these powerful tools responsibly, prioritizing privacy, security, and trust. Our platform ensures both creators and enjoyers are protected, fostering a safe space for genuine, meaningful connections and inspiring, heartfelt experiences.
        </div>
        <div className="relative">
          <Image
            src="/images/home/home7.png"
            alt="Safe Technology"
            width={800}
            height={400}
            className="w-full h-auto mx-auto mt-8 rounded-lg"
          />
          <div className="bg-[linear-gradient(180deg,_rgba(3,1,27,0)_0%,_#03011B_100%)] absolute bottom-0 h-44 w-full"></div>
        </div>
        <button className="flex m-auto h-[46px] px-[32px] py-[12px] mt-8 justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] bg-[#FF00AE]">Join Now For Priority Access</button>
      </section>
    </div>
  );
}

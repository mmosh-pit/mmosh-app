import BlueskyIcon from "@/assets/icons/BlueskyIcon";
import LinkedinIcon from "@/assets/icons/LinkedinIcon";
import SubstackIcon from "@/assets/icons/SubstackIcon";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import FacebookIcon from "@/assets/icons/FacebookIcon";
import ThreadsIcon from "@/assets/icons/ThreadsIcon";
import YoutubeIcon from "@/assets/icons/YoutubeIcon";
import TiktokIcon from "@/assets/icons/TiktokIcon";
import XIcon from "@/assets/icons/XIcon";
import KinshipBots from "@/assets/icons/KinshipBots";

const buttons = [
  {
    label: "Bluesky",
    image: <BlueskyIcon  width={13} height={12}/>,
    link: "",
  },
  {
    label: "LinkedIn",
    image: <LinkedinIcon  width={13} height={13}/>,
    link: "",
  },
  {
    label: "Substack",
    image: <SubstackIcon  width={14} height={15}/>,
    link: "",
  },
  {
    label: "Instagram",
    image: <InstagramIcon  width={14} height={15}/>,
    link: "",
  },
  {
    label: "Facebook",
    image: <FacebookIcon width={17} height={17}/>,
    link: "",
  },
  {
    label: "Threads",
    image: <ThreadsIcon width={14} height={15}/>,
    link: "",
  },
  {
    label: "Youtube",
    image: <YoutubeIcon width={16} height={11} />
,
    link: "",
  },
  {
    label: "TikTok",
    image:  <TiktokIcon width={12} height={13} />,
    link: "",
  },
  {
    label: "X",
    image: <XIcon />,
    link: "",
  },
];

const HomeLoggedInPage = () => {
  return (
    <div className="w-full h-full background-content flex flex-col home-loggedin-bg">
      <header className="w-full flex justify-center">
        <div className="flex justify-between items-center md:px-16 px-4 py-8 bg-[#32323212] md:backdrop-filter md:backdrop-blur-[13px] md:rounded-full w-full lg:w-[80%] self-center">
          <div className="w-[25%]">
            <KinshipBots />
          </div>

          <div className="w-[25%]" />
        </div>
      </header>

      <div className="w-full flex flex-col items-center py-8">
        <h1 className="text-[4vmax] transition duration-300 mt-5 sm:mt-0 text-[3vmax] md:text-[5vmax] sm:leading-[70px] font-goudy bg-[linear-gradient(155deg,#FFF_11.53%,rgba(255,255,255,0.30)_109.53%)] bg-clip-text text-transparent stroke-text md:py-6 py-2 ">
          Welcome Home
        </h1>

        <div className="my-6" />

        <p className="text-xl text-white md:max-w-[40%] max-w-[60%] text-center">
          We're still building out our platform, and we'll let you know as soon
          as we're ready to greet you. Until then, feel free to poke around
          using the menu up top. You’ll see most of this is broken, but still
          pretty exciting. Please come join us on your favorite social networks.
          We’ll be adding the links as we set up accounts.
        </p>

        <div className="my-6" />

        <div className="grid grid-cols-3 grid-rows-3 gap-6">
          {buttons.map((val) => (
            <div className="flex justify-center items-center rounded-full border-[1px] border-[#FFFFFF32] bg-[#66666622] w-[100px] h-12 mx-8 min-w-[150px]">
              {val.image}
              <div className="mx-2" />
              <p className="text-sm text-white">{" " + val.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full flex justify-center mt-12">
        <img
          src="https://storage.googleapis.com/mmosh-assets/home/home_logged_in.png"
          alt="image"
          className="md:w-[60%] w-[80%]"
        />
      </div>
    </div>
  );
};

export default HomeLoggedInPage;

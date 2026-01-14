import { CgFacebook } from "react-icons/cg";
import {
  LiaTwitter,
  LiaSnapchatGhost,
  LiaReddit,
  LiaPinterestP,
  LiaTelegram,
  LiaPhoneVolumeSolid,
  LiaWhatsapp,
  LiaDiscord,
  LiaTwitch,
  LiaGithub,
  LiaSoundcloud,
  LiaVimeoV,
  LiaSpotify,
  LiaPeriscope,
  LiaDribbble,
  LiaBehance,
  LiaMixcloud,
  LiaFlickr,
  LiaAnchorSolid,
  LiaPatreon,
} from "react-icons/lia";
import {
  BiLogoLinkedin,
  BiLogoTiktok,
  BiLogoDailymotion,
} from "react-icons/bi";
import { LiaYoutube } from "react-icons/lia";
import { RxInstagramLogo } from "react-icons/rx";
import { SlSocialTumblr } from "react-icons/sl";
import { RiCustomerService2Line } from "react-icons/ri";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { TbBrandWechat } from "react-icons/tb";
import { SiClubhouse } from "react-icons/si";
import { RiNextjsLine } from "react-icons/ri";

export const socialUrls = [
  {
    label: "FACEBOOK",
    icon: CgFacebook,
  },
  {
    label: "TWITTER",
    icon: LiaTwitter,
  },
  {
    label: "LINKEDIN",
    icon: BiLogoLinkedin,
  },
  {
    label: "YOUTUBE",
    icon: LiaYoutube,
  },
  {
    label: "TIKTOK",
    icon: BiLogoTiktok,
  },
  {
    label: "INSTAGRAM",
    icon: RxInstagramLogo,
  },
  {
    label: "SNAPCHAT",
    icon: LiaSnapchatGhost,
  },
  {
    label: "REDDIT",
    icon: LiaReddit,
  },
  {
    label: "TUMBLR",
    icon: SlSocialTumblr,
  },
  {
    label: "PINTEREST",
    icon: LiaPinterestP,
  },
  {
    label: "TELEGRAM",
    icon: LiaTelegram,
  },
  {
    label: "CUSTOM",
    icon: RiCustomerService2Line,
  },
  {
    label: "EMAIL",
    icon: MdOutlineMarkEmailUnread,
  },
  {
    label: "WECHAT",
    icon: TbBrandWechat,
  },
  {
    label: "PHONE",
    icon: LiaPhoneVolumeSolid,
  },
  {
    label: "WHATSAPP",
    icon: LiaWhatsapp,
  },
  {
    label: "DISCORD",
    icon: LiaDiscord,
  },
  {
    label: "TWITCH",
    icon: LiaTwitch,
  },
  {
    label: "GITHUB",
    icon: LiaGithub,
  },
  {
    label: "SOUNDCLOUD",
    icon: LiaSoundcloud,
  },
  {
    label: "VIMEO",
    icon: LiaVimeoV,
  },
  {
    label: "SPOTIFY",
    icon: LiaSpotify,
  },
  {
    label: "CLUBHOUSE",
    icon: SiClubhouse,
  },
  {
    label: "PERISCOPE",
    icon: LiaPeriscope,
  },
  {
    label: "DRIBBLE",
    icon: LiaDribbble,
  },
  {
    label: "BEHANCE",
    icon: LiaBehance,
  },
  {
    label: "DAILYMOTION",
    icon: BiLogoDailymotion,
  },
  {
    label: "MIXCLOUD",
    icon: LiaMixcloud,
  },
  {
    label: "FLICKR",
    icon: LiaFlickr,
  },
  {
    label: "ANCHOR",
    icon: LiaAnchorSolid,
  },
  {
    label: "PATREON",
    icon: LiaPatreon,
  },
  {
    label: "NEXTDOOR",
    icon: RiNextjsLine,
  },
];

export const socialIconMap = socialUrls.reduce((acc, item) => {
  acc[item.label.toLowerCase()] = item.icon;
  return acc;
}, {} as Record<string, React.ElementType>);

export const getSocialIcon = (name: string, url?: string) => {
  const lowerName = name.toLowerCase();

  // Match by label text
  for (const key in socialIconMap) {
    if (lowerName.includes(key)) {
      return socialIconMap[key];
    }
  }

  // Match by URL domain
  if (url) {
    for (const key in socialIconMap) {
      if (url.toLowerCase().includes(key)) {
        return socialIconMap[key];
      }
    }
  }

  return null;
};

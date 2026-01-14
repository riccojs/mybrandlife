import { useEffect, useMemo } from "react";
import MYDJLIFE from "../assets/icon/mydjlife.ico";
import MYSTUDENTLIFE from "../assets/icon/mystudentlife.ico";
import MYRESTRURENTLIFE from "../assets/icon/myrestaurantlife.ico";
import MYBUSINESSLIFE from "../assets/icon/mybusinesslife.ico";
import MYCHEFLIFE from "../assets/icon/mycheflife.ico";
import MYMUSICLIFE from "../assets/icon/mymusiclife.ico";
import MYPIZZALIFE from "../assets/icon/mypizzalife.ico";
import MYSTORELIFE from "../assets/icon/mystorelife.ico";
import MYBARTENDINGLIFE from "../assets/icon/mybartendinglife.ico";
import MYFRELANCERLIFE from "../assets/icon/myfreelancerlife.ico";
import MYSERVICELIFE from "../assets/icon/myservicelife.ico";
import MYTEMPLIFE from "../assets/icon/mytemplife.ico";
import MYCOOKINGLIFE from "../assets/icon/mycookinglife.ico";
import MYCPALIFE from "../assets/icon/mycpalife.ico";
import MYENTERTAINMENTLIFE from "../assets/icon/myentertainmentlife.ico";
import MYNIGHTLIFE from "../assets/icon/mynightlife.ico";
import MYAILIFE from "../assets/icon/myailife.ico";
import MYCLUBLIFE from "../assets/icon/myclublife.ico";
import MYMEDIALIFE from "../assets/icon/mymedialife.ico";
import MYSTYLISTLIFE from "../assets/icon/mystylistlife.ico";
import MYDEVLIFE from "../assets/icon/mydevlife.ico";
import MYLATINLIFE from "../assets/icon/mylatinlife.ico";
import MYMARKETLIFE from "../assets/icon/mymakerlife.ico";
import MYSALOONLIFE from "../assets/icon/mysaloonLife.ico";
import MYBARBERLIFE from "../assets/icon/mybarberlife.ico";
import MYGYMLIFE from "../assets/icon/mygymlife.ico";
import MYNITELIFE from "../assets/icon/mynitelife.ico";
import MYSALONLIFE from "../assets/icon/mysalonlife.ico";
import MYWORLDLIFE from "../assets/icon/myworldlife.ico";
import MYBARLIFE from "../assets/icon/mybarlife.ico";
import MYEVENTLIFE from "../assets/icon/myeventlife.ico";
import { useOnboard } from "./useOnboard";

function useFavicon() {
  const { onboard } = useOnboard();
  const domain = onboard?.user?.domain ?? "";
  const getLogo = useMemo(
    () =>
      ({
        mydjlife: MYDJLIFE,
        myinfluencerlife: MYDJLIFE,
        mystudentlife: MYSTUDENTLIFE,
        myrestaurantlife: MYRESTRURENTLIFE,
        mybusinesslife: MYBUSINESSLIFE,
        mycheflife: MYCHEFLIFE,
        mymusiclife: MYMUSICLIFE,
        mypizzalife: MYPIZZALIFE,
        mystorelife: MYSTORELIFE,
        mybartendinglife: MYBARTENDINGLIFE,
        myfreelancerlife: MYFRELANCERLIFE,
        myservicelife: MYSERVICELIFE,
        mytemplife: MYTEMPLIFE,
        mycookinglife: MYCOOKINGLIFE,
        mycpalife: MYCPALIFE,
        myentertainmentlife: MYENTERTAINMENTLIFE,
        mynightlife: MYNIGHTLIFE,
        myailife: MYAILIFE,
        myclublife: MYCLUBLIFE,
        mymedialife: MYMEDIALIFE,
        mystylistlife: MYSTYLISTLIFE,
        mydevlife: MYDEVLIFE,
        mylatinlife: MYLATINLIFE,
        mymakerlife: MYMARKETLIFE,
        mysaloonLife: MYSALOONLIFE,
        mybarberlife: MYBARBERLIFE,
        mygymlife: MYGYMLIFE,
        mynitelife: MYNITELIFE,
        mysalonlife: MYSALONLIFE,
        myworldlife: MYWORLDLIFE,
        mybarlife: MYBARLIFE,
        myeventlife: MYEVENTLIFE,
      } as Record<string, string>),
    []
  );
  useEffect(() => {
    let link = document.querySelector(
      "link[rel~='icon']"
    ) as HTMLLinkElement | null;
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
    link.href = getLogo[domain.replace(".me", "")];
  }, [domain, getLogo]);
}

export default useFavicon;

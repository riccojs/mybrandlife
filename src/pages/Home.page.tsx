import BrandList from "../component/home/Brand.list";
import CallOfAction from "../component/home/Call.of.action";
import CoreValues from "../component/home/Core.values";
import FunFacts from "../component/home/Fun.facts";

function HomePage() {
  return (
    <>
      <CallOfAction />
      <BrandList />
      <CoreValues />
      <FunFacts />
    </>
  );
}

export default HomePage;

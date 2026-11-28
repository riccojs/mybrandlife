import EcosystemBand from "../component/overview/Echosystem.brand";
import EcosystemCard from "../component/overview/Echosystem.card";
import FeatureGrid from "../component/overview/Feature.grid";
import FitsSection from "../component/overview/Fits.section";
import HeroSection from "../component/overview/Hero.section";
import UseCase from "../component/overview/Use.case";

const OverviewPage = () => {
  return (
    <>
      <HeroSection />
      <EcosystemCard />
      <EcosystemBand />
      <FitsSection />
      <FeatureGrid />
      <UseCase />
    </>
  );
};

export default OverviewPage;

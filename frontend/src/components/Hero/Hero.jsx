import HeroText from "./HeroText";
import HeroImage from "./HeroImage";
import HeroFeatures from "./HeroFeatures";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <HeroText />
        <HeroImage />
      </div>
      <HeroFeatures />
    </section>
  );
}

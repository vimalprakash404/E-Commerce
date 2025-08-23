import FeatureItem from "./FeatureItem";

export default function HeroFeatures() {
  const features = [
    { icon: "🚚", title: "Free Shipping", description: "Free delivery on orders over $50" },
    { icon: "🔒", title: "Secure Payment", description: "100% secure payment processing" },
    { icon: "↩️", title: "Easy Returns", description: "30-day hassle-free returns" },
    { icon: "⭐", title: "Top Quality", description: "Premium products guaranteed" },
  ];

  return (
    <div className="hero-features">
      {features.map((f, idx) => (
        <FeatureItem key={idx} {...f} />
      ))}
    </div>
  );
}

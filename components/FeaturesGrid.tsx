import FeatureCard from './FeatureCard';

const features = [
  {
    href: "/map",
    title: "Peta Interaktif",
    description: "Eksplorasi peta kerawanan dengan berbagai layer",
    color: "blue" as const
  },
  {
    href: "/analysis",
    title: "Analisis Lokasi", 
    description: "Analisis risiko berdasarkan parameter geospasial",
    color: "green" as const
  },
  {
    href: "/report",
    title: "Laporan",
    description: "Statistik dan laporan kerawanan longsor", 
    color: "red" as const
  }
];

export default function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          href={feature.href}
          title={feature.title}
          description={feature.description}
          color={feature.color}
        />
      ))}
    </div>
  );
}
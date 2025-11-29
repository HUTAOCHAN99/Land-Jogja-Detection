import InfoList from './InfoList';

const features = [
  "Pemetaan interaktif daerah rawan",
  "Analisis risiko berbasis parameter", 
  "Visualisasi data geospasial"
];

const usage = [
  "Klik pada peta untuk analisis",
  "Gunakan kontrol layer",
  "Lihat detail di popup informasi"
];

export default function AboutSection() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
        <h2 className="text-xl font-light text-gray-800 mb-6 text-center">
          Tentang Aplikasi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-500">
          <InfoList
            title="Fitur Utama"
            items={features}
            color="blue"
            bulletColor="text-blue-500"
          />
          <InfoList
            title="Cara Penggunaan"
            items={usage}
            color="green"
            bulletColor="text-green-500"
          />
        </div>
      </div>
    </div>
  );
}
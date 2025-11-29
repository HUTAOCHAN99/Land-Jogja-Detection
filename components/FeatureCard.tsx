import Link from 'next/link';

interface FeatureCardProps {
  href: string;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'red';
}

export default function FeatureCard({ 
  href, 
  title, 
  description}: FeatureCardProps) {
  return (
    <Link 
      href={href} 
      className="block bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-gray-100 hover:border-gray-300 hover:bg-white transition-all duration-150 group"
    >
      <div>
        <h3 className="font-medium text-gray-800 mb-1.5 group-hover:text-gray-900 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
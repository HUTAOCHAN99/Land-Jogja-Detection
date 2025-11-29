interface InfoListProps {
  title: string;
  items: string[];
  color: 'blue' | 'green';
  bulletColor: string;
}

export default function InfoList({ title, items, bulletColor }: InfoListProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wide">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className={`${bulletColor} mr-2`}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
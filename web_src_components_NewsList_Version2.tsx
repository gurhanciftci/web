import React from "react";

const getImportanceLabel = (importance: number) => {
  if (importance >= 5) return "Çok Önemli";
  if (importance >= 3) return "Önemli";
  return "Normal";
};

export default function NewsList({ news }: { news: any[] }) {
  return (
    <div>
      {news.map((item, i) => (
        <div key={i} className="p-4 border-b">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-200 text-blue-800 rounded px-2 text-xs">{item.category}</span>
            <span className={
              item.importance >= 5 ? "text-red-600 font-bold" :
              item.importance >= 3 ? "text-yellow-600 font-semibold" : "text-gray-600"
            }>
              {getImportanceLabel(item.importance)}
            </span>
          </div>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline block">
            {item.title}
          </a>
          <div className="text-gray-600 text-sm">{item.description}</div>
        </div>
      ))}
    </div>
  );
}
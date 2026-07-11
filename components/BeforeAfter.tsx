import Image from "next/image";

export default function BeforeAfter({ pair }: {
  pair: { title: string; unit_name?: string | null; work_done?: string | null; before_image: string; after_image: string };
}) {
  return (
    <figure className="card overflow-hidden">
      <div className="grid grid-cols-2">
        <div className="relative">
          <Image src={pair.before_image} alt={`${pair.title}${pair.unit_name ? ` (${pair.unit_name})` : ""} – before renovation`} width={500} height={600} className="h-64 sm:h-80 w-full object-cover" />
          <span className="absolute top-2 left-2 rounded bg-gray-900/80 text-white text-xs font-semibold px-2 py-1">BEFORE</span>
        </div>
        <div className="relative">
          <Image src={pair.after_image} alt={`${pair.title}${pair.unit_name ? ` (${pair.unit_name})` : ""} – after renovation`} width={500} height={600} className="h-64 sm:h-80 w-full object-cover" />
          <span className="absolute top-2 left-2 rounded bg-saffron-500 text-white text-xs font-semibold px-2 py-1">AFTER</span>
        </div>
      </div>
      <figcaption className="p-4">
        <p className="font-semibold text-primary-900">
          {pair.title}{pair.unit_name ? ` · ${pair.unit_name}` : ""}
        </p>
        {pair.work_done && <p className="text-sm text-gray-600 mt-1">{pair.work_done}</p>}
      </figcaption>
    </figure>
  );
}

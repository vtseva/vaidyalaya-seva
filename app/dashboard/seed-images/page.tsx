import { requireStaff } from "@/lib/auth";
import SeedUploader from "@/components/SeedUploader";

export default async function SeedImagesPage() {
  await requireStaff();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Media Uploader</h1>
      <p className="text-gray-600 text-sm mb-6">
        Upload website images to the public media bucket. Files keep their original names and are served
        at <code className="bg-warm-100 px-1 rounded">…/public-media/images/&lt;filename&gt;</code>.
        Used for the initial site seed and for adding new project photos.
      </p>
      <SeedUploader />
    </div>
  );
}

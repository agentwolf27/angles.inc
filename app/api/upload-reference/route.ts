import { NextResponse } from "next/server";
import { uploadBuffer, isCloudinaryConfigured } from "@/lib/cloudinary-server";

export async function POST(request: Request) {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "File uploads require Cloudinary. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];
  if (!files.length) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }

  const urls: string[] = [];
  for (const file of files) {
    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json(
        { error: `File ${file.name} exceeds 12MB` },
        { status: 400 }
      );
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const { secure_url } = await uploadBuffer(buf, "booking-references");
    urls.push(secure_url);
  }

  return NextResponse.json({ urls });
}

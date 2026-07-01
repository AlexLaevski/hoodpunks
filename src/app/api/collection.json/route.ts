import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const image = process.env.COLLECTION_IMAGE_URI || `${origin}/og/hood-punks.png`;
  const banner = process.env.COLLECTION_BANNER_URI || `${origin}/og/hood-punks-banner.png`;

  return NextResponse.json({
    name: "HOODPUNKS",
    description:
      "HOODPUNKS are chain-born portraits derived from real Robinhood Chain transaction entropy, preserving classic punk readability while letting gas, congestion, value, and execution stress scar the face.",
    image,
    banner_image: banner,
    featured_image: banner,
    external_link: origin,
    seller_fee_basis_points: 0,
    fee_recipient: "0x0000000000000000000000000000000000000000",
  });
}

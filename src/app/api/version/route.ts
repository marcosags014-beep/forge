// Build time is baked in at deploy — changes every push
const BUILD = process.env.NEXT_PUBLIC_BUILD_TIME ?? 'dev'

export async function GET() {
  return Response.json({ v: BUILD }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    status: 'ok',
    application: 'ApplyPilot AI',
    environment: process.env.APP_ENV || 'development',
    checkedAt: new Date().toISOString(),
    features: {
      routing: 'ready',
      preferences: 'planned',
      resume: 'planned',
      aiMatching: 'planned',
    },
  }, { headers: { 'Cache-Control': 'no-store' } });
}

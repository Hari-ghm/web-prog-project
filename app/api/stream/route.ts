export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      const fetchRealData = async () => {
        try {
          // Fetch real-time live generation data from the UK National Grid
          const res = await fetch('https://api.carbonintensity.org.uk/generation', { cache: 'no-store' });
          const json = await res.json();
          
          if (json && json.data && json.data.generationmix) {
            const mix = json.data.generationmix;
            
            const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
            
            // Extract some actual real-world datapoints
            const solarGen = mix.find((m: any) => m.fuel === 'solar')?.perc || 0;
            const windGen = mix.find((m: any) => m.fuel === 'wind')?.perc || 0;
            const gasGen = mix.find((m: any) => m.fuel === 'gas')?.perc || 0;
            const nuclearGen = mix.find((m: any) => m.fuel === 'nuclear')?.perc || 0;
            
            // For the sake of the graph, we'll convert these percentages into rough wattage/megawatt metrics 
            // (multiplying by 100 for dramatic effect on the chart since it expects W)
            const solarOutput = (solarGen + windGen) * 100; // Combined renewables
            const gridUsage = (gasGen + nuclearGen) * 150; // Conventional sources
            
            // Simulated battery derived from renewables surplus logic (just for the UI visual)
            const batteryLevel = Math.min(100, Math.max(0, 40 + (solarGen + windGen) - (gasGen / 10)));
            
            const data = {
              time,
              solarOutput: Math.round(solarOutput),
              gridUsage: Math.round(gridUsage),
              batteryLevel: Math.round(batteryLevel),
            };

            const message = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encoder.encode(message));
          }
        } catch (error) {
          console.error("Error fetching real data", error);
        }
      };

      // Send initial data immediately
      fetchRealData();

      // Poll real api every 15 seconds (real grids usually update much slower, but this keeps the stream active)
      const interval = setInterval(fetchRealData, 15000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}

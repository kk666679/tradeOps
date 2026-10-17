export function TrustBanner() {
  const ports = [
    { name: "Port of Tanjung Pelepas", logo: "https://qgmvsvq5fn67imzt.public.blob.vercel-storage.com/ptp.png" },
    { name: "Westports", logo: "https://qgmvsvq5fn67imzt.public.blob.vercel-storage.com/westports.png" },
    { name: "Johor Port", logo: "https://qgmvsvq5fn67imzt.public.blob.vercel-storage.com/Johor-Port-Authority%20%281%29.jpeg" },
    { name: "Port Klang Free Zone", logo: "https://qgmvsvq5fn67imzt.public.blob.vercel-storage.com/pkfz.png" },
    { name: "Kuantan Port", logo: "https://qgmvsvq5fn67imzt.public.blob.vercel-storage.com/kuantan.jpeg" },
    // 复制一份以实现无缝循环
    { name: "Port of Tanjung Pelepas", logo: "https://qgmvsvq5fn67imzt.public.blob.vercel-storage.com/ptp.png" },
    { name: "Westports", logo: "https://qgmvsvq5fn67imzt.public.blob.vercel-storage.com/westports.png" },
    { name: "Johor Port", logo: "https://qgmvsvq5fn67imzt.public.blob.vercel-storage.com/Johor-Port-Authority%20%281%29.jpeg" },
    { name: "Port Klang Free Zone", logo: "https://qgmvsvq5fn67imzt.public.blob.vercel-storage.com/pkfz.png" },
    { name: "Kuantan Port", logo: "https://qgmvsvq5fn67imzt.public.blob.vercel-storage.com/kuantan.jpeg" },
  ];

  return (
    <section className="relative w-full py-16 overflow-hidden border-y border-white/5 bg-[#050505]">
      {/* Cloud/Ambient Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase mb-10 text-center px-4">
          Trusted by operators across FIZ, FCZ, and bonded CFS
        </p>

        {/* Marquee Container with side fade masks */}
        <div className="w-full relative flex overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex animate-marquee whitespace-nowrap gap-6 px-4 items-center">
            {ports.map((port, i) => (
              <div 
                key={i} 
                className="flex items-center justify-center h-24 w-48 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 px-6 py-4 transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20 group"
              >
                {/* 使用原生 img 标签避免外部域名在 next.config.js 的配置麻烦 */}
                <img
                  src={port.logo}
                  alt={port.name}
                  className="max-h-full max-w-full object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

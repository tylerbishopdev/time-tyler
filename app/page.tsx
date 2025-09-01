import { ConvAI } from "@/components/ConvAI";
import ModelViewer from "@/components/ModelViewer";
import Image from "next/image";

export default function Home() {
    return (
        <div className="min-h-screen p-4 md:p-6 pb-0 font-[family-name:var(--font-geist-sans)]">
            <Image src="/tylerftf.png" alt="Tyler From The Future" width={200} height={200} className=" mx-auto pb-8 opacity-70 hue-rotate-180 invert-50 grayscale" />

            <main className="mx-auto max-w-6xl rounded-2xl border border-[#AC5B31]/10 shadow-inner shadow-[#AC5B31]/70  backdrop-blur-xl bg-gradient-to-br from-zinc-950/20 via-blue-950/0 to-yellow-950/20 pt-6 md:pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                    <div className="p-4 md:p-4">
                        <div className="w-full border border-[#AC5B31]/90 flex flex-col pb-0 h-[260px] md:h-[360px] lg:h-[530px] rounded-2xl overflow-hidden mx-auto">
                            <ModelViewer />
                        </div>
                    </div>
                    <div className="p-4 md:p-6">
                        <div className="w-full h-[260px] md:h-[360px] lg:h-[520px] flex items-center justify-center">
                            <ConvAI />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

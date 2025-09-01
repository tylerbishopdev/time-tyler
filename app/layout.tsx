import type { Metadata } from "next";
import "./globals.css";
import { ShaderAnimation } from "@/components/ui/shader-animation";

export const metadata: Metadata = {
    title: "Tyler From Future",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={"h-screen w-full"}>
            <body className={`antialiased relative bg-gradient-to-br from-blue-950/20 via-blue-950/10 to-yellow-950/20 raw-full h-screen flex flex-col`}>

                <ShaderAnimation />


                <div className="relative z-0 flex-1">
                    {children}
                </div>



            </body>
        </html >
    );
}

import { PropsWithChildren } from "react";

export function Code({ children }: PropsWithChildren) {
    return <span className={'border rounded border-blue-400 bg-blue-400 text-zinc-500 py-0.5 px-1'}>{children}</span>
}
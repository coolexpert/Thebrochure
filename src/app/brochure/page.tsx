import dynamic from "next/dynamic";
const BrochuneInput = dynamic(() => import("@/layout/BrochuneInput"), { ssr: false })
export default function Step1() {
  return <BrochuneInput />
}

"use client";
import { ErrorSVG } from "@/assets/images";
import IssuePage from "@/components/templates/issue-page";
import Image from "next/image";

const page = () => {
  return (
    <IssuePage
      image={<Image alt="404" height={300} width={300} src={ErrorSVG.src} />}
      title="Something went wrong"
      description="An unexpected error has occurred. Please try again later."
    />
  );
};

export default page;

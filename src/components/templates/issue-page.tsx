import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { NotFoundSVG } from "@/assets/images";
import { Button } from "@/components/ui/button";

type IssuePageProps = {
  title: string;
  description: string;
  image?: React.ReactNode;
};

const IssuePage: React.FC<IssuePageProps> = ({ title, description, image }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      {image || (
        <Image alt="404" height={300} width={300} src={NotFoundSVG.src} />
      )}
      <h1 className="text-3xl font-bold mt-3">{title}</h1>
      <p className="max-w-2xl mt-3">{description}</p>
      <Link href="/">
        <Button className="mt-5 rounded-full !px-5 !h-12">
          <ArrowLeft className="mr-2" />
          <span>Back to Home</span>
        </Button>
      </Link>
    </div>
  );
};

export default IssuePage;

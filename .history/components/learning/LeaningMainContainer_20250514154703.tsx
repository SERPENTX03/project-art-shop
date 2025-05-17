"use client";

import { DataLearning } from "@/data/DataLearning";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import PopupLearning from "./PopupLearning";

const LeaningMainContainer = () => {
  const [modal, setModel] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<
    (typeof DataLearning)[0] | null
  >(null);

  return (
    <section className="max-w-[1000px] mx-auto -z-10">
      <div className="flex justify-center">
        <div className="flex justify-center gap-y-3 flex-col h-36 rounded-b-full w-80 border-b border-x text-center">
          <h1 className="text-3xl font-bold">LEARNING</h1>
          <p className="text-[#742D2F] font-semibold text-sm">ARTS & ARTIST</p>
        </div>
      </div>

      {DataLearning.map((l, index) => (
        <div
          className={`flex w-full mt-10 items-center justify-between gap-10 ${
            index % 2 === 1 ? "flex-row-reverse" : ""
          }`}
          key={index}
        >
          <div className={`flex ${l.widthImage}`}>
            <Image
              priority
              className="object-cover"
              src={l.img}
              alt={`learning-${index}`}
              width={400}
              height={400}
            />
          </div>
          <div className={`flex justify-center flex-col ${l.widthDescription}`}>
            <p className={`text-lg ml-4 ${l.lineHeight}`}>
              {l.description.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <Button
              onClick={() => {
                setSelectedData(l);
                setModel(true);
              }}
              type="button"
              className="mt-10 button-custom w-fit py-1 px-3"
            >
              READ MORE
            </Button>
            <span className="border-b mt-10"></span>
          </div>
        </div>
      ))}

      {modal && selectedData && (
        <PopupLearning setModel={setModel} data={selectedData} />
      )}
    </section>
  );
};

export default LeaningMainContainer;

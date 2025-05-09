"use client";
import { DataLearning } from "@/utils/DataLearning";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import PopupLearning from "./PopupLearning";

const LeaningMainContainer = () => {
  const [modal, setModel] = useState(false);
  return (
    <section className="max-w-[1000px] mx-auto">
      <div className="flex justify-center  ">
        <div className="flex justify-center gap-y-3 flex-col h-36 rounded-b-full w-80 border-b border-x text-center">
          <h1 className="text-3xl font-bold ">LEARNING</h1>
          <p className="text-[#742D2F] font-semibold text-sm">ARTS&ARTIST</p>
        </div>
      </div>
      {DataLearning.map((l, index) => {
        return (
          <div
            className={`flex w-full  mt-10 items-center justify-between gap-10 ${
              index % 2 === 1 ? "flex-row-reverse" : ""
            }`}
            key={index}
          >
            <div className={`flex ${l.widthImage}`}>
              <Image
                priority
                className={`object-cover`}
                src={l.img}
                alt={`learning-${index}`}
                width={400}
                height={400}
              />
            </div>
            <div
              className={`flex justify-center flex-col ${l.widthDescription}`}
            >
              <p className={`text-lg ml-4 ${l.lineHeight}`}>
                {l.description.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
              <Button
                onClick={() => setModel(true)}
                className="mt-10 button-custom w-fit py-1 px-3 "
              >
                READ MORE
              </Button>

              {modal ? <PopupLearning /> : ""}
              <span className="border-b mt-10"></span>
            </div>
          </div>
        );
      })}
    </section>
  );
};
export default LeaningMainContainer;

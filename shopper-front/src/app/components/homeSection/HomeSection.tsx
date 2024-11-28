import React from "react";
import Image from "next/image";
import "./style.css";

export default function HomeSection() {
  return (
    <section className="homeSection">
      <Image src="/logo.png" alt="Logo" width={170} height={200} />
      <h1 className="homeSection__title">
        Olá! <br />
        Para onde vamos hoje?
      </h1>
      <h3 className="homeSection__subTitle">
        Dando a volta ao mundo para te levar com segurança e conforto
      </h3>
    </section>
  );
}

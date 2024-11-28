"use client";
import React, { useRef } from "react";
import "./style.css";
import { setCookie } from "cookies-next";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

export default function LoginForm() {
  const userIdRef = useRef<HTMLInputElement>(null);

  const setUserOnCookie = () => {
    if (!userIdRef.current) return;

    const { value } = userIdRef.current;

    const isPositive = isPositiveNumber(value);

    if (isPositive) {
      setCookie("userId", value, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 10 * 1000),
      });
      redirect("/map");
    } else {
      toast("O userId necessita ser um número e ser positivo");
    }
  };

  function isPositiveNumber(text: string) {
    const num = parseFloat(text);

    return !isNaN(num) && num > 0;
  }

  return (
    <section className="loginForm">
      <h4 className="loginForm__title">Login</h4>
      <input
        type="text"
        placeholder="UserId"
        className="loginForm__input"
        ref={userIdRef}
      />
      <button className="loginForm__button button" onClick={setUserOnCookie}>
        Entrar
      </button>
    </section>
  );
}

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface IHistory {
  id: number;
  date: Date;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

export default function History() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<IHistory[]>([]);

  function toggle(force?: boolean) {
    if (force) {
      setOpen(force);
    } else {
      setOpen(!open);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const response = await fetch(
      `http://localhost:8080/ride/${await getCookie("userId")}`
    );

    const responseData = await response.json();
    if (response.status != 200 && responseData.error_code != "NO_RIDES_FOUND") {
      toast.error(responseData.error_description, {
        style: { background: "#1C1933", color: "#d16464" },
        duration: 10000,
      });
    } else {
      setHistory(responseData.rides ?? []);
    }
  }
  return (
    <>
      <button
        onClick={() => toggle(true)}
        className="absolute right-16 top-16 z-30 bg-[#1bb371] text-[#ffffff] cursor-pointer p-4 rounded-md"
      >
        Histórico
      </button>
      <div
        className={`transition-all absolute w-full lg:w-1/4 inset-y-0 right-0 bg-zinc-200 z-40 ${
          !open && "translate-x-full"
        }`}
      >
        <div className="flex justify-between px-4 pt-4">
          <button
            className="bg-red-500 p-2 rounded-md text-white"
            onClick={() => toggle(false)}
          >
            Fechar
          </button>
          <button
            className="bg-green-500 p-2 rounded-md text-white"
            onClick={refresh}
          >
            Atualizar
          </button>
        </div>
        <div>
          {history.map((ride) => {
            const date = new Date(ride.date);
            return (
              <div
                key={ride.id}
                className="p-2 m-4 bg-white rounded-md border-2 border-[#1bb371] flex flex-col gap-2"
              >
                <div className="flex justify-between">
                  <span>{ride.driver.name}</span>
                  <span>
                    {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">De: {ride.origin}</span>
                  <span className="text-sm">Para: {ride.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distancia: {ride.distance}m</span>
                  <span>Valor: R$ {ride.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

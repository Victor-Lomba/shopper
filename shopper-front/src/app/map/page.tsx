"use client";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import History from "../components/history/History";

interface IFormData {
  from: string;
  to: string;
}

interface IOption {
  id: number;
  name: string;
  value: number;
  vehicle: string;
  description: string;
  review: {
    rating: number;
    comment: string;
  };
}

interface IRouteInfo {
  distance: number;
  duration: string;
}

export default function Page() {
  const [options, setOptions] = useState<IOption[]>();
  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<IRouteInfo>();
  const { handleSubmit, register, reset } = useForm<IFormData>();
  const onSubmit = async (data: IFormData) => {
    const customer_id = await getCookie("userId");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/ride/estimate", {
        body: JSON.stringify({
          customer_id,
          origin: data.from,
          destination: data.to,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (response.status != 200)
        return toast.error(responseData.message, {
          style: { background: "#1C1933", color: "#d16464" },
          duration: 10000,
        });
      setOrigin(data.from);
      setDestination(data.to);
      setOptions(responseData.options);
      setRouteInfo({
        distance: responseData.distance,
        duration: responseData.duration,
      });
    } catch (err) {
      console.error(err);
      toast.error(err as string, {
        style: { background: "#1C1933", color: "#d16464" },
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };
  const [origin, setOrigin] = useState<string>();
  const [destination, setDestination] = useState<string>();

  return (
    <main
      className="lg:bg-zinc-200 relative flex lg:grid"
      style={{ gridTemplateColumns: "1fr 2fr" }}
    >
      <History />
      {loading && (
        <div className="fixed inset-0 bg-gray-950/50 z-50">
          <div className="flex h-full w-full justify-center content-center">
            <Image
              src="/spinner.svg"
              alt="loading screen"
              width={64}
              height={64}
            />
          </div>
        </div>
      )}
      <div className="lg:flex-1 lg:h-full absolute z-10 lg:static bottom-0 left-0 w-full bg-zinc-200 pb-4 lg:pb-0  ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col px-4 lg:px-8"
        >
          <div className="relative mt-4">
            <input
              type="text"
              className="border-2 border-green-500 rounded-lg p-2 w-full"
              placeholder="Ponto de partida"
              {...register("from", { required: true })}
            />
            <Image
              src="/map-start.svg"
              alt=""
              width={30}
              height={30}
              className="absolute right-[5px] top-[5px]"
            />
          </div>
          <div className="relative mt-4 mb-4">
            <input
              type="text"
              placeholder="Destino"
              className="border-2 border-green-500 rounded-lg p-2 w-full"
              {...register("to", { required: true })}
            />
            <Image
              src="/map-end.svg"
              alt=""
              width={30}
              height={30}
              className="absolute right-[5px] top-[5px]"
            />
          </div>

          <input type="submit" className="button" value={"Buscar"} />
        </form>
        <div>
          {options?.map((option) => {
            return (
              <div
                key={option.id}
                className=" w-100 m-6 p-6 border-2 border-[#1bb371] bg-[#ffffff] flex flex-col gap-4 rounded-lg"
              >
                <div className="flex justify-between">
                  <span>{option.name}</span>
                  <span className="flex gap-2">
                    <Image width={24} height={24} alt="carro" src="/car.svg" />
                    {option.vehicle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <p className="w-2/3 text-sm text-gray-500">
                    {option.description}
                  </p>
                  <div className="flex ">
                    {[0, 1, 2, 3, 4].map((star) => {
                      if (star < option.review.rating) {
                        return (
                          <Image
                            alt="Estrela"
                            src="/star-yellow.svg"
                            key={star}
                            width={24}
                            height={24}
                          />
                        );
                      } else {
                        return (
                          <Image
                            alt="Estrela"
                            src="/star-gray.svg"
                            key={star}
                            width={24}
                            height={24}
                          />
                        );
                      }
                    })}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>R$: {option.value.toFixed(2)}</span>
                  <button
                    className="bg-[#1bb371] p-2 rounded-md text-[#ffffff]"
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const response = await fetch(
                          "http://localhost:8080/ride/confirm",
                          {
                            method: "PATCH",
                            body: JSON.stringify({
                              customer_id: await getCookie("userId"),
                              origin,
                              destination,
                              distance: routeInfo?.distance,
                              duration: routeInfo?.duration,
                              value: option.value,
                              driver: {
                                name: option.name,
                                id: option.id,
                              },
                            }),
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        );
                        const responseData = await response.json();
                        if (response.status != 200) {
                          toast.error(responseData.error_description, {
                            style: { background: "#1C1933", color: "#d16464" },
                            duration: 10000,
                          });
                        }

                        setOptions(undefined);
                        setRouteInfo(undefined);
                        reset();
                        toast.success("Corrida iniciada com sucesso!", {
                          style: { background: "#1C1933", color: "#1bb371" },
                          duration: 10000,
                        });
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Aceitar corrida
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Map
        style={{ width: "100%", height: "100vh" }}
        defaultZoom={13}
        disableDefaultUI={true}
        defaultCenter={{ lat: -21.1767, lng: -47.8208 }}
        clickableIcons={false}
      >
        <Directions destination={destination} origin={origin} />
      </Map>
    </main>
  );
}

interface DirectionsParams {
  origin: string | undefined;
  destination: string | undefined;
}

function Directions({ origin, destination }: DirectionsParams) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    try {
      if (!directionsRenderer || !directionsService || !origin || !destination)
        return;
      directionsService
        .route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
        });
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    }
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
}

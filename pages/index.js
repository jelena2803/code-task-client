import React from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    if (router.isReady) {
      const response = axios
        .get("https://wizard-houses-api.vercel.app/")
        .then((response) => {
          setHouses(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data", error);
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        });
    }
  }, [router.isReady, router.query]);

  // 2 fetched colour names validation test
  function colorTest(colour1, colour2) {
    return CSS.supports("color", colour1) && CSS.supports("color", colour2);
  }

  return (
    <>
      <Head>
        <title>Pircel Task</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        {loading ? (
          <div className={"spinner-container"}>
            <ClipLoader
              color={"#740001"}
              cssOverride={{}}
              loading
              size={40}
              speedMultiplier={0.6}
            />
          </div>
        ) : (
          <div>
            {/* test the colors from the data fetched of each element and render them*/}
            {houses.map((e) => {
              let str = e.houseColours;
              let colours = str.toLowerCase().split(" ");
              let testColours = colorTest(colours[0], colours[2]);
              return (
                <div className="container" key={e.id}>
                  <div className="first-info">
                    <h3>{e.name}</h3>
                    <p className="animal-name">{e.animal}</p>
                  </div>
                  <div
                    className="coloured-div"
                    style={
                      testColours
                        ? {
                            background: `linear-gradient(to right, ${colours[0]}, ${colours[2]})`,
                          }
                        : {
                            background:
                              "linear-gradient(to right, white, black)",
                          }
                    }
                  ></div>
                  <p className="founder-info">
                    Founder: <strong>{e.founder}</strong>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const { name } = query;

  if (!context) {
    //if context is undefined
    return { props: {} };
  } else
    return {
      props: {
        name: name || null,
      },
    };
}

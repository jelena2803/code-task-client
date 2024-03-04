import React from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const HousesBase = () => {
  const [loading, setLoading] = useState(true);
  const [houses, setHouses] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (router.isReady) {
      const nameParam = searchParams.get("name");
      const response = axios
        .get(`https://wizard-houses-api.vercel.app/houses?name=${nameParam}`)
        .then((response) => {
          setHouses(response.data);
        })
        .catch((error) => {
          console.error(
            "Error fetching data for https://wizard-houses-api.vercel.app/houses?name=",
            error
          );
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        });
    }
  }, [router.isReady]);

  // CSS validation test for pair of colour names
  function colorTest(colour1, colour2) {
    return CSS.supports("color", colour1) && CSS.supports("color", colour2);
  }

  return (
    <div className={"search-container"}>
      <h3>Your search results</h3>

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
          {houses.map((e) => {
            let str = e.houseColours;
            let colours = str.toLowerCase().split(" ");
            let testColours = colorTest(colours[0], colours[2]);
            return (
              <div className="container" key={e.id}>
                <div className="first-info">
                  <h3>{e.name}</h3> <p className="animal-name">{e.animal}</p>
                </div>
                <div
                  className="coloured-div"
                  style={
                    testColours
                      ? {
                          background: `linear-gradient(to right, ${colours[0]}, ${colours[2]})`,
                        }
                      : {
                          background: "linear-gradient(to right, white, black)",
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
    </div>
  );
};

export default HousesBase;

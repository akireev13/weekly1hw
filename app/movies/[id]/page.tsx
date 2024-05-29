"use client";

import { MovieType } from "@/types/MovieType";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";



export default function MoviePage({ params }: {
    params: {
        id: string;
    }
}) {
    const router = useRouter();
    const [movie, setMovie] = useState<MovieType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const matcher = (obj: MovieType) => {
            const match = obj.imdb_url.match(/tt(\d+)\//);
            if (!match || match[1] != params.id) {
                return false;
            }
            return true;
        }


        const fetcher = async () => {
            try {
                setLoading(true);
                const res = await fetch('/data/movies.json');
                const data: MovieType[] = await res.json();
                const mov = data.find(matcher);
                if (!mov) {
                    throw new Error();
                }
                setMovie(mov);
            } catch {
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        }

        fetcher();
    }, []);


    return (
        <div className="bg-gradient-to-br from-black to-neutral-500 h-full">


            <div className="p-6 mx-auto max-w-[80%]">
                {loading && (
                    <p>Loading...</p>
                )}
                {error && (
                    <p>{error}</p>
                )}
                {!error && !loading && movie && (
                    <div>

                        <div>
                            <button
                                onClick={() => router.push("/")}
                                className="rounded-md border p-2 group hover:bg-white"
                            >
                                <p className="group-hover:text-black">Return to main page</p>
                            </button>
                        </div>
                        <div className="info-container mt-8">
                            <div className="main-info grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <div className="image">
                                    <Image
                                        src={movie.image_url}
                                        width={278}
                                        height={412}
                                        alt={movie.name}
                                        className="w-full rounded-md"
                                    />
                                </div>
                                <div className="main-content">
                                    <h1 className="text-7xl font-bold">
                                        {movie.name}
                                    </h1>
                                    <h4 className="text-xl">{movie.year}</h4>
                                    <h2 className="text-2xl mt-8">{movie.desc}</h2>
                                    <h4 className="mt-6 text-xl"><b>Actors:</b> {movie.actors.join(", ")}</h4>
                                    <h4 className=" text-xl"><b>Directors:</b> {movie.directors.join(", ")}</h4>
                                    <h4 className=" text-xl"><b>Genres:</b> {movie.genre.join(", ")}</h4>
                                    <h2 className="text-2xl mt-8"><b>IMDB rating:</b> {movie.rating}/10</h2>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
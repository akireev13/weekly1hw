"use client"

import { MovieCard } from "@/components/MovieCard";
import { useEffect, useRef, useState } from "react";
import { MovieType } from "@/types/MovieType";
import { useRouter, useSearchParams } from "next/navigation";


export default function FavoritesPage() {

    const search = useSearchParams();

    const [data, setData] = useState<MovieType[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const favoritesFetcher = async () => {
            try {
                setLoading(true);

                const moviesJSON: string | null = localStorage.getItem('favoriteMovies');
                const movies_urls: string[] = moviesJSON ? JSON.parse(moviesJSON) : [];

                const res = await fetch('/data/movies.json');
                let data: MovieType[] = await res.json();
                data = data.filter(item => movies_urls.includes(item.imdb_url));
                if (search.get("name"))
                    data = data.filter(item => (item.name.toLowerCase().includes(search.get("name") || "#&!@#*@!#")))
                data.sort((a: MovieType, b: MovieType) => a.rating - b.rating)
                setData(data);
            } catch {
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        }

        favoritesFetcher();
    }, [search]);

    const router = useRouter();

    const handleClick = () => {
        if (ref.current) {
            const value = ref.current.value;
            if (value !== "") {
                router.push(`?name=${value}`);
            }
            else {
                router.push('/');
            }
        }
    }

    const ref = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-gradient-to-br from-black to-neutral-700 bg-fixed pb-64 h-full">


            <div className="container mx-auto max-w-[80%]">
                {loading && (
                    <p>Loading...</p>
                )}
                {error && (
                    <p>{error}</p>
                )}
                {!error && !loading && data && (
                    <div className="pt-6">
                        <h1 className="text-7xl font-[800] text-center">Favorites</h1>
                        <div className="my-4">
                            <button
                                onClick={() => router.push("/")}
                                className="rounded-md border p-2 group hover:bg-white"
                            >
                                <p className="group-hover:text-black">Return to main page</p>
                            </button>
                        </div>
                        <div className="search-container">
                            <input
                                type="text"
                                className="rounded-md bg-white p-2 text-black w-[400px]"
                                placeholder="Search for movie's name..."
                                ref={ref}
                            />
                            <button className="ml-4 rounded-md p-2 bg-slate-500 hover:bg-slate-700"
                                onClick={handleClick}
                            >
                                Search
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                            {data.map((movie) => (
                                < MovieCard movie={movie} key={movie.name} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

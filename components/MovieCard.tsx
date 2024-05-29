"use client";


import { MovieType } from "@/types/MovieType"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { BiPlus } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
interface MovieCardProps {
    movie: MovieType
}

export function MovieCard({ movie }: MovieCardProps) {


    const addMovie = (movie_url: string) => {
        const moviesJSON: string | null = localStorage.getItem('favoriteMovies');
        let movies: string[] = moviesJSON ? JSON.parse(moviesJSON) : [];
        movies.push(movie_url);
        localStorage.setItem('favoriteMovies', JSON.stringify(movies));
    }

    const router = useRouter();

    const handleClick = () => {
        const match = movie.imdb_url.match(/tt(\d+)\//);
        if (!match) {
            throw new Error("Error fetching the movie's info");
        }
        router.push(`/movies/${match[1]}`)
    }

    return (
        <div
            className="group relative rounded-lg bg-white text-slate-600 p-1 flex flex-col align-center justify-between shadow-white-bottom hover:bg-slate-200"
        >
            <div>
                <Image
                    src={movie.thumb_url}
                    width={278}
                    height={412}
                    alt={movie.name}
                    className="w-full rounded-lg"
                />

            </div>
            <div>

                <h1 className="text-md text-black font-bold group-hover:opacity-0 max-w-[80%]">{movie.name}</h1>
                <p className="group-hover:opacity-0 text-slate-700">{movie.year}</p>
            </div>

            <div className="group-hover:opacity-100 opacity-0 transition-all duration-300 absolute left-0 z-50 top-[90%] p-2 bg-slate-200">
                <h1 className="text-md text-black font-bold max-w-[80%]">{movie.name}</h1>
                <div
                    className="absolute right-5 top-2 bg-black p-2 text-xl text-white rounded-[50%] hover:opacity-75 "
                    onClick={() => addMovie(movie.imdb_url)}>

                    <BiPlus />
                </div>
                <p className="text-slate-700">{movie.year}</p>
                <p className="line-clamp-3">{movie.desc}</p>
                <div className="flex justify-center align-center flex-wrap">
                    {movie.genre.map(genre => (
                        <div className="flex justify-center align-center p-2 text-black" key={genre}>{genre}</div>
                    ))}
                </div>
                <div className="flex align-center">
                    <h3><b>Rating:</b> {movie.rating}/10 </h3>
                    <div className="pt-1">
                        <FaStar />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button onClick={handleClick}
                        className="bg-black text-white p-2 rounded-md hover:opacity-75"
                    >
                        View more
                    </button>
                </div>

            </div>
        </div>
    )
}
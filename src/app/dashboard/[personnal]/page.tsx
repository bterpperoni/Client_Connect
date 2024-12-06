"use client"

import { useParams } from "next/navigation";


export default function Personnal() {

    // Get the query from the URL
    const { id } = useParams();

  return (
    <div>
      <h1 className="text-xl m-10 text-black">Personnal {id as string}</h1>
      
    </div>
  );
}

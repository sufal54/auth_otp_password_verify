"use client"

import {  api_user_data, get_user_data } from "@/apis/apis";
import { useStore } from "@/context/context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const{setMyStore}=useStore();

  useEffect(()=>{
    const get_user = async():Promise<void>=>{
      const user_data:api_user_data | null = await get_user_data();
      if(!user_data){
        router.push("/login");
        return;
      }
      setMyStore(user_data);
    }
    get_user();
    const cookies = document.cookie.split(";");
    for(let i=0;i<cookies.length;i++){
      const cookie = cookies[i].trim();
      if(cookie.startsWith("authToken")){
        console.log("okay");
      }
    }
    return ()=>{};
  },[]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-blue-500">
      <main className="bg-black/60 p-8 rounded-lg shadow-lg w-96 text-white transition duration-300 transform">
        <h1 className="w-full text-4xl text-center">Home page</h1>
      </main>
    </div>
  );
}

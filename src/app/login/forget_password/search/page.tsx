"use client"
import { reset_pass } from '@/apis/apis';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Set_password = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id:string|null  = searchParams.get("id");

    const [waitTime, setWaitTime] = useState<Date>(new Date());
    const [smthingWrong, setSmthingWrong] = useState<boolean>(false);
    const [password, setPassword] = useState<{password:string;chcek_password:string}>({password:"",chcek_password:""});
    const [isPassSame, setIsPassSame] = useState<boolean>(true);
    
    const chcke_set_password = (e: { target: { value: string; }; }):void=>{
        setPassword((prv)=>({...prv,chcek_password:e.target.value}));
        setIsPassSame((password.password == e.target.value)?true:false);
    }

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>):Promise<void>=>{
      e.preventDefault();
      if(waitTime < new Date()){
        setWaitTime(new Date(new Date().getTime() + 1*60*1000));
        if(id && await reset_pass(password.password,id)){
          router.push("/login");
        }else{
          setSmthingWrong(true);
        }
      }
    }

    useEffect(() => {
      if(!id){
        router.push("/login/forget_password");
      }
    
      return () => {}
    }, []);
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-blue-500">
        <main className="bg-black/60 p-8 rounded-lg shadow-lg w-96 text-white transition duration-300 transform">
          <h1 className="text-2xl font-bold mb-3 text-center">
            Reset Password
          </h1>
          {
            smthingWrong && (
              <div className='mb-2 flex items-center justify-center'>
                <span className='text-red-500'>something is wrong</span>
              </div>
            )
          }
          <form action="" onSubmit={handleSubmit}>
            <div className="mb-4">
            <label htmlFor="email"
            className="block text-sm font-medium mb-1">
                New Password
            </label>
            <input value={password.password} onChange={(e)=>setPassword((prv)=>({...prv,password:e.target.value}))} type="text" id="email" placeholder="Enter your new password" 
            className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring focus:ring-blue-500"/>
            </div>
            <div className="mb-4">
            <label htmlFor="email"
            className="block text-sm font-medium mb-1">
                Re-Enter Password
            </label>
            <input value={password.chcek_password} onChange={chcke_set_password}  type="text" id="email" placeholder="Re-Enter you'r password" 
            className={`w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded ${!isPassSame && "ring ring-red-500"} focus:outline-none focus:ring ${isPassSame?"focus:ring-blue-500":"focus:ring-red-500"}`}/>
            </div>
            <button type="submit"
            className="w-full bg-blue-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition duration-300">
            Reset Password
            </button>
          </form>
      
        </main>
      </div>
    )
}

export default Set_password;
"use client"

import { req_forget_pass } from "@/apis/apis";
import { useState } from "react";

const Forget_password = () => {
    const [email, setEmail] = useState<string>("");
    const [isWait, setIsWait] = useState<boolean>(false);
    const [somethingWrong, setSomethingWrong] = useState<boolean>(false);
    const [isReqSend, setIsReqSend] = useState<boolean>(false); 

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      if(!isWait){
        setIsWait(true);
        if(await req_forget_pass(email)){
          setIsReqSend(true);
          setIsWait(false);
        }else{
          setIsWait(false);
          setIsReqSend(true);
          setSomethingWrong(true);
        }
      }
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-blue-500">
        <main className="bg-black/60 p-8 rounded-lg shadow-lg w-96 text-white transition duration-300 transform">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Recover Password
          </h1>
          {
            isReqSend ?
            (
              <div className="flex items-center justify-center">
                <span className="text-green-400">
                  {
                    somethingWrong ? "Invaild link or expired" : "a mail sent to you'r E-mail"
                  }
                </span>
              </div>
            ) : (
              <form action="" onSubmit={handleSubmit}>
            <div className="mb-4">
            <label htmlFor="email"
            className="block text-sm font-medium mb-1">
                Email
            </label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" id="email" placeholder="Enter your new password" 
            className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring focus:ring-blue-500"/>
            </div>
            <button type="submit"
            className={`relative w-full ${isWait ? "bg-gray-500" : "bg-blue-500 hover:bg-green-600"} text-white font-medium py-2 px-4 rounded transition duration-300`}>
              Send Link
              {
                isWait && (<div className="absolute right-24 top-2 animate-spin w-7 h-7 border-t-transparent border-solid rounded-full border-green-500 border-4 "></div>)
              }
            </button>
          </form>
            )
          }
      
        </main>
      </div>
    )
  }
  
export default Forget_password;
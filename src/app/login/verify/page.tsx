"use client"

import { req_send_email, verify_email } from "@/apis/apis";
import { useStore } from "@/context/context";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Verify_user = () => {
  const [otpCode, setOtpCode] = useState<string[]>(["","","",""]);
  const [wrongCode, setWrongCode] = useState<boolean>(false);
  const [isWait, setIsWait] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const {myStore}=useStore();
  const router = useRouter();

  const handleSubmit =async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!isWait){
      setIsWait(true);
      const code = otpCode.join("");
      if(!await verify_email(myStore.user_name,code)){
        setWrongCode(true);
        setIsWait(false);
      }else{
        setWrongCode(false);
        router.push("/login");
      }
    }
  }

  const resend_code = async()=>{
    if(timer == 0){
      setTimer(60);
      console.log(myStore.user_name);
      if(myStore.user_name){
        await req_send_email(myStore.user_name);
      }
      const inter_Vaild = setInterval(()=>{
        setTimer((prv)=>{
          if(prv <= 1){
            clearInterval(inter_Vaild);
            return 0;
          }
          return prv - 1;
        });
        
      }, 1000);
    }
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>,idx:number)=>{
    const value = e.target.value;

    if(/[^0-9]/.test(value)){ 
      return;
    }
    const newOtp = [...otpCode];
    newOtp[idx] = value;
    setOtpCode(newOtp);
    if(value && idx <otpCode.length -1){
      const nextInput = document.getElementById(`otp-idx-${idx+1}`);
      if(nextInput){
        nextInput.focus();
      }
    }
  }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-blue-500">
        <main className="bg-black/60 p-8 rounded-lg shadow-lg w-96 text-white transition duration-300 transform">
          <h1 className="text-2xl font-bold mb-6 text-green-400 text-center">
            Chcek {"you'r"} email
          </h1>
          <form action="" onSubmit={handleSubmit}>
            <div className="flex justify-between">
              {otpCode.map((digit,idx)=>(
                <input type="text" id={`otp-idx-${idx}`} key={idx} maxLength={1} value={digit} onChange={(e)=>handleChange(e,idx)} className="w-12 h-12 text-xl text-center text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400" />
              ))}
            </div>
            {wrongCode && <p className="text-red-500 text-lg text-center mt-2">Invalid code or expired</p>}
            <button type="submit"
            className={`relative w-full mt-5 ${isWait ? "bg-gray-500" : "bg-blue-500 hover:bg-green-600"} text-white font-medium py-2 px-4 rounded transition duration-300`}>
              Verify
              {
                isWait && (<div className="absolute right-24 top-2 animate-spin w-7 h-7 border-t-transparent border-solid rounded-full border-green-500 border-4 "></div>)
              }
            </button>
          </form>
              <div className="flex items-center justify-center">
                <span onClick={resend_code} className={`text-center ${timer == 0 ? "text-blue-500 hover:underline" : "text-gray-500"} mt-3 cursor-pointer`}>Resend code {timer == 0 ? "" : timer}</span>
              </div>
        </main>
      </div>
    )
  }
  
export default Verify_user;
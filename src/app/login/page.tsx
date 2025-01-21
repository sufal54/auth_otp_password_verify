"use client"
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login_data_type, req_login, req_send_email, req_signup } from "@/apis/apis";
import { useStore } from "@/context/context";


const Login:React.FC = () => {
  const [userData, setUserData] = useState<login_data_type>({user_name:"",email:"",password:""});
  const [wrongID, setWrongID] = useState<boolean>(false);
  const [isWait, setIsWait] = useState<boolean>(false);

  const [isLogin,setIsLogin] = useState<boolean>(true);
  const router = useRouter();

  const {setMyStore} = useStore();

  const toggleForm =():void=>{
    setIsLogin((prv)=>!prv);
    setWrongID(false);
    setUserData({user_name:"",email:"",password:""});
  }

  
  const formDataSubmit=async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!isWait){
      setIsWait(true);
      if(isLogin){
        if(await req_login(userData)){
          router.push("/");
          setIsWait(false);
        }else{
          setWrongID(true);
          setIsWait(false);
        }
      }else{
        if(userData.email && await req_signup(userData)){
          setMyStore({user_name:userData.user_name,email:userData.email,isVerify:false});
          await req_send_email(userData.user_name);
          router.push("/login/verify");
        }else{
          setWrongID(true);
          setIsWait(false);
        }
      }
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-blue-500">
      <main className="bg-black/60 p-8 rounded-lg shadow-lg w-96 text-white transition duration-300 transform">
        <h1 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? "Login":"Sign Up"}
        </h1>
        {
          wrongID && (
            <div className="flex items-center justify-center">
              <span className="text-red-500">Something is wrong</span>
            </div>
          )
        }
        <form action="" onSubmit={formDataSubmit}>
        <div className="mb-4">
              <label htmlFor="username"
              className="block text-sm font-medium mb-1">
                Username
              </label>
              <input value={userData.user_name} onChange={(e)=>setUserData((prv)=>({...prv,user_name:e.target.value}))} type="text" id="username" placeholder="Enter your email" 
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring focus:ring-blue-500"/>
            </div>
          {!isLogin && (
            <div className="mb-4">
            <label htmlFor="email"
            className="block text-sm font-medium mb-1">
              Email
            </label>
            <input value={userData.email} onChange={(e)=>setUserData((prv)=>({...prv,email:e.target.value}))} type="text" id="email" placeholder="Enter your username" 
            className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring focus:ring-blue-500"/>
          </div>
          )}
            
            <div className="mb-4">
              <label htmlFor="password"
              className="block text-sm font-medium mb-1">
                Password
              </label>
              <input value={userData.password} onChange={(e)=>setUserData((prv)=>({...prv,password:e.target.value}))} type="text" id="password" placeholder="Enter your username" 
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded focus:outline-none focus:ring focus:ring-blue-500"/>
            </div>
            <button type="submit"
            className={`w-full relative ${isWait ? "bg-gray-500" :"bg-blue-500 hover:bg-green-600"} text-white font-medium py-2 px-4 rounded transition duration-300`}>
              {isLogin?"Login":"Sign Up"}
              {
                isWait && (<div className="absolute right-24 top-2 animate-spin w-7 h-7 border-t-transparent border-solid rounded-full border-green-500 border-4 "></div>)
              }
            </button>
        </form>
        <button
            onClick={toggleForm}
            className="w-full mt-4 bg-transparent hover:text-blue-500 font-medium text-sm transition duration-300">
              {isLogin?"Don't have an account? Sign Up":"Already have an account? Login"}
            </button>

            {isLogin?(
              <Link href={"/login/forget_password"}
              className="w-full mt-2 hover:text-blue-500 transition duration-300 flex items-center justify-center"
              >
                Forget Password
              </Link>
            ):""}
      </main>
    </div>
  )
}

export default Login;
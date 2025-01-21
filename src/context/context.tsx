"use client"
import React, { createContext, useContext, useState } from 'react'
interface user_data_type{
    user_name:string;
    email:string;
    isVerify:boolean;
}
interface context_type{
    myStore:user_data_type;
    setMyStore:(store:user_data_type)=>void;
}
const context = createContext<context_type|undefined>(undefined);

const ContextProvider:React.FC<Readonly<{
    children: React.ReactNode;
  }>> = ({children}) => {
    const [myStore, setMyStore] = useState<user_data_type>({user_name:"",email:"",isVerify:false});
  return (
    <context.Provider value={{myStore,setMyStore}}>
        {children}
    </context.Provider>
  )
}

export const useStore = ()=>{
    const useStoreContext = useContext(context);
    if(!useStoreContext){
        throw new Error("context error");
    }
    return useStoreContext;
}

export default ContextProvider;
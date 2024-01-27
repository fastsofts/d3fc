import Head from 'next/head';
import dynamic from "next/dynamic";
import * as React from "react";


import {
  BrowserRouter,
  Routes,
  Route,
  HashRouter,
  Switch
} from "react-router-dom";
import ClientOnly from './components/ClientOnly';
const ForceGraphInit = dynamic(() => import("./components/ForceGraphInit"), { ssr: false });

function App() {  
  const [screenwidth, setWidth] = React.useState(window.innerWidth); 
  let hgtt = 0;
  if (window.innerWidth<600){
      hgtt = window.innerHeight; 
      if (window.innerWidth > 490 && window.innerWidth < 512){
          hgtt += 10;
      }
  }else{
       hgtt = window.innerHeight;
  }
  const [screenheight, setHeight] = React.useState(hgtt); 
  const toggleNavigation = (e) =>{
      setisNavOpen(!isNavOpen);   
  };
 

  const handleResize = React.useCallback(()=>{
     setWidth(window.innerWidth);
     let hgtt = 0;
     if (window.innerWidth<600){
         hgtt = window.innerHeight-35; 
         if (window.innerWidth > 490 && window.innerWidth < 512){
             hgtt += 10;
         }
         if (window.innerWidth > 571 && window.innerWidth < 599){
             hgtt += 50;
         }
         if (window.innerWidth > 570 && window.innerWidth < 572){
             hgtt += 45;
         }
         if (window.innerWidth > 509 && window.innerWidth < 571){
             hgtt += 25;
         }
         if (window.innerWidth > 500 && window.innerWidth < 510){
             hgtt += 15;
         }
         if (window.innerWidth < 500){
             hgtt -= 10;
         }
     }else{
         hgtt = window.innerHeight;
     }
     setHeight(hgtt);
  },[]);

  const handleResized = React.useCallback(()=>{
    setTimeout(()=>{
       handleResize();
    },1000);
  },[handleResize]);

  React.useEffect(() => {
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResized);
  }, [handleResize,handleResized]);

  React.useEffect(()=>{
    setTimeout(()=>{
       handleResize();
    },500);
  },[handleResize]);

  const routechanged = (e)=>{
    setTimeout(()=>{
       handleResize();
    },1000);
  }
 

  return (
   <ClientOnly> 
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-2 sm:px-3 lg:px-4">
       <div className="w-full min-h-screen grid grid-rows-[min-content_1fr_min-content] ">
         <Head>
           <title>D3 Force</title>
           <meta name="description" content="" />
           <link rel="icon" href="/favicon.ico" />
         </Head>
         <div className="max-w-full w-full">
            <HashRouter>
                 <Routes>
                   <Route path="/"  element={<ForceGraphInit routeChanged={routechanged} screenwidth={screenwidth} screenheight={screenheight}/>} />
                 </Routes>
            </HashRouter>
         </div>
       </div>
    </div>
   </ClientOnly>
  );
}

export default App;
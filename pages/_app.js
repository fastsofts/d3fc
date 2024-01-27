import '../styles/globals.css';
import './App.css';
import dynamic from "next/dynamic";
import { wrapper, makeStore } from "../store/store";
import { Provider } from "react-redux";
import  './components/utils/Tooltip.scss'

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}


const  App = ({ Component, pageProps }) => {
  return <SafeHydrate><Provider store={makeStore()}><Component {...pageProps} /></Provider></SafeHydrate>
}

export default wrapper.withRedux(dynamic(() => Promise.resolve(App), {
  ssr: true,
}));

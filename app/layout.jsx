
import Navbar from "@components/Navbar";
import SessionProviderComponent from "@components/SessionProviderComponent";
import "@styles/global.css";

export const metadata = {
    title: 'Fitness Flex',
    description: 'Gym Management Web App!',
  }

export default function RootLayout({children}){
    return(

        <html lang="en" className="h-full w-full font-inter">
        <SessionProviderComponent>
    
        <body className=" bg-[#eff2f5] dark:bg_color text-black h-full w-full">
            <Navbar/>
                {children}
        </body>
        </SessionProviderComponent>
        </html>
        
    
    )
}
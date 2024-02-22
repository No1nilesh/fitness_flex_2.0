
import Navbar from "@components/Navbar";
import SessionProviderComponent from "@components/SessionProviderComponent";
import "@styles/global.css";

export const metadata = {
    title: 'Fitness Flex',
    description: 'Gym Management Web App!',
  }

export default function RootLayout({children}){
    return(
        <html lang="en" className="h-full w-full">
        <SessionProviderComponent>
    
        <body className="bg_color text-white h-full w-full">
            <Navbar/>
                {children}
        </body>
        </SessionProviderComponent>
        </html>
    )
}
import HomeLayout from "@/components/home/HomeLayout.compo";
import LanguageSelector from "@/components/_share/language_model/LanguageSelector.compo";
import {ToastContainer} from "react-toastify";



export default function Layout({children,}: { children: React.ReactNode }) {
    return (
        <>
                <HomeLayout>
                    {children}
                    <LanguageSelector />
                </HomeLayout>
        </>
    );
}